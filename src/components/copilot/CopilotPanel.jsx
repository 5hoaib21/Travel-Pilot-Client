'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bot, RefreshCw } from 'lucide-react'
import CopilotMessage from './CopilotMessage'
import CopilotInput from './CopilotInput'
import { useCopilot } from '@/hooks/useCopilot'

export default function CopilotPanel({ tripId, isOpen, onClose, onTripUpdated }) {
  const { messages, loading, error, updatedTrip, send, clearMessages } = useCopilot(tripId)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (updatedTrip) {
      onTripUpdated?.(updatedTrip)
    }
  }, [updatedTrip, onTripUpdated])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 bg-white dark:bg-slate-800 border-l border-warm-200 dark:border-slate-700 shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between px-4 h-14 border-b border-warm-100 dark:border-slate-700 shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-[--text-heading]">Travel Copilot</span>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[--bg-card-hover] transition-colors"
                  aria-label="Clear chat"
                >
                  <RefreshCw className="w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[--bg-card-hover] transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {messages.length === 0 && !loading && (
              <div className="text-center py-12 px-4">
                <Bot className="w-12 h-12 text-orange-200 dark:text-orange-800 mx-auto mb-3" strokeWidth={1} />
                <p className="text-sm text-[--text-secondary]">
                  Ask me anything about your trip! I can help refine your itinerary, suggest activities, or answer questions.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <CopilotMessage key={msg.id} message={msg} />
            ))}

            {loading && (
              <div className="flex gap-2 px-3">
                <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" strokeWidth={1.5} />
                </div>
                <div className="bg-warm-50 dark:bg-slate-700 rounded-xl rounded-tl-sm px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[--text-secondary] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[--text-secondary] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[--text-secondary] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {updatedTrip && (
              <div className="px-3">
                <div className="bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 rounded-lg px-3 py-2 text-xs text-sky-700 dark:text-sky-300 text-center">
                  Itinerary updated! Refresh to see changes.
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <CopilotInput onSend={send} disabled={loading} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
