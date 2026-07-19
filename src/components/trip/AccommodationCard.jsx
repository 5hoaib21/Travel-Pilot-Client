'use client'

import { Bed, DollarSign, Star, FileText } from 'lucide-react'

export default function AccommodationCard({ accommodation }) {
  if (!accommodation) return null

  return (
    <div className="p-3 rounded-lg border border-dashed border-sky-200 bg-sky-50/50 dark:border-sky-800 dark:bg-sky-950/30">
      <div className="flex items-center gap-2 mb-1">
        <Bed className="w-4 h-4 text-sky-500" strokeWidth={1.5} />
        <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">Accommodation</span>
      </div>
      <p className="text-sm font-medium text-[--text-heading]">{accommodation.name}</p>
      <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-[--text-secondary]">
        <span>{accommodation.type}</span>
        {accommodation.costPerNight != null && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" strokeWidth={1.5} />
            {accommodation.costPerNight}/night
          </span>
        )}
        {accommodation.rating && (
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" strokeWidth={1.5} />
            {accommodation.rating}
          </span>
        )}
      </div>
      {accommodation.notes && (
        <p className="flex items-start gap-1 mt-1.5 text-xs text-[--text-secondary]">
          <FileText className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={1.5} />
          {accommodation.notes}
        </p>
      )}
    </div>
  )
}
