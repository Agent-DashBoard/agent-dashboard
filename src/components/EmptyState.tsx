// NOTE PENANDA: EMPTY_STATE_COMPONENT_v1.0
// Reusable empty state component untuk pages tanpa data
// Menampilkan friendly message & action button

import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
      <div className="mb-4 p-4 rounded-full bg-zinc-800/50">
        <Icon className="w-8 h-8 text-zinc-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
