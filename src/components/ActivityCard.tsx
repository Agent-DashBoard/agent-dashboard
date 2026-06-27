// NOTE PENANDA: ACTIVITY_CARD_COMPONENT_v1.0
// Reusable activity card component untuk Activity page
// Menampilkan log aktivitas: agent, action, result, cost, timestamp

import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react'

interface ActivityCardProps {
  id: string
  agentName: string
  action: string
  result: string
  costUsd: number
  timestamp: string
  status: 'success' | 'error' | 'pending'
}

export function ActivityCard({
  id,
  agentName,
  action,
  result,
  costUsd,
  timestamp,
  status,
}: ActivityCardProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      label: 'Success',
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      label: 'Error',
    },
    pending: {
      icon: Clock,
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      label: 'Pending',
    },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200">
      {/* Header: Agent + Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">{agentName}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{action}</p>
        </div>
        <Badge className={`ml-2 ${config.bg} ${config.text} border-0`}>
          <StatusIcon size={12} className="mr-1" />
          {config.label}
        </Badge>
      </div>

      {/* Result Preview */}
      <div className="bg-zinc-800/30 rounded p-2 mb-3">
        <p className="text-xs text-zinc-300 line-clamp-2">{result}</p>
      </div>

      {/* Footer: Cost + Timestamp */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <Zap size={14} className="text-yellow-500" />
          <span>${costUsd.toFixed(4)}</span>
        </div>
        <span className="text-xs text-zinc-500">{timestamp}</span>
      </div>
    </div>
  )
}
