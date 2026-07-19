'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export function useGenerateTrip() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tripId, setTripId] = useState(null)

  async function generate(preferences) {
    setLoading(true)
    setError(null)
    setTripId(null)

    try {
      const data = await api.post('/trips/generate', preferences)

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
