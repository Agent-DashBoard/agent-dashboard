// NOTE PENANDA: MEMORY_CARD_COMPONENT_v1.0
// Reusable memory card component untuk Memory page
// Menampilkan memory items dengan tags, timestamp, dan relevance score

import { Badge } from '@/components/ui/badge'
import { Eye, Edit } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

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
    <div className="relative group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200 flex flex-col justify-between h-full">
      {/* Header: Title + Status Badge + Relevance */}
      <div className="flex flex-col mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-white flex-1 line-clamp-2 pr-2">
            {title}
          </h3>
          <Badge className={`ml-2 ${config.bg} ${config.text} border-0 text-xs`}>
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-zinc-500 mb-2">
          <span className="mr-1">Relevance:</span>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 flex-1 mr-1">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-200"
              style={{ width: `${relevance}%` }}
            />
          </div>
          <span>{relevance}%</span>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-sm text-zinc-400 line-clamp-3 mb-4 flex-grow">{content}</p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 cursor-pointer transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 text-zinc-500">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer: Timestamp + Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-auto">
        <span className="text-xs text-zinc-500">{timestamp}</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Edit size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
