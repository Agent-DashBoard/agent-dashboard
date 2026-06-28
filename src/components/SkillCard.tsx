// NOTE PENANDA: SkillCard_v1.0
// Reusable component untuk menampilkan informasi skill dalam bentuk card.

'use client';

import {
  Code,
  PenTool,
  BrainCircuit,
  Puzzle,
  ImageIcon,
  Search,
  Settings,
  Edit,
  Trash2,
  Eye,
  XCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Skill } from '@/lib/supabase-client';

// Map kategori ke ikon Lucide
const categoryIcons: { [key: string]: React.ElementType } = {
  coding: Code,
  writing: PenTool,
  system: BrainCircuit,
  creative: ImageIcon, // Contoh icon untuk creative
  research: Search,    // Contoh icon untuk research
  default: Puzzle,     // Icon default jika kategori tidak ditemukan
};

// Map status ke warna
const statusConfig: { [key: string]: { bg: string; text: string; label: string } } = {
  active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Aktif' },
  inactive: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', label: 'Tidak Aktif' },
  deprecated: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Usang' },
};

interface SkillCardProps {
  skill: Skill;
  onView: (skillId: string) => void;
  onEdit: (skillId: string) => void;
  onDelete: (skillId: string) => void;
}

export function SkillCard({ skill, onView, onEdit, onDelete }: SkillCardProps) {
  const { id, name, description, category, status, icon } = skill;

  // Dapatkan ikon berdasarkan kategori atau nama ikon yang disimpan
  const IconComponent = icon && (categoryIcons as any)[icon] ? (categoryIcons as any)[icon] : categoryIcons[category] || categoryIcons.default;
  const currentStatus = statusConfig[status] || statusConfig.inactive;

  return (
    <div className="group relative rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 hover:border-blue-700 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-blue-500/20 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="flex-1 pr-2 text-xl font-bold text-white">{name}</h3>
        {IconComponent && <IconComponent className="h-6 w-6 text-zinc-500" />}
      </div>

      {/* Description */}
      <p className="mb-4 flex-grow text-sm text-zinc-400 line-clamp-3">
        {description || 'Tidak ada deskripsi tersedia.'}
      </p>

      {/* Footer: Category & Status */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-auto">
        <Badge className={`border-0 text-xs ${currentStatus.bg} ${currentStatus.text}`}>
          {currentStatus.label}
        </Badge>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={(e) => { e.stopPropagation(); onView(id); }}>
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={(e) => { e.stopPropagation(); onEdit(id); }}>
            <Edit size={16} />
          </Button>
          <Button variant="destructive" size="sm" className="h-7 w-7 p-0 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20"
            onClick={(e) => { e.stopPropagation(); onDelete(id); }}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
