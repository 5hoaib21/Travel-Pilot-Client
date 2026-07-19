'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from '@/hooks/useSession'
import ErrorBoundary from '@/components/common/ErrorBoundary'

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
      <div className="min-h-screen flex items-center justify-center bg-[--bg-page]">
        <div className="flex flex-col items-center gap-4">
          <div className="skeleton w-48 h-5" />
          <div className="skeleton w-64 h-10" />
          <div className="skeleton w-full max-w-sm h-40" />
        </div>
      </div>
    )
  }

  if (session) return null

  return (
    <div className="min-h-screen bg-[--bg-page] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 mb-4">
            <span className="text-white font-bold text-lg font-heading">TP</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-[--text-heading]">Travel Pilot</h1>
          <p className="text-sm text-[--text-secondary] mt-1">Plan smarter. Travel better.</p>
        </div>
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </div>
  )
}
