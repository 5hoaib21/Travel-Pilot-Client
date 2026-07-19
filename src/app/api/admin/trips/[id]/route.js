import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(req, { params }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    if (session.user.role !== 'admin') return Response.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return Response.json({ error: 'Invalid trip ID', code: 'INVALID_ID' }, { status: 400 })
    }

    const trip = await db.collection('trips').findOne({ _id: new ObjectId(id) })
    if (!trip) {
      return Response.json({ error: 'Trip not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    await db.collection('trips').deleteOne({ _id: new ObjectId(id) })
    await db.collection('ai_generations').deleteMany({ tripId: id })

    return new Response(null, { status: 204 })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
