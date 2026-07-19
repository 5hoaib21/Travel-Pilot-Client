'use client'

import Link from 'next/link'
import { Heart, MoreHorizontal, ExternalLink, Trash2 } from 'lucide-react'
import { useState } from 'react'

const statusStyles = {
  completed: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  generating: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  failed: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
}

export default function TripCard({ trip, onDelete, onFavoriteToggle }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const statusClass = statusStyles[trip.status] || statusStyles.completed

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="h-36 rounded-t-xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950 dark:to-slate-800 flex items-center justify-center">
        <span className="text-4xl font-heading font-bold text-orange-200 dark:text-orange-800">
          {trip.destination?.charAt(0) || '?'}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <Link href={`/dashboard/trips/${trip._id}`} className="text-sm font-semibold text-[--text-heading] hover:text-orange-600 transition-colors truncate block">
              {trip.title || trip.destination}
            </Link>
            <p className="text-xs text-[--text-secondary] truncate">{trip.destination}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onFavoriteToggle?.(trip._id, !trip.favorite)}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[--bg-card-hover] transition-colors"
              aria-label={trip.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 ${trip.favorite ? 'fill-red-400 text-red-400' : 'text-[--text-secondary]'}`}
                strokeWidth={1.5}
              />
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[--bg-card-hover] transition-colors"
                aria-label="Trip actions"
              >
                <MoreHorizontal className="w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-36 bg-[--bg-elevated] rounded-lg border border-[--border-default] shadow-lg py-1 z-20">
                    <Link
                      href={`/dashboard/trips/${trip._id}`}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-[--text-body] hover:bg-[--bg-card-hover] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                      View Details
                    </Link>
                    <button
                      onClick={() => { setMenuOpen(false); onDelete?.(trip._id) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${statusClass}`}>
            {trip.status}
          </span>
          <span className="text-[11px] text-[--text-secondary]">{trip.duration} days</span>
          <span className="text-[11px] text-[--text-secondary]">
            {trip.currency} {trip.budget?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
