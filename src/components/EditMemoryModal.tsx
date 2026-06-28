// NOTE PENANDA: EditMemoryModal_v1.0
// Modal untuk mengedit detail Memory yang sudah ada.

'use client';

import { useEffect, useState } from 'react';
import { Plus, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { updateMemory } from '@/lib/queries/memories';
import type { Memory } from '@/lib/supabase-client';

interface EditMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: Memory; // Memory yang akan diedit
  onMemoryUpdated: (memory: Memory) => void;
}

export function EditMemoryModal({ isOpen, onClose, memory, onMemoryUpdated }: EditMemoryModalProps) {
  const [title, setTitle] = useState(memory.title);
  const [content, setContent] = useState(memory.content);
  const [tags, setTags] = useState(memory.tags ? memory.tags.join(', ') : ''); // Convert array to string for input
  const [status, setStatus] = useState<'active' | 'archived' | 'important'>(memory.status);
  const [relevance, setRelevance] = useState(memory.relevance);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update state lokal jika prop memory berubah (misal, user klik edit memory lain)
  useEffect(() => {
    setTitle(memory.title);
    setContent(memory.content);
    setTags(memory.tags ? memory.tags.join(', ') : '');
    setStatus(memory.status);
    setRelevance(memory.relevance);
  }, [memory]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!title.trim() || !content.trim()) {
      setError('Judul dan konten memori tidak boleh kosong.');
      setIsLoading(false);
      return;
    }

    try {
      const parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      const success = await updateMemory(memory.id, {
        title,
        content,
        tags: parsedTags,
        status,
        relevance,
      });

      if (success) {
        onMemoryUpdated({ ...memory, title, content, tags: parsedTags, status, relevance });
        onClose();
      } else {
        setError('Gagal mengupdate memori.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengupdate memori.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <XCircle className="h-6 w-6" />
        </button>
        <h2 className="mb-6 text-2xl font-bold text-white">Edit Memori: {memory.title}</h2>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <XCircle className="h-5 w-5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="editMemoryTitle" className="mb-1 block text-sm font-medium text-zinc-300">
              Judul Memori
            </label>
            <input
              type="text"
              id="editMemoryTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Misal: Rencana Implementasi Fitur X"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="editMemoryContent" className="mb-1 block text-sm font-medium text-zinc-300">
              Konten Memori
            </label>
            <textarea
              id="editMemoryContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Misal: Detil langkah-langkah, keputusan penting, atau hasil diskusi."
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            ></textarea>
          </div>

          <div>
            <label htmlFor="editMemoryTags" className="mb-1 block text-sm font-medium text-zinc-300">
              Tags (pisahkan dengan koma)
            </label>
            <input
              type="text"
              id="editMemoryTags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Misal: nextjs, supabase, ui/ux, backend"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="editMemoryStatus" className="mb-1 block text-sm font-medium text-zinc-300">
              Status
            </label>
            <select
              id="editMemoryStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'archived' | 'important')}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="important">Important</option>
            </select>
          </div>

          <div>
            <label htmlFor="editMemoryRelevance" className="mb-1 block text-sm font-medium text-zinc-300">
              Relevance (0.0 - 1.0)
            </label>
            <input
              type="number"
              id="editMemoryRelevance"
              value={relevance}
              onChange={(e) => setRelevance(parseFloat(e.target.value))}
              step="0.1"
              min="0.0"
              max="1.0"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20">
              {isLoading ? (
                <>
                  <Plus className="h-4 w-4 mr-2 animate-spin" /> Sedang Mengupdate...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Update Memori
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}