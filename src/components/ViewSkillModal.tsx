// NOTE PENANDA: ViewSkillModal_v1.0
// Modal untuk menampilkan detail lengkap dari sebuah Skill.

'use client';

import { XCircle, Code, PenTool, BrainCircuit, Puzzle, ImageIcon, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Skill } from '@/lib/supabase-client';

// Map kategori ke ikon Lucide
const categoryIcons: { [key: string]: React.ElementType } = {
  coding: Code,
  writing: PenTool,
  system: BrainCircuit,
  creative: ImageIcon,
  research: Search,
  default: Puzzle,
};

// Map status ke warna
const statusConfig: { [key: string]: { bg: string; text: string; label: string } } = {
  active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Aktif' },
  inactive: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', label: 'Tidak Aktif' },
  deprecated: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Usang' },
};


interface ViewSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill; // Skill yang akan ditampilkan
}

export function ViewSkillModal({ isOpen, onClose, skill }: ViewSkillModalProps) {
  if (!isOpen) return null;

  const config = statusConfig[skill.status] || statusConfig.inactive;
  const IconComponent = skill.icon && (categoryIcons as any)[skill.icon] ? (categoryIcons as any)[skill.icon] : categoryIcons[skill.category] || categoryIcons.default;


  // Format the timestamp for better readability
  const formattedCreatedAt = skill.created_at
    ? new Date(skill.created_at).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'N/A';

  const formattedUpdatedAt = skill.updated_at
    ? new Date(skill.updated_at).toLocaleString('id-ID', {
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
        <div className="flex items-center mb-4">
          <h2 className="text-3xl font-bold text-white mr-4">{skill.name}</h2>
          {IconComponent && <IconComponent className="h-8 w-8 text-zinc-500" />}
        </div>


        <div className="flex items-center gap-2 mb-4">
          <Badge className={`${config.bg} ${config.text} border-0 text-sm`}>
            {config.label}
          </Badge>
          <Badge className="bg-zinc-800/50 text-zinc-300 text-sm capitalize">
            Kategori: {skill.category}
          </Badge>
        </div>


        <p className="mb-4 text-zinc-300 whitespace-pre-wrap">
          {skill.description || 'Tidak ada deskripsi tersedia.'}
        </p>

        {skill.config && Object.keys(skill.config).length > 0 && (
          <div className="mb-4 text-sm text-zinc-400">
            <h3 className="font-semibold text-white mb-2">Konfigurasi:</h3>
            <pre className="overflow-x-auto rounded-md bg-zinc-800 p-3 text-xs">
              {JSON.stringify(skill.config, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-sm text-zinc-500 border-t border-zinc-800 pt-3 mt-3">
          <p>Dibuat: {formattedCreatedAt}</p>
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
