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

      {/* Main Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Cari ingatan berdasarkan judul, konten, atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900/80 transition-all h-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'active', 'archived', 'important'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all h-full ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingSpinner text="Memuat ingatan dari Supabase..." />}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-400" />
          <span>Terjadi kesalahan: {error}</span>
        </div>
      )}

      {!loading && filteredMemories.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-zinc-500 border border-zinc-800 rounded-lg">
          <Filter className="w-12 h-12 mb-4" />
          <p className="text-lg font-semibold">Tidak ada ingatan yang cocok</p>
          <p className="text-sm text-center">Coba sesuaikan pencarian atau filter Anda.</p>
        </div>
      )}

      {!loading && filteredMemories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  )
}
