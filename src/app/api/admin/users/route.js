import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }
    if (session.user.role !== 'admin') {
      return Response.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })
    }

    const url = new URL(req.url)
    const search = url.searchParams.get('search') || ''
    const sort = url.searchParams.get('sort') || 'createdAt'
    const order = url.searchParams.get('order') || 'desc'
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 25))
    const skip = (page - 1) * limit

    const filter = {}
    if (search) {
      const regex = { $regex: search, $options: 'i' }
      filter.$or = [{ name: regex }, { email: regex }]
    }

    const sortObj = { [sort]: order === 'asc' ? 1 : -1 }

    const [users, total] = await Promise.all([
      db.collection('user').find(filter, { sort: sortObj, skip, limit, projection: { password: 0 } }).toArray(),
      db.collection('user').countDocuments(filter),
    ])

    const userIds = users.map((u) => u._id.toString())
    const tripCounts = await db.collection('trips').aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]).toArray()
    const tripMap = {}
    tripCounts.forEach((t) => { tripMap[t._id] = t.count })
    const enriched = users.map((u) => ({ ...u, _id: u._id.toString(), tripsCount: tripMap[u._id.toString()] || 0 }))

    return Response.json({ users: enriched, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
