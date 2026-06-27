// NOTE PENANDA: SKILL_CARD_COMPONENT_v1.0
// Reusable skill card component untuk Skills page
// Menampilkan skill details: nama, deskripsi, tags, version

import { Badge } from '@/components/ui/badge'
import { Code2 } from 'lucide-react'

interface SkillCardProps {
  id: string
  name: string
  description: string
  tags: string[]
  version: string
  category: string
  author: string
}

export function SkillCard({
  id,
  name,
  description,
  tags,
  version,
  category,
  author,
}: SkillCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200 group">
      {/* Header: Icon + Name + Version */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 mt-0.5">
            <Code2 size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">{name}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">v{version}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{description}</p>

      {/* Category + Author */}
      <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500">
        <Badge
          variant="outline"
          className="bg-zinc-800/30 border-zinc-700 text-zinc-400"
        >
          {category}
        </Badge>
        <span className="text-zinc-600">by {author}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 cursor-pointer transition-colors"
          >
            {tag}
          </span>
        ))}
        {tags.length > 4 && (
          <span className="text-xs px-2 py-0.5 text-zinc-500">
            +{tags.length - 4}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="flex-1 text-xs py-1.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors">
          View Details
        </button>
        <button className="flex-1 text-xs py-1.5 rounded bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 transition-colors">
          Use
        </button>
      </div>
    </div>
  )
}
