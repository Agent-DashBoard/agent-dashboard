// NOTE PENANDA: MEMORY_PAGE_v1.0
// Memory page - Static UI dengan mock data
// Menampilkan memory items dari AI dengan search & filter

'use client'

import { useEffect, useState } from 'react'
import { MemoryCard } from '@/components/MemoryCard'
import { MemorySearchResults } from '@/components/MemorySearchResults'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button' // IMPORT BUTTON
import { Search, Filter, Plus, XCircle } from 'lucide-react'
import { getMemories, createMemory, updateMemory, deleteMemory, subscribeToMemories } from '@/lib/queries/memories' // Import CRUD functions dan subscribeToMemories
import type { Memory } from '@/lib/supabase-client' // Import Memory interface dari supabase-client
import { CreateMemoryModal } from '@/components/CreateMemoryModal' // Import CreateMemoryModal
import { EditMemoryModal } from '@/components/EditMemoryModal' // Import EditMemoryModal
import { DeleteMemoryConfirm } from '@/components/DeleteMemoryConfirm' // Import DeleteMemoryConfirm
import { ViewMemoryModal } from '@/components/ViewMemoryModal' // Import ViewMemoryModal

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'active' | 'archived' | 'important'
  >('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false) // State untuk modal create
  const [selectedMemoryToEdit, setSelectedMemoryToEdit] = useState<Memory | null>(null); // State untuk memory yang akan diedit
  const [memoryToDeleteId, setMemoryToDeleteId] = useState<string | null>(null); // State untuk ID memory yang akan dihapus
  const [selectedMemoryToView, setSelectedMemoryToView] = useState<Memory | null>(null); // State untuk memory yang akan dilihat detailnya

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

    // NOTE PENANDA: Integrasi Realtime Supabase
    const handleRealtimeUpdate = (payload: {eventType: string, new: Memory | null, old: Memory | null, errors: any[] | null}) => {
      setMemories((prevMemories) => {
        switch (payload.eventType) {
          case 'INSERT':
            if (payload.new) {
              const newMemory = payload.new as Memory;
              // Mencegah duplikasi jika sudah dihandle oleh onMemoryCreated
              if (!prevMemories.some(mem => mem.id === newMemory.id)) {
                return [...prevMemories, newMemory];
              }
            }
            break;
          case 'UPDATE':
            if (payload.new) {
              return prevMemories.map((mem) =>
                mem.id === (payload.new as Memory).id ? (payload.new as Memory) : mem
              );
            }
            break;
          case 'DELETE':
            if (payload.old) {
              return prevMemories.filter((mem) => mem.id !== (payload.old as Memory).id);
            }
            break;
          default:
            break;
        }
        return prevMemories; // Jika tidak ada perubahan atau jenis event tidak dikenal
      });
    };

    const unsubscribe = subscribeToMemories(handleRealtimeUpdate);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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

  const handleCreateMemory = (newMemory: Memory) => {
    setMemories((prev) => [...prev, newMemory]);
    setIsCreateModalOpen(false);
  };

  const handleEditClick = (memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
      setSelectedMemoryToEdit(memory);
    }
  };

  const handleDeleteClick = (memoryId: string) => {
    setMemoryToDeleteId(memoryId);
  };

  const handleViewClick = (memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
      setSelectedMemoryToView(memory);
    }
  };

  const handleUpdateMemory = (updatedMemory: Memory) => {
    setMemories((prev) => prev.map(mem => (mem.id === updatedMemory.id ? updatedMemory : mem)));
    setSelectedMemoryToEdit(null);
  };

  const handleConfirmDelete = async () => {
    if (!memoryToDeleteId) return;

    try {
      const success = await deleteMemory(memoryToDeleteId);
      if (success) {
        setMemories((prev) => prev.filter(mem => mem.id !== memoryToDeleteId));
        setMemoryToDeleteId(null);
      } else {
        setError("Gagal menghapus memori.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus memori.");
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Memory</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Ingatan penting tentang proyek, user preference, dan insights yang sudah dikumpulkan.
          </p>
        </div>
        <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20"
          onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Buat Memori Baru
        </Button>
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
            <MemoryCard key={memory.id} {...memory}
              onView={handleViewClick} // Meneruskan onView
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
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

      {/* Create Memory Modal */}
      <CreateMemoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onMemoryCreated={handleCreateMemory}
      />

      {/* Edit Memory Modal */}
      {selectedMemoryToEdit && (
        <EditMemoryModal
          isOpen={!!selectedMemoryToEdit}
          onClose={() => setSelectedMemoryToEdit(null)}
          memory={selectedMemoryToEdit}
          onMemoryUpdated={handleUpdateMemory}
        />
      )}

      {/* Delete Memory Confirmation Modal */}
      {memoryToDeleteId && (
        <DeleteMemoryConfirm
          isOpen={!!memoryToDeleteId}
          onClose={() => setMemoryToDeleteId(null)}
          onConfirm={handleConfirmDelete}
          memoryId={memoryToDeleteId}
        />
      )}

      {/* View Memory Modal */}
      {selectedMemoryToView && (
        <ViewMemoryModal
          isOpen={!!selectedMemoryToView}
          onClose={() => setSelectedMemoryToView(null)}
          memory={selectedMemoryToView}
        />
      )}
    </div>
  )
}