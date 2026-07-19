'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X, ChevronDown, Search } from 'lucide-react'
import { useGenerateTrip } from '@/hooks/useGenerateTrip'

const currencies = ['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'THB', 'SGD', 'MYR']
const travelStyles = ['Relaxed', 'Balanced', 'Adventure']
const companions = ['Solo', 'Couple', 'Family', 'Friends']
const interestOptions = ['Nature', 'History', 'Food', 'Shopping', 'Nightlife', 'Adventure', 'Culture', 'Wildlife']

const STORAGE_KEY = 'travel-pilot-draft'

const initialForm = {
  destination: '',
  budget: '',
  currency: 'USD',
  duration: '',
  travelStyle: '',
  interests: [],
  companion: '',
  additionalNotes: '',
}

function validate(form) {
  const errs = {}
  if (!form.destination || form.destination.length < 2) errs.destination = 'Please enter a destination'
  if (form.destination && form.destination.length > 100) errs.destination = 'Destination must be under 100 characters'
  if (!form.budget || Number(form.budget) <= 0) errs.budget = 'Budget must be greater than 0'
  if (Number(form.budget) > 1000000) errs.budget = 'Budget must not exceed 1,000,000'
  if (!form.duration || !Number.isInteger(Number(form.duration)) || Number(form.duration) < 1 || Number(form.duration) > 30)
    errs.duration = 'Duration must be 1–30 days'
  if (!form.travelStyle) errs.travelStyle = 'Please select a travel style'
  if (form.interests.length === 0) errs.interests = 'Select at least one interest'
  if (form.interests.length > 10) errs.interests = 'Select at most 10 interests'
  if (!form.companion) errs.companion = 'Please select companion type'
  if (form.additionalNotes && form.additionalNotes.length > 500) errs.additionalNotes = 'Notes must be under 500 characters'
  return errs
}

export default function TripForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const { generate, loading, error: serverError, reset, tripId } = useGenerateTrip()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setForm((prev) => ({ ...prev, ...parsed }))
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (tripId) {
      localStorage.removeItem(STORAGE_KEY)
      router.push(`/dashboard/trips/${tripId}`)
    }
  }, [tripId, router])

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
      } catch {}
    }, 500)
    return () => clearTimeout(timer)
  }, [form])

  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  function toggleInterest(interest) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next.interests
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    reset()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    try {
      await generate({
        destination: form.destination,
        budget: Number(form.budget),
        currency: form.currency,
        duration: Number(form.duration),
        travelStyle: form.travelStyle,
        interests: form.interests,
        companion: form.companion,
        additionalNotes: form.additionalNotes || undefined,
      })
    } catch {}
  }

  function SelectField({ label, fieldKey, value, options, placeholder }) {
    return (
      <div>
        <label className="block text-sm font-medium text-[--text-heading] mb-1">{label}</label>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => update(fieldKey, e.target.value)}
            className={`w-full h-10 px-3 rounded-lg border text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors ${
              errors[fieldKey] ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900' : 'border-[--border-default]'
            } ${!value ? 'text-[--text-placeholder]' : ''}`}
          >
            <option value="" disabled>{placeholder}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-secondary] pointer-events-none" strokeWidth={1.5} />
        </div>
        {errors[fieldKey] && <p className="mt-1 text-xs text-red-500">{errors[fieldKey]}</p>}
      </div>
    )
  }

  function TagSelector({ label, options, selected, onToggle, error }) {
    return (
      <div>
        <label className="block text-sm font-medium text-[--text-heading] mb-2">{label}</label>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = selected.includes(option)
            return (
              <button
                key={option}
                type="button"
                onClick={() => onToggle(option)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 text-[--text-body] hover:border-orange-300 dark:hover:border-orange-700'
                }`}
              >
                {option}
                {isSelected && <X className="w-3 h-3" strokeWidth={2} />}
              </button>
            )
          })}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {serverError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-950 dark:border-red-800 dark:text-red-300">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-[--text-heading] mb-1">
          Destination
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} />
          <input
            id="destination"
            type="text"
            value={form.destination}
            onChange={(e) => update('destination', e.target.value)}
            placeholder="e.g. Tokyo, Japan"
            className={`w-full h-10 pl-9 pr-3 rounded-lg border text-sm bg-white dark:bg-slate-800 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors ${
              errors.destination ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900' : 'border-[--border-default]'
            }`}
          />
        </div>
        {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-[--text-heading] mb-1">
            Budget
          </label>
          <div className="flex gap-2">
            <input
              id="budget"
              type="number"
              min="1"
              value={form.budget}
              onChange={(e) => update('budget', e.target.value)}
              placeholder="e.g. 2000"
              className={`flex-1 h-10 px-3 rounded-lg border text-sm bg-white dark:bg-slate-800 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors ${
                errors.budget ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900' : 'border-[--border-default]'
              }`}
            />
            <select
              value={form.currency}
              onChange={(e) => update('currency', e.target.value)}
              className="w-24 h-10 px-2 rounded-lg border text-sm bg-white dark:bg-slate-800 text-[--text-body] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors border-[--border-default]"
            >
              {currencies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget}</p>}
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-[--text-heading] mb-1">
            Duration (days)
          </label>
          <input
            id="duration"
            type="number"
            min="1"
            max="30"
            value={form.duration}
            onChange={(e) => update('duration', e.target.value)}
            placeholder="e.g. 5"
            className={`w-full h-10 px-3 rounded-lg border text-sm bg-white dark:bg-slate-800 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors ${
              errors.duration ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900' : 'border-[--border-default]'
            }`}
          />
          {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Travel Style"
          fieldKey="travelStyle"
          value={form.travelStyle}
          options={travelStyles}
          placeholder="Select a style"
        />

        <SelectField
          label="Companion"
          fieldKey="companion"
          value={form.companion}
          options={companions}
          placeholder="Select companion"
        />
      </div>

      <TagSelector
        label="Interests"
        options={interestOptions}
        selected={form.interests}
        onToggle={toggleInterest}
        error={errors.interests}
      />

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-[--text-heading] mb-1">
          Additional Notes <span className="text-[--text-secondary] font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          maxLength={500}
          value={form.additionalNotes}
          onChange={(e) => update('additionalNotes', e.target.value)}
          placeholder="Any special requests, dietary preferences, or must-see attractions..."
          className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-800 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors resize-none ${
            errors.additionalNotes ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900' : 'border-[--border-default]'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.additionalNotes && <p className="text-xs text-red-500">{errors.additionalNotes}</p>}
          <p className="text-xs text-[--text-secondary] ml-auto">{form.additionalNotes.length}/500</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 px-6 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm inline-flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? 'Generating your trip...' : 'Generate My Trip'}
      </button>
    </form>
  )
}
