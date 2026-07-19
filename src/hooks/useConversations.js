'use client'

import { useState, useEffect, useCallback } from 'react'

export function useConversations() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      const res = await fetch(`/api/conversations${params}`)
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch {
      setConversations([])
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetchConversations() }, [fetchConversations])

  const deleteConversation = useCallback(async (tripId) => {
    const res = await fetch(`/api/conversations/${tripId}`, { method: 'DELETE' })
    if (res.ok) {
      setConversations((prev) => prev.filter((c) => c.tripId !== tripId))
    }
  }, [])

  return { conversations, loading, search, setSearch, deleteConversation, refresh: fetchConversations }
}
