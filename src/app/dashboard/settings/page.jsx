'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Globe, Bell, Sun, Shield, AlertTriangle, Moon } from 'lucide-react'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { useRouter } from 'next/navigation'

const currencies = ['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'THB', 'SGD', 'MYR']
const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic', 'Hindi']

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [theme, setTheme] = useState('light')

  const [form, setForm] = useState({
    name: '',
    email: '',
    defaultCurrency: 'USD',
    preferredLanguage: 'English',
    emailNotifications: true,
    tripReminders: true,
  })

  useEffect(() => {
    const stored = localStorage.getItem('travel-pilot-theme')
    const initial = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(initial)
  }, [])

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          setForm({
            name: data.user.name || '',
            email: data.user.email || '',
            defaultCurrency: data.user.defaultCurrency || 'USD',
            preferredLanguage: data.user.preferredLanguage || 'English',
            emailNotifications: data.user.emailNotifications !== false,
            tripReminders: data.user.tripReminders !== false,
          })
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('travel-pilot-theme', next)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          defaultCurrency: form.defaultCurrency,
          preferredLanguage: form.preferredLanguage,
          emailNotifications: form.emailNotifications,
          tripReminders: form.tripReminders,
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {} finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await fetch('/api/user/account', { method: 'DELETE' })
      router.push('/')
    } catch {} finally {
      setDeleting(false)
      setShowDelete(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-64 w-full" />
        <div className="skeleton h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[--text-heading] mb-1">Settings</h1>
        <p className="text-sm text-[--text-secondary]">Manage your profile, preferences, and account.</p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            <h2 className="text-base font-heading font-bold text-[--text-heading]">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[--text-heading] mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[--text-heading] mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                readOnly
                className="w-full h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-warm-50 dark:bg-slate-700 text-[--text-secondary] cursor-not-allowed"
              />
              <p className="text-xs text-[--text-secondary] mt-1">Email cannot be changed.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            <h2 className="text-base font-heading font-bold text-[--text-heading]">Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[--text-heading] mb-1">Default Currency</label>
              <select
                value={form.defaultCurrency}
                onChange={(e) => setForm((prev) => ({ ...prev, defaultCurrency: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
              >
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[--text-heading] mb-1">Language</label>
              <select
                value={form.preferredLanguage}
                onChange={(e) => setForm((prev) => ({ ...prev, preferredLanguage: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
              >
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            <h2 className="text-base font-heading font-bold text-[--text-heading]">Notifications</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-[--text-body]">Email updates about new features</span>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.emailNotifications ? 'bg-orange-500' : 'bg-[--border-default]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${form.emailNotifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-[--text-body]">Trip reminders and notifications</span>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, tripReminders: !prev.tripReminders }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.tripReminders ? 'bg-orange-500' : 'bg-[--border-default]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${form.tripReminders ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            <h2 className="text-base font-heading font-bold text-[--text-heading]">Theme</h2>
          </div>

          <label className="flex items-center justify-between">
            <span className="text-sm text-[--text-body]">Dark Mode</span>
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative w-10 h-5 rounded-full transition-colors ${theme === 'dark' ? 'bg-orange-500' : 'bg-[--border-default]'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`}>
                {theme === 'dark' ? <Moon className="w-3 h-3 text-orange-500 mt-0.5" /> : <Sun className="w-3 h-3 text-amber-500 mt-0.5" />}
              </span>
            </button>
          </label>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="submit"
            disabled={saving}
            className="w-full h-10 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800 shadow-sm p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-red-500" strokeWidth={1.5} />
          <h2 className="text-base font-heading font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
        </div>
        <p className="text-sm text-[--text-secondary] mb-4">
          Once you delete your account, there is no going back. All your trips and data will be permanently removed.
        </p>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
          Delete Account
        </button>
      </motion.div>

      {showDelete && (
        <ConfirmDialog
          title="Delete Account"
          message="Are you sure you want to delete your account? All your trips, conversations, and data will be permanently removed. This action cannot be undone."
          confirmLabel={deleting ? 'Deleting...' : 'Delete My Account'}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  )
}
