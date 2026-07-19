'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useConversations } from '@/hooks/useConversations'
import ConversationHistory from '@/components/conversation/ConversationHistory'
import ConversationDetail from '@/components/conversation/ConversationDetail'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { ListSkeleton } from '@/components/common/LoadingSkeleton'
import EmptyState from '@/components/common/EmptyState'

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
        <ListSkeleton rows={3} />
      ) : conversations.length === 0 ? (
        <EmptyState
          icon="conversations"
          title="No conversations yet"
          description="Open the copilot on a trip to start chatting and refine your itinerary."
        />
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
