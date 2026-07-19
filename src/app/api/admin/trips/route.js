import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    if (session.user.role !== 'admin') return Response.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })

    const url = new URL(req.url)
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit')) || 25))
    const skip = (page - 1) * limit
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''
    const destination = url.searchParams.get('destination') || ''
    const dateFrom = url.searchParams.get('dateFrom') || ''
    const dateTo = url.searchParams.get('dateTo') || ''

    const filter = {}
    if (search) {
      const regex = { $regex: search, $options: 'i' }
      const userIds = await db.collection('user').find({ $or: [{ name: regex }, { email: regex }] }).project({ _id: 1 }).toArray()
      const ids = userIds.map((u) => u._id.toString())
      filter.$or = [
        { title: regex },
        { destination: regex },
        { userId: { $in: ids } },
      ]
    }
    if (status) filter.status = status
    if (destination) filter.destination = { $regex: destination, $options: 'i' }
    if (dateFrom || dateTo) {
      filter.createdAt = {}
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom)
      if (dateTo) filter.createdAt.$lte = new Date(dateTo)
    }

    const [trips, total] = await Promise.all([
      db.collection('trips').find(filter, { sort: { createdAt: -1 }, skip, limit }).toArray(),
      db.collection('trips').countDocuments(filter),
    ])

    const userIds = [...new Set(trips.map((t) => t.userId).filter(Boolean))]
    const users = userIds.length > 0 ? await db.collection('user').find({ _id: { $in: userIds.map((id) => { try { return new ObjectId(id) } catch { return id } }) } }, { projection: { name: 1, email: 1 } }).toArray() : []
    const userMap = {}
    users.forEach((u) => { userMap[u._id.toString()] = u })

    const enriched = trips.map((t) => ({
      ...t,
      _id: t._id.toString(),
      user: userMap[t.userId] || null,
    }))

    return Response.json({ trips: enriched, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
