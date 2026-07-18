'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from '@/hooks/useSession'
import { authClient } from '@/lib/auth-client'
import {
  LayoutDashboard,
  Luggage,
  PlusCircle,
  MessageSquareText,
  Heart,
  BarChart3,
  Settings,
  User,
  LogOut,
  ChevronLeft,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Trips', href: '/dashboard/trips', icon: Luggage },
  { label: 'Create Trip', href: '/dashboard/new', icon: PlusCircle },
  { label: 'AI Conversations', href: '/dashboard/conversations', icon: MessageSquareText },
  { label: 'Favorites', href: '/dashboard/favorites', icon: Heart },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
]

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  function isActive(href) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-white dark:bg-slate-900 border-r border-warm-200 dark:border-slate-700 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-warm-200 dark:border-slate-700">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <span className="text-white font-bold text-xs font-heading">TP</span>
              </div>
              {!collapsed && <span className="font-heading font-bold text-base text-[--text-heading]">Travel Pilot</span>}
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="mx-auto">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <span className="text-white font-bold text-xs font-heading">TP</span>
              </div>
            </Link>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-[--text-secondary] hover:bg-[--bg-card-hover] transition-colors hidden lg:block"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 h-11 px-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                    : 'text-[--text-body] hover:bg-[--bg-card-hover] dark:hover:bg-slate-800'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className={`p-3 border-t border-warm-200 dark:border-slate-700 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          {user && (
            <div className={`flex items-center gap-3 mb-3 ${collapsed ? 'flex-col' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[--text-heading] truncate">{user.name}</p>
                  <p className="text-xs text-[--text-secondary] truncate">{user.email}</p>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => authClient.signOut()}
            className={`flex items-center gap-2 w-full h-9 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors ${
              collapsed ? 'justify-center px-0' : 'px-3'
            }`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-warm-200 dark:border-slate-700 flex items-center justify-around h-16 px-2 safe-area-bottom">
        {navItems.slice(0, 5).map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 h-full px-2 min-w-0 ${
                active ? 'text-orange-500' : 'text-[--text-secondary]'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
              <span className="text-[10px] font-medium truncate max-w-full">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
