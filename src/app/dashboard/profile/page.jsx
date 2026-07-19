'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { User, Luggage, MessageSquare, Globe, Settings, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [userRes, statsRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/user/stats'),
        ])
        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData.user)
        }
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="skeleton h-48 w-full rounded-xl" />
        <div className="skeleton h-32 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0 shadow-md">
            <span className="text-3xl font-heading font-bold text-white">
              {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-heading font-bold text-[--text-heading]">{user?.name || 'Traveler'}</h1>
            <p className="text-sm text-[--text-secondary]">{user?.email}</p>
            {user?.createdAt && (
              <p className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-xs text-[--text-secondary]">
                <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Luggage, label: 'Total Trips', value: stats?.totalTrips ?? 0, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' },
          { icon: MessageSquare, label: 'Conversations', value: stats?.totalConversations ?? 0, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950' },
          { icon: Globe, label: 'Countries', value: stats?.totalCountries ?? 0, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * (i + 1), ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5 text-center"
          >
            <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-heading font-bold text-[--text-heading]">{stat.value}</p>
            <p className="text-xs text-[--text-secondary] mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5"
      >
        <Link
          href="/dashboard/settings"
          className="flex items-center justify-between py-2 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
              <Settings className="w-4 h-4 text-orange-500" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-[--text-heading]">Account Management</p>
              <p className="text-xs text-[--text-secondary]">Edit profile, preferences, and security</p>
            </div>
          </div>
          <Settings className="w-4 h-4 text-[--text-secondary] group-hover:text-orange-500 transition-colors" strokeWidth={1.5} />
        </Link>
      </motion.div>
    </div>
  )
}
