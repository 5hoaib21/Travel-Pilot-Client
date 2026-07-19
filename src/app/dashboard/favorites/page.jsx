'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, PlusCircle, Luggage } from 'lucide-react'
import TripGrid from '@/components/trip/TripGrid'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { TripCardSkeletonGrid } from '@/components/common/LoadingSkeleton'
import EmptyState from '@/components/common/EmptyState'

export default function FavoritesPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  async function fetchFavorites() {
    setLoading(true)
    try {
      const res = await fetch('/api/trips/favorites')
      const data = await res.json()
      setTrips(data.trips || [])
    } catch {
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFavorites() }, [])

  async function handleFavoriteToggle(id, favorite) {
    setTrips((prev) =>
      favorite ? prev.map((t) => (t._id === id ? { ...t, favorite } : t)) : prev.filter((t) => t._id !== id)
    )
    try {
      await fetch(`/api/trips/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite }),
      })
      if (!favorite) fetchFavorites()
    } catch {
      fetchFavorites()
    }
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      setTrips((prev) => prev.filter((t) => t._id !== id))
    }
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 fill-red-400 text-red-400" strokeWidth={1.5} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[--text-heading] mb-1">
              Favorites
            </h1>
            <p className="text-sm text-[--text-secondary]">
              {trips.length} {trips.length === 1 ? 'trip' : 'trips'} saved
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 h-9 px-4 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" strokeWidth={1.5} />
          New Trip
        </Link>
      </motion.div>

      {loading ? (
        <TripCardSkeletonGrid count={3} />
      ) : trips.length === 0 ? (
        <EmptyState
          icon="favorites"
          title="No favorites yet"
          description="Save your favorite trips by tapping the heart icon on any trip card."
          actionLabel="Browse Trips"
          actionHref="/dashboard/trips"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <TripGrid trips={trips} onDelete={setDeleteId} onFavoriteToggle={handleFavoriteToggle} />
        </motion.div>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Trip"
          message="Are you sure you want to delete this trip? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
