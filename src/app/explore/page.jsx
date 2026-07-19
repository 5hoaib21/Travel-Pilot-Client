'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ExploreFilters from '@/components/explore/ExploreFilters'
import ExploreResultCard from '@/components/explore/ExploreResultCard'
import { Loader2, Compass, ChevronLeft, ChevronRight } from 'lucide-react'

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Budget (low-high)', value: 'budget_asc' },
  { label: 'Budget (high-low)', value: 'budget_desc' },
  { label: 'Duration', value: 'duration' },
]

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-warm-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
      <div className="h-32 skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-1/2 skeleton" />
        <div className="h-3 w-full skeleton" />
      </div>
    </div>
  )
}

function ExploreContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState(() => ({
    search: searchParams.get('search') || '',
    budgetMin: searchParams.get('budgetMin') || '',
    budgetMax: searchParams.get('budgetMax') || '',
    duration: searchParams.get('duration')?.split(',').filter(Boolean) || [],
    travelStyle: searchParams.get('travelStyle')?.split(',').filter(Boolean) || [],
    interests: searchParams.get('interests')?.split(',').filter(Boolean) || [],
    companion: searchParams.get('companion') || 'All',
    sort: searchParams.get('sort') || 'newest',
  }))

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.budgetMin) params.set('budgetMin', filters.budgetMin)
    if (filters.budgetMax) params.set('budgetMax', filters.budgetMax)
    if (filters.duration?.length) params.set('duration', filters.duration.join(','))
    if (filters.travelStyle?.length) params.set('travelStyle', filters.travelStyle.join(','))
    if (filters.interests?.length) params.set('interests', filters.interests.join(','))
    if (filters.companion && filters.companion !== 'All') params.set('companion', filters.companion)
    if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort)
    if (page > 1) params.set('page', String(page))
    return params.toString()
  }, [filters, page])

  useEffect(() => {
    const qs = buildQuery()
    router.replace(`/explore${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [buildQuery, router])

  useEffect(() => {
    setLoading(true)
    const qs = buildQuery()
    fetch(`/api/trips/explore${qs ? `?${qs}` : ''}`)
      .then((r) => r.json())
      .then((res) => { setData(res); setLoading(false) })
      .catch(() => { setData(null); setLoading(false) })
  }, [buildQuery])

  function handleFiltersChange(next) {
    setFilters(next)
    setPage(1)
  }

  const hasAnyFilter = filters.search || filters.budgetMin || filters.budgetMax || filters.duration?.length || filters.travelStyle?.length || filters.interests?.length || filters.companion !== 'All'

  return (
    <div className="min-h-screen bg-[--bg-page]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold text-[--text-heading]">Explore Trips</h1>
          <p className="text-sm text-[--text-secondary] mt-1">Discover travel itineraries shared by the community</p>
        </div>

        <ExploreFilters filters={filters} onChange={handleFiltersChange} />

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-[--text-secondary]">
            {loading ? 'Searching...' : data ? `${data.total} trip${data.total !== 1 ? 's' : ''} found` : ''}
          </p>
          <select
            value={filters.sort}
            onChange={(e) => handleFiltersChange({ ...filters, sort: e.target.value })}
            className="h-9 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : data?.trips?.length > 0 ? (
          <>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.trips.map((trip) => <ExploreResultCard key={trip._id} trip={trip} />)}
            </div>

            {data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="h-9 px-3 rounded-lg border border-[--border-default] text-sm text-[--text-body] hover:bg-[--bg-card-hover] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                  Prev
                </button>
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
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
                ))}
                <button
                  onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                  disabled={page >= data.totalPages}
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
            <Compass className="w-16 h-16 text-[--text-secondary] mb-4" strokeWidth={1} />
            <h3 className="text-lg font-semibold text-[--text-heading]">No trips match your filters</h3>
            <p className="text-sm text-[--text-secondary] mt-1 mb-4">Try adjusting your search criteria</p>
            {hasAnyFilter && (
              <button
                onClick={() => handleFiltersChange({
                  search: '', budgetMin: '', budgetMax: '', duration: [], travelStyle: [], interests: [], companion: 'All', sort: 'newest',
                })}
                className="h-9 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[--bg-page]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="h-8 w-48 skeleton" />
            <div className="h-4 w-72 skeleton mt-2" />
          </div>
          <div className="h-14 rounded-xl skeleton mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-warm-200 overflow-hidden">
                <div className="h-32 skeleton" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 skeleton" />
                  <div className="h-3 w-1/2 skeleton" />
                  <div className="h-3 w-full skeleton" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  )
}
