'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Trash2, Download, AlertCircle } from 'lucide-react'

export default function AdminTripsPage() {
  const [trips, setTrips] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [destination, setDestination] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchTrips = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '25' })
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    if (destination) params.set('destination', destination)
    try {
      const res = await fetch(`/api/admin/trips?${params}`)
      const data = await res.json()
      setTrips(data.trips || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch {
      setTrips([])
    } finally {
      setLoading(false)
    }
  }, [page, search, status, destination])

  useEffect(() => { fetchTrips() }, [fetchTrips])

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/admin/trips/${id}`, { method: 'DELETE' })
      if (res.ok || res.status === 204) {
        setDeleteId(null)
        fetchTrips()
      }
    } catch {}
  }

  function exportCSV() {
    const headers = ['Title', 'User', 'Email', 'Destination', 'Duration', 'Budget', 'Currency', 'Status', 'Created']
    const rows = trips.map((t) => [
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.user?.name || 'Unknown').replace(/"/g, '""')}"`,
      `"${(t.user?.email || '').replace(/"/g, '""')}"`,
      `"${(t.destination || '').replace(/"/g, '""')}"`,
      t.duration,
      t.budget,
      t.currency || '',
      t.status || '',
      new Date(t.createdAt).toLocaleDateString(),
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `admin-trips-${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[--bg-page]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-[--text-heading]">All Trips</h1>
            <p className="text-sm text-[--text-secondary] mt-1">{total} trips total</p>
          </div>
          <button onClick={exportCSV} className="h-9 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" strokeWidth={1.5} />
            Export CSV
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search by title or user email..." className="w-full h-10 pl-9 pr-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="generating">Generating</option>
            <option value="failed">Failed</option>
          </select>
          <input type="text" value={destination} onChange={(e) => { setDestination(e.target.value); setPage(1) }} placeholder="Filter by destination..." className="h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 w-48" />
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-12 rounded-lg skeleton" />)}</div>
        ) : trips.length > 0 ? (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-warm-200 dark:border-slate-700 bg-warm-50 dark:bg-slate-900">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">Destination</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">Dur.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">Budget</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">Created</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-100 dark:divide-slate-700">
                  {trips.map((t) => (
                    <tr key={t._id} className="hover:bg-warm-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-[--text-heading] max-w-[200px] truncate">{t.title || '—'}</td>
                      <td className="px-4 py-3 text-[--text-body]">{t.user ? `${t.user.name || '—'} (${t.user.email})` : '—'}</td>
                      <td className="px-4 py-3 text-[--text-body]">{t.destination}</td>
                      <td className="px-4 py-3 text-[--text-body]">{t.duration}d</td>
                      <td className="px-4 py-3 text-[--text-body]">{t.currency} {t.budget?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : t.status === 'generating' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : t.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : 'bg-warm-100 text-[--text-secondary]'
                        }`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-3 text-[--text-secondary] text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        {deleteId === t._id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleDelete(t._id)} className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Confirm</button>
                            <button onClick={() => setDeleteId(null)} className="px-2 py-1 text-xs font-medium text-[--text-body] border border-[--border-default] rounded-md hover:bg-[--bg-card-hover]">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteId(t._id)} className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium">
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="h-9 px-3 rounded-lg border border-[--border-default] text-sm text-[--text-body] hover:bg-[--bg-card-hover] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const start = Math.max(1, page - 3); const p = start + i
                  if (p > totalPages) return null
                  return <button key={p} onClick={() => setPage(p)} className={`min-w-[2.25rem] h-9 rounded-lg text-sm font-medium border transition-colors ${p === page ? 'bg-orange-500 text-white border-orange-500' : 'border-[--border-default] text-[--text-body] hover:bg-[--bg-card-hover]'}`}>{p}</button>
                })}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="h-9 px-3 rounded-lg border border-[--border-default] text-sm text-[--text-body] hover:bg-[--bg-card-hover] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1">
                  Next <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-[--text-secondary]" strokeWidth={1} />
            <p className="text-sm text-[--text-secondary] mt-2">No trips found</p>
          </div>
        )}
      </div>
    </div>
  )
}
