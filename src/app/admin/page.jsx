'use client'

import { useState, useEffect } from 'react'
import { Users, MapIcon, Cpu, AlertTriangle, Activity, Calendar } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[--bg-page]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-[--text-heading]">Admin Dashboard</h1>
            <p className="text-sm text-[--text-secondary] mt-1">Manage Travel Pilot</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[--text-secondary] bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-[--border-default]">
            <ShieldCheckIcon />
            Admin
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl skeleton" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon={<Users className="w-5 h-5 text-blue-500" />} label="Total Users" value={stats.totalUsers} />
            <StatCard icon={<MapIcon className="w-5 h-5 text-orange-500" />} label="Total Trips" value={stats.totalTrips} />
            <StatCard icon={<Cpu className="w-5 h-5 text-purple-500" />} label="Total AI Requests" value={stats.totalGenerations} />
            <StatCard icon={<AlertTriangle className="w-5 h-5 text-red-500" />} label="Failed AI Requests" value={`${stats.failedGenerations} (${stats.failedPercentage}%)`} />
            <StatCard icon={<Activity className="w-5 h-5 text-green-500" />} label="Active Users (Month)" value={stats.activeUsers} />
            <StatCard icon={<Calendar className="w-5 h-5 text-cyan-500" />} label="Trips Created Today" value={stats.tripsToday} />
          </div>
        ) : (
          <p className="text-sm text-[--text-secondary]">Failed to load stats.</p>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-warm-50 dark:bg-slate-700 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-[--text-secondary]">{label}</p>
        <p className="text-xl font-semibold text-[--text-heading]">{value}</p>
      </div>
    </div>
  )
}

function ShieldCheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
