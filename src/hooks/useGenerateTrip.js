'use client'

import { useState } from 'react'

export function useGenerateTrip() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tripId, setTripId] = useState(null)

  async function generate(preferences) {
    setLoading(true)
    setError(null)
    setTripId(null)

    try {
      const res = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate trip')
      }

      setTripId(data.trip._id)
      return data.trip
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setLoading(false)
    setError(null)
    setTripId(null)
  }

  return { generate, loading, error, tripId, reset }
}
