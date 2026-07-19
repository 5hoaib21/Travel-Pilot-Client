'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Lightbulb } from 'lucide-react'

const categoryLabels = {
  Weather: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  Culture: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  Safety: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  Packing: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Currency: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  Language: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
}

export default function TravelTips({ tips }) {
  const [openIndex, setOpenIndex] = useState(null)

  if (!tips || tips.length === 0) return null

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
        <h3 className="text-base font-heading font-bold text-[--text-heading]">Travel Tips</h3>
      </div>

      <div className="space-y-2">
        {tips.map((tip, index) => {
          const categoryClass = categoryLabels[tip.category] || categoryLabels.Weather
          return (
            <div
              key={index}
              className="rounded-lg border border-warm-100 dark:border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${categoryClass}`}>
                    {tip.category}
                  </span>
                  <span className="text-xs text-[--text-body]">
                    Priority {tip.priority}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[--text-secondary] transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3">
                      <p className="text-xs text-[--text-secondary] leading-relaxed">{tip.content}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
