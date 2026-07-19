'use client'

import { useSession } from '@/hooks/useSession'
import { useDashboard } from '@/hooks/useDashboard'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PlusCircle, Luggage, Heart, MessageSquareText, BarChart3, ArrowRight } from 'lucide-react'
import { SkeletonBox } from '@/components/common/LoadingSkeleton'
import EmptyState from '@/components/common/EmptyState'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data, loading } = useDashboard()

  const userName = session?.user?.name?.split(' ')[0] || 'Traveler'

  const summaryCards = [
    { icon: Luggage, label: 'Total Trips', value: data?.tripCount ?? '—', href: '/dashboard/trips', color: 'text-orange-500' },
    { icon: MessageSquareText, label: 'AI Conversations', value: data?.conversationCount ?? 0, href: '/dashboard/conversations', color: 'text-sky-500' },
    { icon: Heart, label: 'Favorites', value: data?.favoriteCount ?? '—', href: '/dashboard/favorites', color: 'text-red-400' },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[--text-heading] mb-2">
          Welcome back, {userName}
        </h1>
        <p className="text-sm text-[--text-secondary]">
          Here&apos;s your travel planning overview.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonBox key={i} className="h-24" />)
          : summaryCards.map((card, index) => (
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
                      <card.icon className={`w-5 h-5 ${card.color}`} strokeWidth={1.5} />
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

      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-heading font-bold text-[--text-heading]">Recent Trips</h2>

            {data.recentTrips?.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                {data.recentTrips.map((trip, i) => (
                  <motion.div
                    key={trip._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link
                      href={`/dashboard/trips/${trip._id}`}
                      className="block w-64 shrink-0 snap-start bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <p className="text-sm font-semibold text-[--text-heading] truncate mb-1">
                        {trip.title || trip.destination}
                      </p>
                      <p className="text-xs text-[--text-secondary] mb-3">{trip.destination}</p>
                      <div className="flex items-center gap-3 text-xs text-[--text-secondary]">
                        <span>{trip.duration} days</span>
                        <span className="w-1 h-1 rounded-full bg-[--border-default]" />
                        <span>
                          {trip.currency} {trip.budget?.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-6 text-center">
                <p className="text-sm text-[--text-secondary]">No trips yet. Plan your first adventure!</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-heading font-bold text-[--text-heading]">AI Usage This Month</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-6 shadow-sm">
              {data.aiUsageThisMonth > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-[--text-heading]">{data.aiUsageThisMonth}</p>
                    <p className="text-xs text-[--text-secondary]">generations this month</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-warm-100 dark:bg-slate-700 flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-warm-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[--text-heading]">No data yet</p>
                    <p className="text-xs text-[--text-secondary]">Generate a trip to see usage</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && (!data || data.tripCount === 0) && (
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
      )}
    </div>
  )
}
