'use client'

import { MapPin, Clock, DollarSign, Star } from 'lucide-react'

const categoryColors = {
  attraction: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
  meal: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
  transport: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
  rest: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
}

export default function DayActivity({ activity }) {
  const colorClass = categoryColors[activity.category] || categoryColors.attraction

  return (
    <div className="p-3 rounded-lg bg-warm-50 dark:bg-slate-800/50 border border-warm-100 dark:border-slate-700">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="text-sm font-semibold text-[--text-heading]">{activity.title}</h4>
        <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full border ${colorClass}`}>
          {activity.category}
        </span>
      </div>
      {activity.description && (
        <p className="text-xs text-[--text-secondary] mb-2 leading-relaxed">{activity.description}</p>
      )}
      <div className="flex items-center gap-3 flex-wrap text-xs text-[--text-secondary]">
        {activity.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" strokeWidth={1.5} />
            {activity.location}
          </span>
        )}
        {activity.recommendedDuration && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" strokeWidth={1.5} />
            {activity.recommendedDuration}
          </span>
        )}
        {activity.cost != null && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" strokeWidth={1.5} />
            {activity.cost}
          </span>
        )}
        {activity.rating && (
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" strokeWidth={1.5} />
            {activity.rating}
          </span>
        )}
      </div>
    </div>
  )
}
