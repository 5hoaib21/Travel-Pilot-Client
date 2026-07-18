'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'

export function useSession() {
  const [session, setSession] = useState({ data: null, isPending: true, error: null })

  useEffect(() => {
    const store = authClient.useSession
    const update = () => {
      setSession({
        data: store.value || null,
        isPending: false,
        error: null,
      })
    }
    update()
    const unsub = store.subscribe(update)
    store.init?.()
    return unsub
  }, [])

  return session
}
