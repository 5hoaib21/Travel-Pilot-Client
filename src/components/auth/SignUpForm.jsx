'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import OAuthButton from './OAuthButton'

export default function SignUpForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState(null)
  const [loading, setLoading] = useState(false)

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGeneralError(null)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    const { error: err } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email,
      password: form.password,
    })
    setLoading(false)

    if (err) {
      setGeneralError(err.message || 'Sign up failed')
      return
    }

    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {generalError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {generalError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.name ? 'border-red-300' : 'border-neutral-300'
          }`}
          placeholder="John Doe"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.email ? 'border-red-300' : 'border-neutral-300'
          }`}
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.password ? 'border-red-300' : 'border-neutral-300'
          }`}
          placeholder="At least 8 characters"
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.confirmPassword ? 'border-red-300' : 'border-neutral-300'
          }`}
          placeholder="Repeat your password"
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-neutral-500">or</span>
        </div>
      </div>

      <OAuthButton />
    </form>
  )
}
