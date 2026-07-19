'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Luggage, MessageSquare, Search, Heart, BarChart3 } from 'lucide-react'

const icons = {
  trips: Luggage,
  conversations: MessageSquare,
  search: Search,
  favorites: Heart,
  analytics: BarChart3,
}

export default function EmptyState({ icon = 'trips', title, description, actionLabel, actionHref, onAction }) {
  const Icon = icons[icon] || icons.trips

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm"
    >
      <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-orange-500" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-heading font-bold text-[--text-heading] mb-2">{title}</h2>
      <p className="text-sm text-[--text-secondary] max-w-sm mx-auto mb-6">{description}</p>
      {actionLabel && (actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 h-9 px-4 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
        >
          {actionLabel}
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 h-9 px-4 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      ) : null)}
    </motion.div>
  )
}
