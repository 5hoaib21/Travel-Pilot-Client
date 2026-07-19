'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from '@/hooks/useSession'
import { authClient } from '@/lib/auth-client'
import { Menu, X, LogOut, ChevronDown, Sun, Moon, Shield } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
]

function useTheme() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const stored = localStorage.getItem('travel-pilot-theme')
    const initial = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('travel-pilot-theme', next)
  }

  return { theme, toggle }
}

export default function Navbar() {
  const { data: session } = useSession()
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[--bg-glass] backdrop-blur-xl border-b border-[--border-default] shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm font-heading">TP</span>
            </div>
            <span className="font-heading font-bold text-lg text-[--text-heading]">Travel Pilot</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[--text-body] hover:text-[--text-heading] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[--text-secondary] hover:bg-[--bg-card-hover] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" strokeWidth={1.5} /> : <Sun className="w-4 h-4" strokeWidth={1.5} />}
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 py-1.5 pl-1.5 pr-3 rounded-full bg-[--bg-card-hover] hover:bg-[--border-hover] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium">
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-[--text-body] max-w-[120px] truncate">
                    {session.user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[--text-secondary]" strokeWidth={1.5} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-[--bg-elevated] rounded-xl shadow-lg border border-[--border-default] py-1 z-20">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-[--text-body] hover:bg-[--bg-card-hover]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      {session.user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Shield className="w-4 h-4" strokeWidth={1.5} />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          authClient.signOut()
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={1.5} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[--text-body] hover:text-[--text-heading] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[--text-body] hover:bg-[--bg-card-hover] transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-[--overlay]" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-[--bg-card] shadow-xl p-6 flex flex-col border-l border-[--border-default]">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                  <span className="text-white font-bold text-sm font-heading">TP</span>
                </div>
                <span className="font-heading font-bold text-lg text-[--text-heading]">Travel Pilot</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-[--text-secondary] hover:bg-[--bg-card-hover] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex flex-col gap-4 mb-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-[--text-body] hover:text-[--text-heading] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={() => { toggle(); setMobileOpen(false) }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[--bg-card-hover] text-[--text-body]"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" strokeWidth={1.5} /> : <Sun className="w-4 h-4" strokeWidth={1.5} />}
                <span className="text-sm font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              {session ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[--bg-card-hover]">
                    <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium">
                      {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[--text-heading] truncate">{session.user?.name}</p>
                      <p className="text-xs text-[--text-secondary] truncate">{session.user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950 dark:border-orange-800 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Shield className="w-4 h-4" strokeWidth={1.5} />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      authClient.signOut()
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 dark:border-red-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full text-center px-4 py-2.5 text-sm font-medium text-[--text-body] border border-[--border-default] rounded-lg hover:bg-[--bg-card-hover] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
