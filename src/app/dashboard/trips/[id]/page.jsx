'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Trash2, Heart, MessageCircle } from 'lucide-react'
import { useTrip } from '@/hooks/useTrip'
import DayTimeline from '@/components/trip/DayTimeline'
import BudgetTable from '@/components/trip/BudgetTable'
import BudgetChart from '@/components/trip/BudgetChart'
import TravelTips from '@/components/trip/TravelTips'
import CopilotPanel from '@/components/copilot/CopilotPanel'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { useRouter } from 'next/navigation'

export default function TripDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: trip, loading, error } = useTrip(id)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)

  useEffect(() => {
    if (trip) setFavorite(trip.favorite || false)
  }, [trip])

  async function handleFavoriteToggle() {
    const next = !favorite
    setFavorite(next)
    try {
      await fetch(`/api/trips/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: next }),
      })
    } catch {
      setFavorite(!next)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' })
      if (res.ok || res.status === 204) {
        router.push('/dashboard/trips')
      }
    } catch {} finally {
      setDeleting(false)
      setShowDelete(false)
    }
  }

  async function handleRegenerate() {
    try {
      const res = await fetch(`/api/trips/${id}/regenerate`, { method: 'POST' })
      if (res.ok) {
        router.refresh()
      }
    } catch {}
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-48 w-full" />
        <div className="skeleton h-32 w-full" />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-heading font-bold text-[--text-heading] mb-2">Trip not found</h2>
        <p className="text-sm text-[--text-secondary] mb-6">This trip doesn&apos;t exist or you don&apos;t have access.</p>
        <Link
          href="/dashboard/trips"
          className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to My Trips
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/dashboard/trips"
          className="inline-flex items-center gap-1.5 text-xs text-[--text-secondary] hover:text-[--text-body] transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          Back to My Trips
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[--text-heading] mb-1">
              {trip.title || trip.destination}
            </h1>
            <div className="flex items-center gap-3 text-sm text-[--text-secondary]">
              <span>{trip.destination}</span>
              <span className="w-1 h-1 rounded-full bg-[--border-default]" />
              <span>{trip.duration} days</span>
              <span className="w-1 h-1 rounded-full bg-[--border-default]" />
              <span>{trip.currency} {trip.budget?.toLocaleString()}</span>
              <span className="w-1 h-1 rounded-full bg-[--border-default]" />
              <span className="capitalize">{trip.travelStyle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteToggle}
              className="inline-flex items-center justify-center h-9 w-9 text-[--text-secondary] border border-[--border-default] rounded-lg hover:bg-[--bg-card-hover] transition-colors"
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 ${favorite ? 'fill-red-400 text-red-400' : ''}`}
                strokeWidth={1.5}
              />
            </button>
            <button
              onClick={handleRegenerate}
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-950 transition-colors"
            >
              <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
              Regenerate
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950 transition-colors"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      {trip.days && trip.days.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[--text-heading]">Itinerary</h2>
          {trip.days.map((day, i) => (
            <motion.div
              key={day.dayNumber || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <DayTimeline
                day={day}
                dayIndex={i}
                onRegenerateDay={async (dayNumber) => {
                  try {
                    await fetch(`/api/trips/${id}/regenerate-day`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ dayNumber }),
                    })
                    router.refresh()
                  } catch {}
                }}
              />
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md"
      >
        <BudgetChart budgetBreakdown={trip.budgetBreakdown} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <BudgetTable budgetBreakdown={trip.budgetBreakdown} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <TravelTips tips={trip.tips} />
        </motion.div>
      </div>

      {showDelete && (
        <ConfirmDialog
          title="Delete Trip"
          message="Are you sure you want to delete this trip? This action cannot be undone."
          confirmLabel={deleting ? 'Deleting...' : 'Delete'}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      <button
        onClick={() => setCopilotOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-orange-500 text-white shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors z-40"
        aria-label="Open Travel Copilot"
      >
        <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
      </button>

      <CopilotPanel
        tripId={id}
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        onTripUpdated={() => router.refresh()}
      />
    </div>
  )
}
