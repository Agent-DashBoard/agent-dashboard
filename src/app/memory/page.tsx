// NOTE PENANDA: MEMORY_PAGE_v1.0
// Memory page - Static UI dengan mock data
// Menampilkan memory items dari AI dengan search & filter

'use client'

import { useState } from 'react'
import { MemoryCard } from '@/components/MemoryCard'
import { MemorySearchResults } from '@/components/MemorySearchResults'
import { Search, Filter } from 'lucide-react'

// Mock memory data
const MOCK_MEMORIES = [
  {
    id: '1',
    title: 'BangBay prefers direct, concise responses',
    content:
      'User strongly dislikes lengthy explanations. Always be to-the-point and avoid filler content.',
    tags: ['user-preference', 'communication', 'style'],
    timestamp: '2 hours ago',
    relevance: 95,
    status: 'important' as const,
  },
  {
    id: '2',
    title: 'HERMES JARVIS OS stack: Next.js + TypeScript + Supabase',
    content:
      'Tech stack chosen for project: Next.js 14+, TypeScript, Tailwind CSS, Supabase PostgreSQL, Claude API, Pinecone for vectors.',
    tags: ['tech-stack', 'hermes-os', 'architecture'],
    timestamp: '1 day ago',
    relevance: 88,
    status: 'active' as const,
  },
  {
    id: '3',
    title: 'Monetization focus: Rp999-1,500 per video for AI tools',
    content:
      'BangBay targets digital creative ID market. Expects pricing competitive with cheap AI video bots. Focus on ROI and cuan.',
    tags: ['monetization', 'pricing', 'business-model'],
    timestamp: '3 days ago',
    relevance: 82,
    status: 'active' as const,
  },
  {
    id: '4',
    title: 'Chunked Write Protocol: MAX 350 lines per operation',
    content:
      'Critical constraint: Server timeout 2-3 min. Never exceed 350 lines in single write. Multiple small ops > one large op.',
    tags: ['protocol', 'constraint', 'development'],
    timestamp: '1 day ago',
    relevance: 92,
    status: 'important' as const,
  },
  {
    id: '5',
    title: 'Agents created: HERMES-AGENT, OPENCLAW, CODE-GENIUS',
    content:
      'Three agents initialized in Supabase. HERMES-AGENT (coordinator), OPENCLAW (web scraping), CODE-GENIUS (coding specialist).',
    tags: ['agents', 'supabase', 'setup'],
    timestamp: '5 hours ago',
    relevance: 75,
    status: 'active' as const,
  },
  {
    id: '6',
    title: 'Supabase anon key issue resolved - RLS policy created',
    content:
      'Fixed 401 error by using correct API key (anon not publishable). Created RLS policy for SELECT access on agents table.',
    tags: ['debugging', 'supabase', 'api-keys'],
    timestamp: '2 hours ago',
    relevance: 70,
    status: 'archived' as const,
  },
]

export default function MemoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'active' | 'archived' | 'important'
  >('all')

  // Filter memories
  const filteredMemories = MOCK_MEMORIES.filter((memory) => {
    const matchesSearch =
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const matchesFilter =
      selectedFilter === 'all' || memory.status === selectedFilter

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Memory</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Ingatan penting tentang proyek, user preference, dan insights yang sudah dikumpulkan.
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semantic Search - Left Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-3">
            <h2 className="text-lg font-semibold text-white">Semantic Search</h2>
            <p className="text-xs text-zinc-500">Find memories with intelligent similarity matching</p>
            <MemorySearchResults />
          </div>
        </div>

        {/* Memory List - Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900/80 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'archived', 'important'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Memory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMemories.length > 0 ? (
              filteredMemories.map((memory) => (
                <MemoryCard key={memory.id} {...memory} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-zinc-500">Tidak ada memories yang cocok.</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500">
              Menampilkan {filteredMemories.length} dari {MOCK_MEMORIES.length} memories
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
