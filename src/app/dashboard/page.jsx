'use client'

import { useSession } from '@/hooks/useSession'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PlusCircle, Luggage, MessageSquareText, Heart } from 'lucide-react'

const summaryCards = [
  { icon: Luggage, label: 'Total Trips', value: '0', href: '/dashboard/trips' },
  { icon: MessageSquareText, label: 'AI Conversations', value: '0', href: '/dashboard/conversations' },
  { icon: Heart, label: 'Favorites', value: '0', href: '/dashboard/favorites' },
]

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[--text-heading] mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Traveler'}
        </h1>
        <p className="text-sm text-[--text-secondary]">
          Here&apos;s your travel planning overview.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={card.href}
              className="block bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-[--text-heading]">{card.value}</p>
                  <p className="text-xs text-[--text-secondary]">{card.label}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-8 sm:p-10 text-center shadow-sm"
      >
        <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950 flex items-center justify-center mx-auto mb-4">
          <PlusCircle className="w-8 h-8 text-orange-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-heading font-bold text-[--text-heading] mb-2">
          Plan Your First Trip
        </h2>
        <p className="text-sm text-[--text-secondary] mb-6 max-w-sm mx-auto">
          Generate a complete AI-powered itinerary in seconds. Tell us where you want to go and we&apos;ll handle the rest.
        </p>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" strokeWidth={1.5} />
          Create Your First Trip
        </Link>
      </motion.div>
    </div>
  )
}
