'use client'

import { Search, Trash2, MessageSquare, Calendar } from 'lucide-react'

export default function ConversationHistory({ conversations, search, onSearchChange, onSelect, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-secondary]" strokeWidth={1.5} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search conversations..."
          className="w-full h-10 pl-9 pr-3 rounded-lg border border-[--border-default] text-sm bg-white dark:bg-slate-800 text-[--text-body] placeholder:text-[--text-placeholder] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
        />
      </div>

      <div className="space-y-2">
        {conversations.map((conv) => (
          <div
            key={conv.tripId}
            className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelect(conv)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1" onClick={() => onSelect(conv)}>
                <h3 className="text-sm font-semibold text-[--text-heading] truncate">{conv.tripTitle}</h3>
                {conv.destination && (
                  <p className="text-xs text-[--text-secondary] truncate">{conv.destination}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-[--text-secondary]">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {conv.messageCount} messages
                  </span>
                  {conv.lastMessage && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {new Date(conv.lastMessage).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(conv.tripId) }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950 transition-colors shrink-0"
                aria-label="Delete conversation"
              >
                <Trash2 className="w-4 h-4 text-red-400" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
