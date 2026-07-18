'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from '@/hooks/useSession'

export default function AuthLayout({ children }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && session) {
      router.push('/dashboard')
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (session) return null

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Travel Pilot</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
