'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle')

  function validate(val) {
    if (!val.trim()) return 'Please enter your email'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate(email)
    setError(err)
    if (err) return

    setStatus('loading')
    await new Promise((r) => setTimeout(r, 1000))
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <section className="py-24 bg-gradient-to-b from-warm-50 to-orange-50/40 dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-navy-700 dark:text-slate-100 mb-3">
              You&apos;re on the List!
            </h2>
            <p className="text-sm text-warm-500 dark:text-slate-300">
              Thanks for subscribing. We&apos;ll send travel tips and inspiration straight to your inbox.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-b from-warm-50 to-orange-50/40 dark:from-slate-900 dark:to-slate-900">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-navy-700 dark:text-slate-100 mb-3">
            Get Travel Tips Straight to Your Inbox
          </h2>
          <p className="text-sm text-warm-500 dark:text-slate-300 mb-8 max-w-md mx-auto">
            Subscribe for destination guides, budget hacks, and early access to new features.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                placeholder="your@email.com"
                className={`w-full h-11 px-4 rounded-lg border text-sm bg-white dark:bg-slate-800 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors ${
                  error ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900' : 'border-[--border-default]'
                }`}
              />
              {error && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 h-11 px-6 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
