'use client'

import { useState, useEffect } from 'react'

export function useTrip(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function fetchTrip() {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const res = await fetch(`/api/trips/${id}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error('Trip not found')
          throw new Error('Failed to load trip')
        }
        const data = await res.json()
        if (!cancelled) setState({ data, loading: false, error: null })
      } catch (err) {
        if (!cancelled) setState({ data: null, loading: false, error: err })
      }
    }

    fetchTrip()
    return () => { cancelled = true }
  }, [id])

  return state
}
