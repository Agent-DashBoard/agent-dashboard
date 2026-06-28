// NOTE PENANDA: DeleteSkillConfirm_v1.0
// Modal konfirmasi untuk menghapus skill

'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteSkill } from '@/lib/queries/skills';

interface DeleteSkillConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (skillId: string) => void;
  skillId: string; // ID skill yang akan dihapus
  skillName: string; // Nama skill untuk konfirmasi
}

export function DeleteSkillConfirm({ isOpen, onClose, onConfirm, skillId, skillName }: DeleteSkillConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteSkill(skillId);
      if (success) {
        onConfirm(skillId); // Panggil callback untuk menghapus dari state parent
        onClose();
      } else {
        setError('Gagal menghapus skill.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus skill.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <XCircle className="h-6 w-6" />
        </button>
        <h2 className="mb-4 text-xl font-bold text-white">Konfirmasi Hapus Skill</h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <p className="mb-6 text-zinc-300">
          Anda yakin ingin menghapus skill "<span className="font-semibold text-white">{skillName}</span>"?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </div>
    </div>
  );
}
