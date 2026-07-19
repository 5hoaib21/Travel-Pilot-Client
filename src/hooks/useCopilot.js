'use client'

import { useState, useCallback } from 'react'

export function useCopilot(tripId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [updatedTrip, setUpdatedTrip] = useState(null)

  const send = useCallback(async (text) => {
    const userMsg = { role: 'user', content: text, id: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/trips/${tripId}/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to get response')

      setMessages((prev) => [...prev, { role: 'copilot', content: data.reply, id: Date.now() + 1 }])

      if (data.updatedTrip) {
        setUpdatedTrip(data.updatedTrip)
      }
    } catch (err) {
      setError(err.message)
      setMessages((prev) => [
        ...prev,
        { role: 'error', content: err.message, id: Date.now() + 1 },
      ])
    } finally {
      setLoading(false)
    }
  }, [tripId])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    setUpdatedTrip(null)
  }, [])

  return { messages, loading, error, updatedTrip, send, clearMessages }
}
