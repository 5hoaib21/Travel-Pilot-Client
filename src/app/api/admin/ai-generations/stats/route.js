import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    if (session.user.role !== 'admin') return Response.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const dailyData = await db.collection('ai_generations').aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        total: { $sum: 1 },
        success: { $sum: { $cond: ['$success', 1, 0] } },
        failed: { $sum: { $cond: [{ $not: '$success' }, 1, 0] } },
      }},
      { $sort: { _id: 1 } },
    ]).toArray()

    const successFailure = await db.collection('ai_generations').aggregate([
      { $group: {
        _id: '$success',
        count: { $sum: 1 },
      }},
    ]).toArray()

    const successCount = successFailure.find((s) => s._id === true)?.count || 0
    const failureCount = successFailure.find((s) => s._id !== true)?.count || 0

    const avgResponseTime = await db.collection('ai_generations').aggregate([
      { $match: { responseTimeMs: { $exists: true, $ne: null } } },
      { $group: {
        _id: '$featureType',
        avgMs: { $avg: '$responseTimeMs' },
        count: { $sum: 1 },
      }},
      { $sort: { avgMs: -1 } },
    ]).toArray()

    const topUsers = await db.collection('ai_generations').aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]).toArray()

    const userIds = topUsers.map((u) => u._id).filter(Boolean)
    const users = userIds.length > 0 ? await db.collection('user').find(
      { _id: { $in: userIds.map((id) => { try { return new ObjectId(id) } catch { return id } }) } },
      { projection: { name: 1, email: 1 } }
    ).toArray() : []
    const userMap = {}
    users.forEach((u) => { userMap[u._id.toString()] = u })
    const topUsersWithNames = topUsers.map((u) => ({
      userId: u._id,
      count: u.count,
      name: userMap[u._id]?.name || userMap[u._id]?.email || 'Unknown',
    }))

    return Response.json({
      dailyData,
      successRate: { success: successCount, failed: failureCount },
      avgResponseTime,
      topUsers: topUsersWithNames,
    })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
