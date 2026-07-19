'use client'

import { Search, ChevronDown } from 'lucide-react'

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'budget_high', label: 'Budget: High to Low' },
  { value: 'budget_low', label: 'Budget: Low to High' },
  { value: 'duration', label: 'Duration: Long to Short' },
]

export default function TripFilters({ search, onSearchChange, status, onStatusChange, sort, onSortChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search trips..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full sm:w-auto h-9 px-3 pr-8 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="generating">Generating</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[--text-secondary] pointer-events-none" strokeWidth={1.5} />
        </div>

        <div className="relative flex-1 sm:flex-initial">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto h-9 px-3 pr-8 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[--text-secondary] pointer-events-none" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}
