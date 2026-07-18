import { auth } from '@/lib/auth'
import { db } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const ALLOWED_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'THB', 'SGD', 'MYR']
const ALLOWED_STYLES = ['Relaxed', 'Balanced', 'Adventure']
const ALLOWED_INTERESTS = ['Nature', 'History', 'Food', 'Shopping', 'Nightlife', 'Adventure', 'Culture', 'Wildlife']
const ALLOWED_COMPANIONS = ['Solo', 'Couple', 'Family', 'Friends']

const VALID_CURRENCIES = new Set(ALLOWED_CURRENCIES)
const VALID_STYLES = new Set(ALLOWED_STYLES)
const VALID_INTERESTS = new Set(ALLOWED_INTERESTS)
const VALID_COMPANIONS = new Set(ALLOWED_COMPANIONS)

function validateCreate(body) {
  const errors = []
  const { destination, budget, currency, duration, travelStyle, interests, companion, additionalNotes } = body

  if (!destination || typeof destination !== 'string' || destination.length < 2)
    errors.push({ field: 'destination', message: 'Destination must be at least 2 characters' })
  if (destination && destination.length > 100)
    errors.push({ field: 'destination', message: 'Destination must be under 100 characters' })

  if (typeof budget !== 'number' || budget <= 0 || budget > 1000000)
    errors.push({ field: 'budget', message: 'Budget must be between 1 and 1,000,000' })

  if (!currency || !VALID_CURRENCIES.has(currency))
    errors.push({ field: 'currency', message: 'Unsupported currency' })

  if (!Number.isInteger(duration) || duration < 1 || duration > 30)
    errors.push({ field: 'duration', message: 'Duration must be an integer between 1 and 30' })

  if (!travelStyle || !VALID_STYLES.has(travelStyle))
    errors.push({ field: 'travelStyle', message: 'Travel style is required' })

  if (!Array.isArray(interests) || interests.length === 0)
    errors.push({ field: 'interests', message: 'Select at least one interest' })
  else if (interests.some((i) => !VALID_INTERESTS.has(i)))
    errors.push({ field: 'interests', message: 'Invalid interest selected' })

  if (!companion || !VALID_COMPANIONS.has(companion))
    errors.push({ field: 'companion', message: 'Companion type is required' })

  if (additionalNotes && (typeof additionalNotes !== 'string' || additionalNotes.length > 500))
    errors.push({ field: 'additionalNotes', message: 'Notes must be under 500 characters' })

  return errors
}

function stripHtml(str) {
  if (typeof str !== 'string') return str
  return str.replace(/<[^>]*>/g, '')
}

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const url = new URL(req.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit')) || 10))
    const skip = (page - 1) * limit

    const tripsCollection = db.collection('trips')
    const [trips, total] = await Promise.all([
      tripsCollection
        .find(
          { userId: session.user.id },
          {
            sort: { createdAt: -1 },
            skip,
            limit,
            projection: {
              title: 1, destination: 1, status: 1, budget: 1, currency: 1,
              duration: 1, travelStyle: 1, favorite: 1, createdAt: 1,
            },
          }
        )
        .toArray(),
      tripsCollection.countDocuments({ userId: session.user.id }),
    ])

    return Response.json({
      trips: trips.map((t) => ({ ...t, _id: t._id.toString() })),
      total,
      page,
      limit,
    })
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const body = await req.json()
    const errors = validateCreate(body)

    if (errors.length > 0) {
      return Response.json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: errors }, { status: 400 })
    }

    const tripsCollection = db.collection('trips')

    const trip = {
      userId: session.user.id,
      title: `${body.destination} Trip`,
      destination: stripHtml(body.destination),
      budget: body.budget,
      currency: body.currency,
      duration: body.duration,
      travelStyle: body.travelStyle,
      interests: body.interests,
      companion: body.companion,
      additionalNotes: body.additionalNotes ? stripHtml(body.additionalNotes) : '',
      days: [],
      budgetBreakdown: [],
      tips: [],
      status: 'generating',
      favorite: false,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await tripsCollection.insertOne(trip)

    return Response.json(
      { trip: { ...trip, _id: result.insertedId.toString() } },
      { status: 201 }
    )
  } catch (err) {
    return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR', details: err.message }, { status: 500 })
  }
}
