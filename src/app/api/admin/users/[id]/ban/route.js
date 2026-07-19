import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PATCH(req, { params }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }
    if (session.user.role !== 'admin') {
      return Response.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })
    }

    const { id } = await params

    const user = await db.collection('user').findOne({ _id: new ObjectId(id) })
    if (!user) {
      return Response.json({ error: 'User not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    const banned = !user.banned
    await db.collection('user').updateOne(
      { _id: new ObjectId(id) },
      { $set: { banned, updatedAt: new Date() } }
    )

    return Response.json({ banned })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
