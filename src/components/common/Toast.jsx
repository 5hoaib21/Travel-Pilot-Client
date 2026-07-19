'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToastContext = createContext(null)

export function useToast() {
  return useContext(ToastContext)
}

const icons = {
  success: '✓',
  error: '✕',
  info: 'i',
  warning: '!',
}

const styles = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    idRef.current += 1
    const id = idRef.current
    setToasts(prev => [...prev, { id, message, type: type === 'network' ? 'error' : type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    const handler = (e) => addToast(e.detail.message, e.detail.type, e.detail.duration)
    window.addEventListener('api:toast', handler)
    return () => window.removeEventListener('api:toast', handler)
  }, [addToast])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${styles[toast.type] || styles.info}`}
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {icons[toast.type] || icons.info}
              </span>
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-xs"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
