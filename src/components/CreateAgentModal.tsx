// NOTE PENANDA: CreateAgentModal_v1.0
// Modal untuk membuat Agent baru.
// Ini akan berisi form untuk mengisi detail Agent seperti nama, deskripsi, dll.

'use client';

import { useState } from 'react';
import { createAgent } from '@/lib/queries/agents'; // Import fungsi createAgent
import type { Agent } from '@/lib/supabase-client'; // Import tipe Agent
import { Plus, XCircle } from 'lucide-react';
import { Button } from './ui/button';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated: (agent: Agent) => void; // Ubah tipe menjadi Agent, bukan agentData
}

export function CreateAgentModal({ isOpen, onClose, onAgentCreated }: CreateAgentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Panggil fungsi createAgent dari queries
      const newAgent = await createAgent({ name, description }); // Menggunakan fungsi createAgent
      if (newAgent) {
        onAgentCreated(newAgent); // Mengirimkan objek Agent yang lengkap
        setName('');
        setDescription('');
        onClose();
      } else {
        setError('Gagal membuat agent. Pastikan nama unik.'); // Supabase akan memberikan error jika nama tidak unik jika ada constraint
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat agent.');
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
        <h2 className="mb-6 text-2xl font-bold text-white">Buat Agent Baru</h2>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <XCircle className="h-5 w-5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="agentName" className="mb-1 block text-sm font-medium text-zinc-300">
              Nama Agent
            </label>
            <input
              type="text"
              id="agentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: CODE-GENIUS-V2"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="agentDescription" className="mb-1 block text-sm font-medium text-zinc-300">
              Deskripsi
            </label>
            <textarea
              id="agentDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Misal: Agent untuk optimalisasi kode dengan AI"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            ></textarea>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20">
              {isLoading ? (
                <>
                  <Plus className="h-4 w-4 mr-2 animate-spin" /> Sedang Membuat...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Buat Agent
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}