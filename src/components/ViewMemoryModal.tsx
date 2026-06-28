// NOTE PENANDA: ViewMemoryModal_v1.0
// Modal untuk menampilkan detail lengkap dari sebuah Memory.

'use client';

import { XCircle } from 'lucide-react';
import type { Memory } from '@/lib/supabase-client';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ViewMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: Memory; // Memory yang akan ditampilkan
}

export function ViewMemoryModal({ isOpen, onClose, memory }: ViewMemoryModalProps) {
  if (!isOpen) return null;

  const statusConfig = {
    active: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Active' },
    archived: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', label: 'Archived' },
    important: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      label: 'Important',
    },
  };

  const config = statusConfig[memory.status];

  // Format the timestamp for better readability
  const formattedTimestamp = memory.created_at
    ? new Date(memory.created_at).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'N/A';

  const formattedUpdatedAt = memory.updated_at
    ? new Date(memory.updated_at).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-2xl rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <XCircle className="h-6 w-6" />
        </button>
        <h2 className="mb-4 text-3xl font-bold text-white">{memory.title}</h2>

        <div className="flex items-center gap-2 mb-4"> {/* Mengurangi gap */}
          <Badge className={`${config.bg} ${config.text} border-0 text-sm`}>
            {config.label}
          </Badge>
          <div className="flex items-center text-sm text-zinc-400">
            <span className="mr-1">Relevance:</span>
            <div className="w-16 bg-zinc-800 rounded-full h-2"> {/* Mengurangi lebar bar */}
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${memory.relevance}%` }} // Pastikan ini nilai 0-100
              />
            </div>
            <span className="ml-2">{memory.relevance}%</span> {/* Tambah % */}
          </div>
        </div>

        <p className="mb-4 text-zinc-300 whitespace-pre-wrap">{memory.content}</p> {/* Mengurangi mb */}

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4"> {/* Mengurangi gap */}
            {memory.tags.map((tag) => (
              <Badge key={tag} className="bg-zinc-800/50 text-zinc-300">#{tag}</Badge>
            ))}
          </div>
        )}

        <div className="text-sm text-zinc-500 border-t border-zinc-800 pt-3 mt-3"> {/* Mengurangi pt & mt */}
          <p>Dibuat: {formattedTimestamp}</p>
          <p>Diupdate: {formattedUpdatedAt}</p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}