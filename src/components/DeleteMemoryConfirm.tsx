// NOTE PENANDA: DeleteMemoryConfirm_v1.0
// Modal konfirmasi untuk menghapus Memory.

'use client';

import { useState } from 'react';
import { XCircle, Trash2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface DeleteMemoryConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // Fungsi untuk menjalankan aksi delete
  memoryId: string; // ID memory yang akan dihapus (untuk ditampilkan di UI)
}

export function DeleteMemoryConfirm({ isOpen, onClose, onConfirm, memoryId }: DeleteMemoryConfirmProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    // onConfirm akan memanggil fungsi deleteMemory di MemoryPage
    await onConfirm();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-lg text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <XCircle className="h-6 w-6" />
        </button>
        <Trash2 className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h2 className="mb-2 text-xl font-bold text-white">Hapus Memori Ini?</h2>
        <p className="mb-6 text-zinc-400">
          Anda yakin ingin menghapus memori dengan ID <span className="font-semibold text-white">{memoryId}</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-center gap-4">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" /> Hapus
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}