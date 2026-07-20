'use client'

import { useState, useCallback, useRef } from 'react'
import { api } from '@/lib/api'

export function useCopilot(tripId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [updatedTrip, setUpdatedTrip] = useState(null)
  const msgId = useRef(1)

  const send = useCallback(async (text) => {
    const id = msgId.current++
    const userMsg = { role: 'user', content: text, id }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setError(null)

    try {
      const data = await api.post(`/trips/${tripId}/copilot`, { message: text })
      setMessages((prev) => [...prev, { role: 'copilot', content: data.reply, id: msgId.current++ }])

      if (data.updatedTrip) {
        setUpdatedTrip(data.updatedTrip)
      }
    } catch (err) {
      setError(err.message)
      setMessages((prev) => [
        ...prev,
        { role: 'error', content: err.message, id: msgId.current++ },
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
