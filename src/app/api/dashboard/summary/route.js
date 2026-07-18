import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const userId = session.user.id

    const tripsCollection = db.collection('trips')
    const generationsCollection = db.collection('ai_generations')

    const [tripCount, favoriteCount, recentTrips, aiUsageThisMonth] = await Promise.all([
      tripsCollection.countDocuments({ userId }),
      tripsCollection.countDocuments({ userId, favorite: true }),
      tripsCollection
        .find({ userId }, { sort: { createdAt: -1 }, limit: 5, projection: { title: 1, destination: 1, status: 1, budget: 1, currency: 1, duration: 1, createdAt: 1 } })
        .toArray(),
      generationsCollection
        .countDocuments({
          userId,
          featureType: { $in: ['planner', 'budgeter', 'curator', 'reviewer', 'copilot'] },
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        }),
    ])

    return Response.json({
      tripCount,
      favoriteCount,
      conversationCount: 0,
      recentTrips: recentTrips.map((t) => ({
        _id: t._id.toString(),
        title: t.title,
        destination: t.destination,
        status: t.status,
        budget: t.budget,
        currency: t.currency,
        duration: t.duration,
        createdAt: t.createdAt,
      })),
      aiUsageThisMonth,
    })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
