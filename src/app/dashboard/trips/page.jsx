'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PlusCircle, Luggage } from 'lucide-react'
import { useTrips } from '@/hooks/useTrips'
import TripFilters from '@/components/trip/TripFilters'
import TripGrid from '@/components/trip/TripGrid'
import TripTable from '@/components/trip/TripTable'
import ViewToggle from '@/components/common/ViewToggle'
import Pagination from '@/components/common/Pagination'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { TripCardSkeletonGrid } from '@/components/common/LoadingSkeleton'
import EmptyState from '@/components/common/EmptyState'

export default function TripsPage() {
  const {
    trips, loading, error, total, page, totalPages,
    setPage, setSearch, setStatus, setSort,
    deleteTrip, favoriteToggle, filters,
  } = useTrips()

  const [view, setView] = useState('grid')
  const [deleteId, setDeleteId] = useState(null)

  async function handleDelete(id) {
    await deleteTrip(id)
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[--text-heading] mb-1">
            My Trips
          </h1>
          <p className="text-sm text-[--text-secondary]">
            {total} {total === 1 ? 'trip' : 'trips'} planned
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 h-9 px-4 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" strokeWidth={1.5} />
          New Trip
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <TripFilters
          search={filters.search}
          onSearchChange={setSearch}
          status={filters.status}
          onStatusChange={setStatus}
          sort={filters.sort}
          onSortChange={setSort}
        />
        <ViewToggle value={view} onChange={setView} />
      </motion.div>

      {loading ? (
        <TripCardSkeletonGrid count={6} />
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-sm text-red-500">Failed to load trips. Please try again.</p>
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          icon="trips"
          title="No trips yet"
          description="Plan your first AI-powered itinerary and it will appear here."
          actionLabel="Plan Your First Trip"
          actionHref="/dashboard/new"
        />
      ) : (
        <>
          {view === 'grid' ? (
            <TripGrid trips={trips} onDelete={setDeleteId} onFavoriteToggle={favoriteToggle} />
          ) : (
            <TripTable trips={trips} onDelete={setDeleteId} />
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
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
