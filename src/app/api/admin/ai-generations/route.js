import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    if (session.user.role !== 'admin') return Response.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })

    const url = new URL(req.url)
    const featureType = url.searchParams.get('featureType') || ''
    const status = url.searchParams.get('status') || ''
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 100))

    const filter = {}
    if (featureType) filter.featureType = featureType
    if (status === 'success') filter.success = true
    else if (status === 'failed') filter.success = false

    const generations = await db.collection('ai_generations')
      .find(filter, { sort: { createdAt: -1 }, limit })
      .toArray()

    const userIds = [...new Set(generations.map((g) => g.userId).filter(Boolean))]
    const users = userIds.length > 0 ? await db.collection('user').find({ _id: { $in: userIds.map((id) => { try { return new ObjectId(id) } catch { return id } }) } }, { projection: { name: 1, email: 1 } }).toArray() : []
    const userMap = {}
    users.forEach((u) => { userMap[u._id.toString()] = u })

    const enriched = generations.map((g) => ({
      ...g,
      _id: g._id.toString(),
      user: userMap[g.userId] || null,
    }))

    return Response.json({ generations: enriched })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
