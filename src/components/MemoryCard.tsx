// NOTE PENANDA: MEMORY_CARD_COMPONENT_v1.0
// Reusable memory card component untuk Memory page
// Menampilkan memory items dengan tags, timestamp, dan relevance score

import { Badge } from '@/components/ui/badge'

interface MemoryCardProps {
  id: string
  title: string
  content: string
  tags: string[]
  timestamp: string
  relevance: number // 0-100
  status: 'active' | 'archived' | 'important'
}

export function MemoryCard({
  id,
  title,
  content,
  tags,
  timestamp,
  relevance,
  status,
}: MemoryCardProps) {
  const statusConfig = {
    active: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Active' },
    archived: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', label: 'Archived' },
    important: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      label: 'Important',
    },
  }

  const config = statusConfig[status]

  return (
    <div className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200">
      {/* Header: Title + Status Badge */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex-1 line-clamp-2">
          {title}
        </h3>
        <Badge className={`ml-2 ${config.bg} ${config.text} border-0`}>
          {config.label}
        </Badge>
      </div>

      {/* Content Preview */}
      <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{content}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 cursor-pointer transition-colors"
          >
            #{tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="text-xs px-2 py-1 text-zinc-500">
            +{tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer: Relevance + Timestamp */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
        <div className="flex-1">
          <div className="text-xs text-zinc-500 mb-1">Relevance</div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all"
              style={{ width: `${relevance}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-zinc-500 ml-2">{relevance}%</span>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-zinc-500 mt-3">{timestamp}</div>

      {/* Action Buttons (Hover) */}
      <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="flex-1 text-xs py-1.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors">
          View
        </button>
        <button className="flex-1 text-xs py-1.5 rounded bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 transition-colors">
          Edit
        </button>
      </div>
    </div>
  )
}
