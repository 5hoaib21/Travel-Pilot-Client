'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert, Loader2 } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/me')
      .then((r) => {
        if (cancelled) return
        if (r.status === 403) {
          setStatus('forbidden')
          router.replace('/dashboard')
        } else if (r.ok) {
          setStatus('authorized')
        } else {
          setStatus('forbidden')
          router.replace('/dashboard')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('forbidden')
          router.replace('/dashboard')
        }
      })
    return () => { cancelled = true }
  }, [router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--bg-page]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" strokeWidth={1.5} />
          <p className="text-sm text-[--text-secondary]">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (status === 'forbidden') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--bg-page]">
        <div className="flex flex-col items-center gap-3">
          <ShieldAlert className="w-12 h-12 text-red-400" strokeWidth={1.5} />
          <p className="text-sm text-[--text-secondary]">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[--bg-page]">
      <AdminSidebar />
      <div className="transition-all duration-300 md:ml-60 pb-16 md:pb-0">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
