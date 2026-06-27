// NOTE PENANDA: TOAST_COMPONENT_v1.0
// Toast notification system untuk alerts & feedback
// Supports success, error, warning, info types

'use client'

import { useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const typeConfig = {
  success: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    icon: CheckCircle,
    text: 'text-green-400',
  },
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    icon: AlertCircle,
    text: 'text-red-400',
  },
  warning: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    icon: AlertTriangle,
    text: 'text-yellow-400',
  },
  info: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    icon: Info,
    text: 'text-blue-400',
  },
}

// Toast context & provider
export const useToastContext = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback(
    (message: string, type: Toast['type'] = 'info', duration = 3000) => {
      const id = `toast-${Date.now()}`
      const newToast: Toast = { id, message, type, duration }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

// Toast display component
interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const config = typeConfig[toast.type]
  const Icon = config.icon

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${config.bg} ${config.border} backdrop-blur-sm animate-in fade-in slide-in-from-top-2`}
    >
      <Icon className={`w-5 h-5 ${config.text} flex-shrink-0`} />
      <p className="text-sm text-white flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-zinc-400 hover:text-zinc-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast container component
interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}
