'use client'

import Link from 'next/link'
import { Trash2, ExternalLink } from 'lucide-react'

const statusStyles = {
  completed: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  generating: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  failed: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
}

export default function TripTable({ trips, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-warm-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-warm-200 dark:border-slate-700 bg-warm-50 dark:bg-slate-800/50">
            <th className="text-left px-4 py-3 text-xs font-medium text-[--text-secondary]">Title</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[--text-secondary] hidden sm:table-cell">Destination</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[--text-secondary] hidden md:table-cell">Duration</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[--text-secondary] hidden md:table-cell">Budget</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[--text-secondary]">Status</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[--text-secondary] hidden lg:table-cell">Created</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-[--text-secondary]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-warm-200 dark:divide-slate-700">
          {trips.map((trip) => (
            <tr key={trip._id} className="hover:bg-warm-50/50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-3">
                <Link href={`/dashboard/trips/${trip._id}`} className="text-sm font-medium text-[--text-heading] hover:text-orange-600 transition-colors">
                  {trip.title || trip.destination}
                </Link>
              </td>
              <td className="px-4 py-3 text-[--text-secondary] hidden sm:table-cell">{trip.destination}</td>
              <td className="px-4 py-3 text-[--text-secondary] hidden md:table-cell">{trip.duration} days</td>
              <td className="px-4 py-3 text-[--text-secondary] hidden md:table-cell">{trip.currency} {trip.budget?.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${statusStyles[trip.status] || statusStyles.completed}`}>
                  {trip.status}
                </span>
              </td>
              <td className="px-4 py-3 text-[--text-secondary] hidden lg:table-cell">
                {new Date(trip.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/dashboard/trips/${trip._id}`}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[--text-secondary] hover:bg-[--bg-card-hover] transition-colors"
                    aria-label="View trip"
                  >
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>
                  <button
                    onClick={() => onDelete?.(trip._id)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    aria-label="Delete trip"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
