'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Luggage,
  Cpu,
  Settings,
  ChevronLeft,
  X,
  Shield,
} from 'lucide-react'

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Trips', href: '/admin/trips', icon: Luggage },
  { label: 'AI Monitor', href: '/admin/ai-monitor', icon: Cpu },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  function navContent(compact) {
    return (
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 h-11 px-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                  : 'text-[--text-body] hover:bg-[--bg-card-hover] dark:hover:bg-slate-800'
              } ${compact ? 'justify-center px-0' : ''}`}
              title={compact ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
              {!compact && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-[--overlay]" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[--bg-card] border-r border-[--border-default] shadow-lg z-50 flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-[--border-default]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
                <span className="font-heading font-bold text-base text-[--text-heading]">Admin</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[--text-secondary] hover:bg-[--bg-card-hover] transition-colors"
                aria-label="Close admin menu"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            {navContent(false)}
          </aside>
        </div>
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-30 w-11 h-11 rounded-full bg-orange-500 text-white shadow-lg flex items-center justify-center"
        aria-label="Open admin menu"
      >
        <Shield className="w-5 h-5" strokeWidth={1.5} />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-[--bg-card] border-r border-[--border-default] transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[--border-default]">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
              <span className="font-heading font-bold text-base text-[--text-heading]">Admin</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="mx-auto">
              <Shield className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-[--text-secondary] hover:bg-[--bg-card-hover] transition-colors hidden lg:block"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} strokeWidth={1.5} />
          </button>
        </div>
        {navContent(collapsed)}
      </aside>
    </>
  )
}
