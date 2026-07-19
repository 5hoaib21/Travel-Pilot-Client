'use client'

import { Bot, User, AlertCircle } from 'lucide-react'

export default function CopilotMessage({ message }) {
  const isUser = message.role === 'user'
  const isError = message.role === 'error'

  if (isError) {
    return (
      <div className="flex justify-center px-3">
        <div className="flex items-start gap-2 max-w-sm bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-red-700 dark:text-red-300">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-2 px-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? 'bg-orange-500' : 'bg-sky-500'
      }`}>
        {isUser
          ? <User className="w-4 h-4 text-white" strokeWidth={1.5} />
          : <Bot className="w-4 h-4 text-white" strokeWidth={1.5} />
        }
      </div>
      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
        isUser
          ? 'bg-orange-500 text-white rounded-tr-sm'
          : 'bg-warm-50 dark:bg-slate-700 text-[--text-body] rounded-tl-sm'
      }`}>
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  )
}
