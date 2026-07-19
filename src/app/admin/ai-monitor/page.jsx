'use client'

import { useState, useEffect, useCallback } from 'react'
import { AlertCircle, ChevronDown, ChevronRight, BarChart3 } from 'lucide-react'
import { RequestsOverTime, SuccessRatePie, AvgResponseTimeChart, TopUsersChart } from '@/components/admin/AdminAICharts'

const FEATURE_TYPES = ['', 'planner', 'budgeter', 'curator', 'reviewer', 'copilot', 'enrich_destination', 'autosuggest']
const STATUS_OPTIONS = ['', 'success', 'failed']

export default function AdminAIMonitorPage() {
  const [generations, setGenerations] = useState([])
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(true)
  const [featureType, setFeatureType] = useState('')
  const [status, setStatus] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const fetchGenerations = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100' })
    if (featureType) params.set('featureType', featureType)
    if (status) params.set('status', status)
    try {
      const res = await fetch(`/api/admin/ai-generations?${params}`)
      const data = await res.json()
      setGenerations(data.generations || [])
    } catch {
      setGenerations([])
    } finally {
      setLoading(false)
    }
  }, [featureType, status])

  useEffect(() => { fetchGenerations() }, [fetchGenerations])

  useEffect(() => {
    setChartsLoading(true)
    fetch('/api/admin/ai-generations/stats')
      .then((r) => r.json())
      .then((data) => setChartData(data))
      .catch(() => setChartData(null))
      .finally(() => setChartsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[--bg-page]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold text-[--text-heading]">AI Monitor</h1>
          <p className="text-sm text-[--text-secondary] mt-1">AI generation analytics and logs</p>
        </div>

        {chartsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 rounded-xl skeleton" />)}
          </div>
        ) : chartData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-[--text-heading] mb-3">Requests Over Time (30 days)</h3>
              <RequestsOverTime data={chartData.dailyData} />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-[--text-heading] mb-3">Success Rate</h3>
              <SuccessRatePie data={chartData.successRate} />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-[--text-heading] mb-3">Avg Response Time by Feature</h3>
              <AvgResponseTimeChart data={chartData.avgResponseTime} />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-[--text-heading] mb-3">Top Users by AI Usage</h3>
              <TopUsersChart data={chartData.topUsers} />
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-3 mb-4">
          <select value={featureType} onChange={(e) => setFeatureType(e.target.value)} className="h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400">
            {FEATURE_TYPES.map((ft) => <option key={ft} value={ft}>{ft || 'All Features'}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s ? (s === 'success' ? 'Success' : 'Failed') : 'All Status'}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 rounded-lg skeleton" />)}</div>
        ) : generations.length > 0 ? (
          <div className="space-y-2">
            {generations.map((g) => (
              <div key={g._id} className={`bg-white dark:bg-slate-800 rounded-xl border overflow-hidden transition-colors ${g.success === false ? 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20' : 'border-warm-200 dark:border-slate-700'}`}>
                <button onClick={() => setExpandedId(expandedId === g._id ? null : g._id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                  <span className="shrink-0">{expandedId === g._id ? <ChevronDown className="w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} /> : <ChevronRight className="w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} />}</span>
                  <span className="w-24 text-xs text-[--text-secondary] font-mono">{g.featureType}</span>
                  <span className={`w-16 text-xs font-medium ${g.success === false ? 'text-red-500' : 'text-green-600'}`}>{g.success === false ? 'Failed' : 'Success'}</span>
                  <span className="w-20 text-xs text-[--text-secondary] font-mono">{g.responseTimeMs}ms</span>
                  <span className="w-32 text-xs text-[--text-secondary] font-mono">{g.model || '—'}</span>
                  <span className="flex-1 text-xs text-[--text-secondary]">{g.user ? (g.user.name || g.user.email) : '—'}</span>
                  <span className="text-xs text-[--text-placeholder]">{new Date(g.createdAt).toLocaleString()}</span>
                </button>
                {expandedId === g._id && (
                  <div className="px-4 pb-4 pt-0 border-t border-warm-100 dark:border-slate-700 mt-0">
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-[--text-heading] mb-1">Prompt</p>
                        <pre className="text-xs text-[--text-body] bg-warm-50 dark:bg-slate-900 rounded-lg p-3 max-h-48 overflow-auto whitespace-pre-wrap font-mono">{g.prompt || '—'}</pre>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[--text-heading] mb-1">Response</p>
                        <pre className="text-xs text-[--text-body] bg-warm-50 dark:bg-slate-900 rounded-lg p-3 max-h-48 overflow-auto whitespace-pre-wrap font-mono">{g.response || g.errorMessage || '—'}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-[--text-secondary]" strokeWidth={1} />
            <p className="text-sm text-[--text-secondary] mt-2">No AI generations found</p>
          </div>
        )}
      </div>
    </div>
  )
}
