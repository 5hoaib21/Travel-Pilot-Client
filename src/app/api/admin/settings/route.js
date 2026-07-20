import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    if (session.user.role !== 'admin') return Response.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })

    const settings = await db.collection('settings').findOne({ _id: 'system' })
    return Response.json({
      settings: settings || {
        maintenanceMode: false,
        aiModel: 'llama-3.3-70b-versatile',
        rateLimit: 30,
        maxRetries: 2,
      },
    })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    if (session.user.role !== 'admin') return Response.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })

    const body = await req.json()
    const { maintenanceMode, aiModel, rateLimit, maxRetries } = body

    const update = {}
    if (typeof maintenanceMode === 'boolean') update.maintenanceMode = maintenanceMode
    if (aiModel && typeof aiModel === 'string' && aiModel.length > 0) update.aiModel = aiModel
    if (typeof rateLimit === 'number' && rateLimit > 0) update.rateLimit = rateLimit
    if (typeof maxRetries === 'number' && maxRetries >= 0) update.maxRetries = maxRetries
    update.updatedAt = new Date()
    update.updatedBy = session.user.id

    await db.collection('settings').updateOne(
      { _id: 'system' },
      { $set: update },
      { upsert: true }
    )

    const settings = await db.collection('settings').findOne({ _id: 'system' })
    return Response.json({ settings })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
