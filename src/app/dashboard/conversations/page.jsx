'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { useConversations } from '@/hooks/useConversations'
import ConversationHistory from '@/components/conversation/ConversationHistory'
import ConversationDetail from '@/components/conversation/ConversationDetail'
import ConfirmDialog from '@/components/common/ConfirmDialog'

export default function ConversationsPage() {
  const { conversations, loading, search, setSearch, deleteConversation } = useConversations()
  const [selected, setSelected] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto">
        <ConversationDetail conversation={selected} onBack={() => setSelected(null)} />
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
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[--text-heading] mb-1">
          Conversations
        </h1>
        <p className="text-sm text-[--text-secondary]">Your AI Travel Copilot conversation history.</p>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-sky-500" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-heading font-bold text-[--text-heading] mb-2">No conversations yet</h2>
          <p className="text-sm text-[--text-secondary] max-w-sm mx-auto">
            Open the copilot on a trip to start chatting and refine your itinerary.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <ConversationHistory
            conversations={conversations}
            search={search}
            onSearchChange={setSearch}
            onSelect={setSelected}
            onDelete={(id) => setDeleteId(id)}
          />
        </motion.div>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Conversation"
          message="Are you sure you want to delete this conversation? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => { deleteConversation(deleteId); setDeleteId(null) }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
