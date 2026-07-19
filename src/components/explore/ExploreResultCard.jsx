'use client'

import Link from 'next/link'
import { MapPin, Clock, DollarSign, User } from 'lucide-react'

export default function ExploreResultCard({ trip }) {
  return (
    <Link
      href={`/shared/${trip._id}`}
      className="block bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="h-32 rounded-t-xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950 dark:to-slate-800 flex items-center justify-center">
        <span className="text-3xl font-heading font-bold text-orange-200 dark:text-orange-800">
          {trip.destination?.charAt(0) || '?'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[--text-heading] truncate mb-1">{trip.title || trip.destination}</h3>
        <p className="text-xs text-[--text-secondary] truncate mb-3">{trip.destination}</p>
        <div className="flex items-center gap-3 flex-wrap text-xs text-[--text-secondary]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            {trip.duration} days
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" strokeWidth={1.5} />
            {trip.currency} {trip.budget?.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" strokeWidth={1.5} />
            {trip.travelStyle}
          </span>
        </div>
      </div>
    </Link>
  )
}
