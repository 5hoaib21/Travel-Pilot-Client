'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Bot, User } from 'lucide-react'

export default function ConversationDetail({ conversation, onBack }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true)
      try {
        const res = await fetch(`/api/conversations/${conversation.tripId}/messages`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages || [])
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [conversation.tripId])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[--text-secondary] hover:text-[--text-body] transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
        Back to conversations
      </button>

      <h2 className="text-lg font-heading font-bold text-[--text-heading] mb-1">{conversation.tripTitle}</h2>
      <p className="text-sm text-[--text-secondary] mb-6">{conversation.messageCount} messages</p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-lg" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <p className="text-sm text-[--text-secondary] text-center py-8">No messages found.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-orange-500' : 'bg-sky-500'
              }`}>
                {msg.role === 'user'
                  ? <User className="w-4 h-4 text-white" strokeWidth={1.5} />
                  : <Bot className="w-4 h-4 text-white" strokeWidth={1.5} />
                }
              </div>
              <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white rounded-tr-sm'
                  : 'bg-warm-50 dark:bg-slate-700 text-[--text-body] rounded-tl-sm'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
