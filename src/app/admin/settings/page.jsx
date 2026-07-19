'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'

const AI_MODELS = [
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Default)' },
  { value: 'gemini-2.0-pro', label: 'Gemini 2.0 Pro (Fallback)' },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({
    maintenanceMode: false,
    aiModel: 'gemini-2.0-flash',
    rateLimit: 30,
    maxRetries: 2,
  })

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setForm(data.settings)
          setSettings(data.settings)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.settings) {
        setSettings(data.settings)
        setToast({ type: 'success', message: 'Settings saved successfully' })
      } else {
        setToast({ type: 'error', message: 'Failed to save settings' })
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to save settings' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[--bg-page] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[--bg-page]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-[--text-heading]">System Settings</h1>
            <p className="text-sm text-[--text-secondary] mt-1">Configure application behavior</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> : <Save className="w-4 h-4" strokeWidth={1.5} />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {toast && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
            {toast.message}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 divide-y divide-warm-100 dark:divide-slate-700">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[--text-heading]">Maintenance Mode</h3>
                <p className="text-xs text-[--text-secondary] mt-0.5">When enabled, new trip generation is disabled for all users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} className="sr-only peer" />
                <div className="w-10 h-5 bg-warm-200 rounded-full peer peer-checked:bg-orange-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          </div>

          <div className="p-5">
            <label className="block text-sm font-semibold text-[--text-heading] mb-1">AI Model</label>
            <p className="text-xs text-[--text-secondary] mb-2">Default model for AI generation. Falls back to Pro on timeout.</p>
            <select value={form.aiModel} onChange={(e) => setForm({ ...form, aiModel: e.target.value })} className="h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400 w-full max-w-xs">
              {AI_MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          <div className="p-5">
            <label className="block text-sm font-semibold text-[--text-heading] mb-1">Rate Limit</label>
            <p className="text-xs text-[--text-secondary] mb-2">Maximum requests per minute per AI endpoint</p>
            <input type="number" value={form.rateLimit} onChange={(e) => setForm({ ...form, rateLimit: Math.max(1, Number(e.target.value)) })} className="h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] focus:outline-none focus:ring-2 focus:ring-orange-400 w-32" />
          </div>

          <div className="p-5">
            <label className="block text-sm font-semibold text-[--text-heading] mb-1">Max Retries</label>
            <p className="text-xs text-[--text-secondary] mb-2">Number of retry attempts on AI parse failure</p>
            <input type="number" value={form.maxRetries} onChange={(e) => setForm({ ...form, maxRetries: Math.max(0, Number(e.target.value)) })} className="h-10 px-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] focus:outline-none focus:ring-2 focus:ring-orange-400 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
