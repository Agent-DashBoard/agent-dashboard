// NOTE PENANDA: ActivityItem_v1.0
// Reusable component untuk menampilkan satu item aktivitas dalam timeline.

'use client';

import {
  Zap,
  BrainCircuit,
  Puzzle,
  Code,
  PenTool,
  ImageIcon,
  Search,
  CheckCircle,
  XCircle,
  Hourglass,
  Info
} from 'lucide-react';
import type { Activity } from '@/lib/supabase-client';

// Map action type ke ikon Lucide
const actionIcons: { [key: string]: React.ElementType } = {
  system_startup: Zap,
  run_skill: Puzzle,
  process_memory: BrainCircuit,
  web_scrape: Code,
  chat_interaction: PenTool,
  image_generation: ImageIcon,
  research_query: Search,
  default: Info,
};

// Map status ke warna
const statusColors: { [key: string]: string } = {
  success: 'text-green-400 bg-green-500/20',
  failed: 'text-red-400 bg-red-500/20',
  in_progress: 'text-yellow-400 bg-yellow-500/20',
  default: 'text-zinc-400 bg-zinc-500/20',
};

// Map status ke ikon status
const statusIcons: { [key: string]: React.ElementType } = {
  success: CheckCircle,
  failed: XCircle,
  in_progress: Hourglass,
  default: Info,
};


interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const { action, status, result, created_at, agent_id } = activity;

  // Dapatkan ikon berdasarkan action
  const ActionIconComponent = actionIcons[action] || actionIcons.default;
  const StatusIconComponent = statusIcons[status] || statusIcons.default;
  const statusColorClass = statusColors[status] || statusColors.default;

  // Format timestamp
  const formattedTime = new Date(created_at).toLocaleString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const formattedDate = new Date(created_at).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const getResultDescription = () => {
    if (!result) return 'Tidak ada detail hasil.';
    // Contoh sederhana, bisa diperluas untuk parsing JSON yang lebih kompleks
    if (result.message) return result.message;
    if (result.error) return `Error: ${result.error}`;
    if (result.output) return result.output;
    return JSON.stringify(result);
  };

  return (
    <div className="flex space-x-4 pb-8 border-l-2 border-zinc-700 ml-3">
      {/* Icon and Status */}
      <div className="-ml-4 mt-1">
        <span className={`h-7 w-7 rounded-full flex items-center justify-center ${statusColorClass}`}>
          <StatusIconComponent className="h-4 w-4 text-current" />
        </span>
      </div>
      <div>
        {/* Time and Date */}
        <p className="text-xs text-zinc-500">{formattedTime} pada {formattedDate}</p>

        {/* Title / Action */}
        <h3 className="font-semibold text-white flex items-center gap-2 mt-1">
          <ActionIconComponent className="h-5 w-5 text-zinc-400" />
          {action.replace(/_/g, ' ').toUpperCase()}
        </h3>

        {/* Agent ID (if available) */}
        {agent_id && (
          <p className="text-xs text-zinc-400">
            Oleh Agent: {agent_id.substring(0, 8)}...
          </p>
        )}

        {/* Result Description */}
        <p className="text-sm text-zinc-400 mt-1">
          {getResultDescription()}
        </p>

        {/* Tambahan detail bisa di sini, misal: output log, durasi, dll. */}
      </div>
    </div>
  );
}
