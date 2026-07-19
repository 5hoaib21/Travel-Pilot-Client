import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }
    if (session.user.role !== 'admin') {
      return Response.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })
    }

    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [totalUsers, totalTrips, totalGenerations, failedGenerations, activeUsers, tripsToday] = await Promise.all([
      db.collection('user').countDocuments(),
      db.collection('trips').countDocuments(),
      db.collection('ai_generations').countDocuments(),
      db.collection('ai_generations').countDocuments({ success: false }),
      db.collection('user').countDocuments({ lastLoginAt: { $gte: firstOfMonth } }),
      db.collection('trips').countDocuments({ createdAt: { $gte: startOfToday } }),
    ])

    const failedPercentage = totalGenerations > 0 ? Math.round((failedGenerations / totalGenerations) * 100) : 0

    return Response.json({ totalUsers, totalTrips, totalGenerations, failedGenerations, failedPercentage, activeUsers, tripsToday })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
