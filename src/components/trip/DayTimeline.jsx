'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sunrise, Sun, Moon } from 'lucide-react'
import DayActivity from './DayActivity'
import AccommodationCard from './AccommodationCard'

const timeSlots = [
  { key: 'morning', label: 'Morning', icon: Sunrise },
  { key: 'afternoon', label: 'Afternoon', icon: Sun },
  { key: 'evening', label: 'Evening', icon: Moon },
]

export default function DayTimeline({ day, dayIndex, onRegenerateDay }) {
  const [open, setOpen] = useState(dayIndex === 0)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open) } }}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm font-heading">{day.dayNumber}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-[--text-heading]">Day {day.dayNumber}</span>
            {day.date && <span className="text-xs text-[--text-secondary] ml-2">{day.date}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRegenerateDay && (
            <button
              onClick={(e) => { e.stopPropagation(); onRegenerateDay(day.dayNumber) }}
              className="px-3 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950 rounded-lg transition-colors"
            >
              Regenerate
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[--text-secondary] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            strokeWidth={1.5}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {timeSlots.map((slot) => {
                const activity = day[slot.key]
                if (!activity) return null
                return (
                  <div key={slot.key}>
                    <div className="flex items-center gap-2 mb-2">
                      <slot.icon className="w-4 h-4 text-orange-500" strokeWidth={1.5} />
                      <span className="text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">{slot.label}</span>
                    </div>
                    <DayActivity activity={activity} />
                  </div>
                )
              })}

              <AccommodationCard accommodation={day.accommodation} />

              {day.notes && (
                <p className="text-xs text-[--text-secondary] italic pt-1 border-t border-warm-100 dark:border-slate-700">
                  {day.notes}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
