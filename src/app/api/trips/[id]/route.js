import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req, { params }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return Response.json({ error: 'Trip not found', code: 'TRIP_NOT_FOUND' }, { status: 404 })
    }

    const tripsCollection = db.collection('trips')
    const trip = await tripsCollection.findOne({ _id: new ObjectId(id) })

    if (!trip || trip.userId !== session.user.id) {
      return Response.json({ error: 'Trip not found', code: 'TRIP_NOT_FOUND' }, { status: 404 })
    }

    return Response.json({ ...trip, _id: trip._id.toString() })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return Response.json({ error: 'Trip not found', code: 'TRIP_NOT_FOUND' }, { status: 404 })
    }

    const tripsCollection = db.collection('trips')
    const trip = await tripsCollection.findOne({ _id: new ObjectId(id) })

    if (!trip || trip.userId !== session.user.id) {
      return Response.json({ error: 'Trip not found', code: 'TRIP_NOT_FOUND' }, { status: 404 })
    }

    await tripsCollection.deleteOne({ _id: new ObjectId(id) })

    return new Response(null, { status: 204 })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
