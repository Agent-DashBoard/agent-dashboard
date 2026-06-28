// NOTE PENANDA: EditSkillModal_v1.0
// Modal untuk mengedit Skill yang sudah ada

'use client';

import { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Skill } from '@/lib/supabase-client';
import { updateSkill } from '@/lib/queries/skills';

interface EditSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill; // Skill yang akan diedit
  onSkillUpdated: (updatedSkill: Skill) => void;
}

export function EditSkillModal({ isOpen, onClose, skill, onSkillUpdated }: EditSkillModalProps) {
  const [name, setName] = useState(skill.name);
  const [description, setDescription] = useState(skill.description || '');
  const [category, setCategory] = useState<Skill['category']>(skill.category);
  const [status, setStatus] = useState<Skill['status']>(skill.status);
  const [icon, setIcon] = useState<string>(skill.icon || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state jika skill berubah (misal, membuka modal untuk skill lain)
    setName(skill.name);
    setDescription(skill.description || '');
    setCategory(skill.category);
    setStatus(skill.status);
    setIcon(skill.icon || '');
    setError(null);
  }, [skill]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedSkillData = {
        name,
        description,
        category,
        status,
        icon: icon || null,
        // config tidak diubah dari modal ini, bisa ditambahkan di modal konfigurasi terpisah jika perlu
      };
      const updated = await updateSkill(skill.id, updatedSkillData);
      if (updated) {
        onSkillUpdated(updated);
        onClose();
      } else {
        setError('Gagal memperbarui skill.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui skill.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <XCircle className="h-6 w-6" />
        </button>
        <h2 className="mb-6 text-2xl font-bold text-white">Edit Skill</h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-300">
            Nama Skill
          </label>
          <input
            type="text"
            id="name"
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-zinc-300">
            Deskripsi
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-zinc-300">
            Kategori
          </label>
          <select
            id="category"
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value as Skill['category'])}
            required
          >
            <option value="coding">Coding</option>
            <option value="writing">Writing</option>
            <option value="system">System</option>
            <option value="creative">Creative</option>
            <option value="research">Research</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-zinc-300">
            Status
          </label>
          <select
            id="status"
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value as Skill['status'])}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="icon" className="mb-1 block text-sm font-medium text-zinc-300">
            Nama Icon (Lucide React)
          </label>
          <input
            type="text"
            id="icon"
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Contoh: Code, PenTool"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Gunakan nama icon dari Lucide React (misal: Code, PenTool, BrainCircuit).
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            variant="default"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20"
            onClick={handleSubmit}
            disabled={loading || !name || !category || !status}
          >
            {loading ? 'Memperbarui...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
