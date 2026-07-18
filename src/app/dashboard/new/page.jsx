'use client'

import { motion } from 'framer-motion'
import TripForm from '@/components/trip/TripForm'

export default function NewTripPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[--text-heading] mb-2">
          Create a New Trip
        </h1>
        <p className="text-sm text-[--text-secondary]">
          Tell us your preferences and let AI generate a personalized itinerary.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm"
      >
        <TripForm />
      </motion.div>
    </div>
  )
}
