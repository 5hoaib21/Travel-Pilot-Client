'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[--overlay]" onClick={onCancel} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-lg p-6 w-full max-w-sm"
        >
          <h3 className="text-base font-heading font-bold text-[--text-heading] mb-2">{title}</h3>
          <p className="text-sm text-[--text-secondary] mb-6">{message}</p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-[--text-body] rounded-lg hover:bg-[--bg-card-hover] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
