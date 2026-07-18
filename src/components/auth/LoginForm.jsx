'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import OAuthButton from './OAuthButton'

export default function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState(null)
  const [loading, setLoading] = useState(false)

  function validate() {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGeneralError(null)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    const { error: err } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
    })
    setLoading(false)

    if (err) {
      setGeneralError(err.message || 'Invalid email or password')
      return
    }

    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {generalError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-950 dark:border-red-800 dark:text-red-300">
          {generalError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[--text-heading] mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`w-full h-10 px-3 rounded-lg border text-sm bg-[--bg-card] text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors ${
            errors.email ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900' : 'border-[--border-default]'
          }`}
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[--text-heading] mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={`w-full h-10 px-3 rounded-lg border text-sm bg-[--bg-card] text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors ${
            errors.password ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900' : 'border-[--border-default]'
          }`}
          placeholder="At least 8 characters"
        />
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
      </div>

      <div className="flex items-center justify-end">
        <button type="button" className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 transition-colors">
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 h-10 px-5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[--border-default]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[--bg-card] text-[--text-secondary]">or</span>
        </div>
      </div>

      <OAuthButton />
    </form>
  )
}
