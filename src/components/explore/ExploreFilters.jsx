'use client'

import { useState } from 'react'
import { Search, RotateCcw, ChevronDown } from 'lucide-react'

const durationOptions = [
  { label: '1-3 days', value: '1-3' },
  { label: '4-7 days', value: '4-7' },
  { label: '8-14 days', value: '8-14' },
  { label: '15+ days', value: '15-30' },
]

const styleOptions = ['Relaxed', 'Balanced', 'Adventure']
const interestOptions = ['Nature', 'History', 'Food', 'Shopping', 'Nightlife', 'Adventure', 'Culture', 'Wildlife']
const companionOptions = ['All', 'Solo', 'Couple', 'Family', 'Friends']

export default function ExploreFilters({ filters, onChange }) {
  const [open, setOpen] = useState(false)

  function toggle(arrKey, value) {
    const current = filters[arrKey] || []
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    onChange({ ...filters, [arrKey]: next })
  }

  function clear() {
    onChange({ search: '', budgetMin: '', budgetMax: '', duration: [], travelStyle: [], interests: [], companion: 'All', sort: 'newest' })
  }

  const hasFilters = filters.search || filters.budgetMin || filters.budgetMax || filters.duration?.length || filters.travelStyle?.length || filters.interests?.length || filters.companion !== 'All'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search destinations..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[--border-default] text-sm bg-warm-50 dark:bg-slate-700 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
          />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="h-10 px-3 rounded-lg border border-[--border-default] text-sm text-[--text-body] hover:bg-[--bg-card-hover] transition-colors flex items-center gap-1"
        >
          Filters
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.5} />
        </button>
      </div>

      {open && (
        <div className="space-y-4 pt-2 border-t border-warm-100 dark:border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[--text-heading] mb-1.5">Budget Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.budgetMin || ''}
                  onChange={(e) => onChange({ ...filters, budgetMin: e.target.value })}
                  className="w-full h-9 px-2 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <span className="text-xs text-[--text-secondary]">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.budgetMax || ''}
                  onChange={(e) => onChange({ ...filters, budgetMax: e.target.value })}
                  className="w-full h-9 px-2 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[--text-heading] mb-1.5">Companion</label>
              <select
                value={filters.companion || 'All'}
                onChange={(e) => onChange({ ...filters, companion: e.target.value })}
                className="w-full h-9 px-2 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {companionOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[--text-heading] mb-1.5">Duration</label>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggle('duration', opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    (filters.duration || []).includes(opt.value)
                      ? 'bg-orange-500 text-white'
                      : 'bg-warm-50 dark:bg-slate-700 text-[--text-body] border border-[--border-default] hover:border-orange-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[--text-heading] mb-1.5">Travel Style</label>
            <div className="flex flex-wrap gap-2">
              {styleOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle('travelStyle', s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    (filters.travelStyle || []).includes(s)
                      ? 'bg-orange-500 text-white'
                      : 'bg-warm-50 dark:bg-slate-700 text-[--text-body] border border-[--border-default] hover:border-orange-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[--text-heading] mb-1.5">Interests</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggle('interests', interest)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    (filters.interests || []).includes(interest)
                      ? 'bg-orange-500 text-white'
                      : 'bg-warm-50 dark:bg-slate-700 text-[--text-body] border border-[--border-default] hover:border-orange-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={clear}
              className="flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
