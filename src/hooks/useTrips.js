'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function useTrips() {
  const [state, setState] = useState({ trips: [], total: 0, page: 1, limit: 10, loading: true, error: null })
  const [filters, setFilters] = useState({ search: '', status: '', sort: 'newest' })
  const debounceRef = useRef(null)

  const fetchTrips = useCallback(async (queryFilters, page = 1) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        search: queryFilters.search || '',
        status: queryFilters.status || '',
        sort: queryFilters.sort || 'newest',
      })

      const res = await fetch(`/api/trips?${params}`)
      if (!res.ok) throw new Error('Failed to load trips')

      const data = await res.json()
      setState({ trips: data.trips, total: data.total, page: data.page, limit: data.limit, loading: false, error: null })
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err }))
    }
  }, [])

  useEffect(() => {
    fetchTrips(filters, 1)
  }, [filters.search, filters.status, filters.sort])

  const setPage = useCallback((page) => {
    fetchTrips(filters, page)
  }, [fetchTrips, filters])

  const setSearch = useCallback((search) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search }))
    }, 400)
  }, [])

  const setStatus = useCallback((status) => {
    setFilters((prev) => ({ ...prev, status }))
  }, [])

  const setSort = useCallback((sort) => {
    setFilters((prev) => ({ ...prev, sort }))
  }, [])

  const deleteTrip = useCallback(async (id) => {
    const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      setState((prev) => ({
        ...prev,
        trips: prev.trips.filter((t) => t._id !== id),
        total: prev.total - 1,
      }))
    }
  }, [])

  const favoriteToggle = useCallback(async (id, favorite) => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) => (t._id === id ? { ...t, favorite } : t)),
    }))
    await fetch(`/api/trips/${id}/favorite`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorite }),
    })
  }, [])

  const totalPages = Math.ceil(state.total / state.limit)

  return {
    ...state,
    totalPages,
    setPage,
    setSearch,
    setStatus,
    setSort,
    deleteTrip,
    favoriteToggle,
    filters,
  }
}
