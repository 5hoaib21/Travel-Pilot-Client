'use client'

import { useState, useEffect } from 'react'
import { LayoutGrid, List } from 'lucide-react'

const STORAGE_KEY = 'travel-pilot-view-mode'

export default function ViewToggle({ value, onChange }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'grid' || saved === 'table') {
      onChange(saved)
    }
  }, [])

  function handleSelect(mode) {
    onChange(mode)
    try { localStorage.setItem(STORAGE_KEY, mode) } catch {}
  }

  if (!mounted) return <div className="w-[4.5rem] h-9" />

  return (
    <div className="flex items-center rounded-lg border border-[--border-default] p-0.5 bg-white dark:bg-slate-800">
      <button
        onClick={() => handleSelect('grid')}
        className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
          value === 'grid' ? 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400' : 'text-[--text-secondary] hover:text-[--text-body]'
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
      </button>
      <button
        onClick={() => handleSelect('table')}
        className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
          value === 'table' ? 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400' : 'text-[--text-secondary] hover:text-[--text-body]'
        }`}
        aria-label="Table view"
      >
        <List className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
