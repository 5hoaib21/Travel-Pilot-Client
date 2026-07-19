'use client'

import { useState, useEffect, useRef } from 'react'

export function useAutosuggest(delay = 300) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)
  const cacheRef = useRef({})

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }

    if (cacheRef.current[trimmed]) {
      setSuggestions(cacheRef.current[trimmed])
      setLoading(false)
      return
    }

    setLoading(true)

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/trips/autosuggest?q=${encodeURIComponent(trimmed)}`)
        const data = await res.json()
        const items = data.suggestions || []
        cacheRef.current[trimmed] = items
        setSuggestions(items)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query, delay])

  return { query, setQuery, suggestions, loading }
}
