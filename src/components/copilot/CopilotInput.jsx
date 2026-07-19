'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

export default function CopilotInput({ onSend, disabled }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask about your trip..."
        disabled={disabled}
        className="flex-1 h-9 px-3 rounded-lg border border-[--border-default] text-sm bg-warm-50 dark:bg-slate-700 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </form>
  )
}
