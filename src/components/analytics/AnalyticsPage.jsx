'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import MonthlyTripsChart from './MonthlyTripsChart'
import DurationDistributionChart from './DurationDistributionChart'
import TravelStyleChart from './TravelStyleChart'
import AIUsageChart from './AIUsageChart'

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/analytics/summary')
        const json = await res.json()
        setData(json)
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="skeleton h-72 rounded-xl" />
          <div className="skeleton h-72 rounded-xl" />
          <div className="skeleton h-72 rounded-xl" />
          <div className="skeleton h-72 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!data || (!data.monthlyTrips?.length && !data.aiUsage?.length)) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-orange-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-heading font-bold text-[--text-heading] mb-2">No data yet</h2>
        <p className="text-sm text-[--text-secondary] max-w-sm mx-auto">
          Create your first trip to see analytics and insights here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[--text-heading] mb-1">Analytics</h1>
        <p className="text-sm text-[--text-secondary]">Insights into your travel planning activity.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <MonthlyTripsChart data={data.monthlyTrips || []} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <DurationDistributionChart data={data.durationDistribution || []} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <TravelStyleChart data={data.travelStyleDistribution || []} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <AIUsageChart data={data.aiUsage || []} />
        </motion.div>
      </div>
    </div>
  )
}
