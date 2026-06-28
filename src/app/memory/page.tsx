// NOTE PENANDA: MEMORY_PAGE_v1.0
// Memory page - Static UI dengan mock data
// Menampilkan memory items dari AI dengan search & filter

'use client'

import { useEffect, useState } from 'react'
import { MemoryCard } from '@/components/MemoryCard'
import { MemorySearchResults } from '@/components/MemorySearchResults'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Search, Filter } from 'lucide-react'
import { getMemories } from '@/lib/queries/memories'
import { Memory } from '@/lib/supabase-client' // Import Memory interface dari supabase-client

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'active' | 'archived' | 'important'
  >('all')

  useEffect(() => {
    const fetchMemoriesData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getMemories()
        setMemories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch memories')
      } finally {
        setLoading(false)
      }
    }
    fetchMemoriesData()
  }, [])

  // Filter memories
  const filteredMemories = memories.filter((memory) => {
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
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <h2 className="text-xl font-bold text-white">Semantic Search</h2>
            <p className="text-sm text-zinc-400">
              Temukan ingatan dengan pencarian cerdas berbasis kesamaan makna.
            </p>
            {/* Filter Tabs */}
            <div className="flex flex-col gap-2">
              <span className="text-sm text-zinc-500">Filter Status:</span>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'active', 'archived', 'important'] as const).map(
                  (filter) => (
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
                  )
                )}
              </div>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Cari ingatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900/80 transition-all"
              />
            </div>
            <MemorySearchResults />
          </div>
        </div>

        {/* Memory List - Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Search Bar (for filtering displayed memories) */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Cari cepat berdasarkan judul, konten, atau tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900/80 transition-all"
            />
          </div>

          {loading && <LoadingSpinner text="Memuat ingatan dari Supabase..." />}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              Terjadi kesalahan: {error}
            </div>
          )}

          {!loading && filteredMemories.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-zinc-500">
              <Filter className="w-12 h-12 mb-4" />
              <p className="text-lg font-semibold">Tidak ada ingatan yang cocok</p>
              <p className="text-sm">Coba sesuaikan pencarian atau filter Anda.</p>
            </div>
          )}

          {!loading && filteredMemories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMemories.map((memory) => (
                <MemoryCard key={memory.id} {...memory} />
              ))}
            </div>
          )}

          {/* Stats */}
          {!loading && (
            <div className="pt-4 border-t border-zinc-800 text-right">
              <p className="text-xs text-zinc-500">
                Menampilkan {filteredMemories.length} dari {memories.length} ingatan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
