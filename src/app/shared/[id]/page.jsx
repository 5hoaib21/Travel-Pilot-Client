'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Luggage, MapPin, DollarSign, Clock } from 'lucide-react'
import DayTimeline from '@/components/trip/DayTimeline'
import BudgetTable from '@/components/trip/BudgetTable'
import TravelTips from '@/components/trip/TravelTips'

export default function SharedTripPage({ params }) {
  const { id } = use(params)
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await fetch(`/api/trips/shared/${id}`)
        if (!res.ok) throw new Error('Trip not found')
        const data = await res.json()
        setTrip(data.trip)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTrip()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-48 w-full" />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950 flex items-center justify-center mx-auto mb-4">
          <Luggage className="w-8 h-8 text-orange-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-heading font-bold text-[--text-heading] mb-2">Trip not found</h1>
        <p className="text-sm text-[--text-secondary] mb-6">
          This trip doesn&apos;t exist or hasn&apos;t been shared publicly.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 print:py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[--text-heading] mb-2">
          {trip.title || trip.destination}
        </h1>
        <div className="flex items-center gap-4 text-sm text-[--text-secondary] flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" strokeWidth={1.5} />
            {trip.destination}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" strokeWidth={1.5} />
            {trip.duration} days
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" strokeWidth={1.5} />
            {trip.currency} {trip.budget?.toLocaleString()}
          </span>
        </div>
      </motion.div>

      {trip.days && trip.days.length > 0 && (
        <div className="space-y-3 mb-6">
          <h2 className="text-lg font-heading font-bold text-[--text-heading]">Itinerary</h2>
          {trip.days.map((day, i) => (
            <DayTimeline key={day.dayNumber || i} day={day} dayIndex={i} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetTable budgetBreakdown={trip.budgetBreakdown} />
        <TravelTips tips={trip.tips} />
      </div>

      <div className="text-center mt-8 text-xs text-[--text-secondary] print:hidden">
        <p>Plan your own AI-powered trip at <Link href="/" className="text-orange-500 hover:underline">Travel Pilot</Link></p>
      </div>
    </div>
  )
}
