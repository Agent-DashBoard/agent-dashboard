// NOTE PENANDA: EditAgentModal_v1.0
// Modal untuk mengedit detail Agent yang sudah ada.

'use client';

import { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { updateAgent } from '@/lib/queries/agents';
import type { Agent } from '@/lib/supabase-client';

interface EditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent; // Agent yang akan diedit
  onAgentUpdated: (agent: Agent) => void;
}

export function EditAgentModal({ isOpen, onClose, agent, onAgentUpdated }: EditAgentModalProps) {
  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description);
  const [status, setStatus] = useState<'online' | 'offline' | 'busy'>(agent.status); // Tambah state status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update state lokal jika prop agent berubah (misal, user klik edit agent lain)
  useEffect(() => {
    setName(agent.name);
    setDescription(agent.description);
    setStatus(agent.status);
  }, [agent]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name.trim() || !description.trim()) {
      setError('Nama dan deskripsi agent tidak boleh kosong.');
      setIsLoading(false);
      return;
    }

    try {
      const updated = await updateAgent(agent.id, { name, description, status }); // Panggil fungsi updateAgent
      if (updated) {
        onAgentUpdated({ ...agent, name, description, status }); // Kirim agent yang sudah diupdate
        onClose();
      } else {
        setError('Gagal mengupdate agent.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengupdate agent.');
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
        <h2 className="mb-6 text-2xl font-bold text-white">Edit Agent: {agent.name}</h2>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <XCircle className="h-5 w-5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="editAgentName" className="mb-1 block text-sm font-medium text-zinc-300">
              Nama Agent
            </label>
            <input
              type="text"
              id="editAgentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: CODE-GENIUS-V2"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="editAgentDescription" className="mb-1 block text-sm font-medium text-zinc-300">
              Deskripsi
            </label>
            <textarea
              id="editAgentDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Misal: Agent untuk optimalisasi kode dengan AI"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            ></textarea>
          </div>

          <div>
            <label htmlFor="editAgentStatus" className="mb-1 block text-sm font-medium text-zinc-300">
              Status
            </label>
            <select
              id="editAgentStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'online' | 'offline' | 'busy')}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="busy">Busy</option>
            </select>
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
                  <Plus className="h-4 w-4 mr-2" /> Update Agent
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}