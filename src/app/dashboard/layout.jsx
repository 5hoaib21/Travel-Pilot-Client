'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/useSession'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function DashboardRootLayout({ children }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--bg-page]">
        <div className="flex flex-col items-center gap-4 w-full max-w-sm px-4">
          <div className="skeleton w-48 h-5" />
          <div className="skeleton w-full h-40" />
          <div className="skeleton w-full h-20" />
        </div>
      </div>
    )
  }

  if (!session) return null

  return <DashboardLayout>{children}</DashboardLayout>
}
