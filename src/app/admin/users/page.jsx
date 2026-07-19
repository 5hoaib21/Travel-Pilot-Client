'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight, Ban, ExternalLink } from 'lucide-react'
import { TableSkeleton } from '@/components/common/LoadingSkeleton'

const SORTABLE = ['name', 'email', 'role', 'createdAt']

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '25', sort, order })
    if (search) params.set('search', search)
    try {
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      setUsers(data.users || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [page, sort, order, search])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  function handleSort(col) {
    if (sort === col) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSort(col)
      setOrder('asc')
    }
    setPage(1)
  }

  async function toggleBan(userId) {
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, { method: 'PATCH' })
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, banned: !u.banned } : u))
      }
    } catch {}
  }

  function SortIcon(col) {
    if (sort !== col) return <span className="text-[--text-placeholder] ml-1">↕</span>
    return <span className="text-orange-500 ml-1">{order === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="min-h-screen bg-[--bg-page]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-[--text-heading]">Users</h1>
            <p className="text-sm text-[--text-secondary] mt-1">{total} registered users</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name or email..."
              className="w-64 h-10 pl-9 pr-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : users.length > 0 ? (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-warm-200 dark:border-slate-700 bg-warm-50 dark:bg-slate-900">
                    {SORTABLE.map((col) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="px-4 py-3 text-left text-xs font-semibold text-[--text-secondary] uppercase tracking-wider cursor-pointer select-none hover:text-[--text-heading]"
                      >
                        {col === 'createdAt' ? 'Joined' : col}
                        {SortIcon(col)}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">Trips</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-100 dark:divide-slate-700">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-warm-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-[--text-heading]">{u.name || '—'}</td>
                      <td className="px-4 py-3 text-[--text-body]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : 'bg-warm-100 text-[--text-secondary] dark:bg-slate-700'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[--text-body]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-[--text-body]">{u.tripsCount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          u.banned ? 'text-red-500' : 'text-green-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.banned ? 'bg-red-500' : 'bg-green-500'}`} />
                          {u.banned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/users/${u._id}/trips`}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Trips <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                          </Link>
                          <button
                            onClick={() => toggleBan(u._id)}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border border-[--border-default] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                          >
                            <Ban className="w-3 h-3" strokeWidth={1.5} />
                            {u.banned ? 'Unban' : 'Ban'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="h-9 px-3 rounded-lg border border-[--border-default] text-sm text-[--text-body] hover:bg-[--bg-card-hover] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                  Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const start = Math.max(1, page - 3)
                  const p = start + i
                  if (p > totalPages) return null
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-[2.25rem] h-9 rounded-lg text-sm font-medium border transition-colors ${
                        p === page
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-[--border-default] text-[--text-body] hover:bg-[--bg-card-hover]'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="h-9 px-3 rounded-lg border border-[--border-default] text-sm text-[--text-body] hover:bg-[--bg-card-hover] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <Users className="w-12 h-12 text-[--text-secondary]" strokeWidth={1} />
            <p className="text-sm text-[--text-secondary] mt-2">No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}
