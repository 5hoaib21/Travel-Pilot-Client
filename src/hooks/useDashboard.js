'use client'

import { useState, useEffect } from 'react'

export function useDashboard() {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    async function fetchSummary() {
      try {
        const res = await fetch('/api/dashboard/summary')
        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized')
          throw new Error('Failed to load dashboard data')
        }
        const data = await res.json()
        if (!cancelled) setState({ data, loading: false, error: null })
      } catch (err) {
        if (!cancelled) setState({ data: null, loading: false, error: err })
      }
    }

    fetchSummary()
    return () => { cancelled = true }
  }, [])

  return state
}
