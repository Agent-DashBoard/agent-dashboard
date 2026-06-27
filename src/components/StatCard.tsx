// # NOTE PENANDA: Ini komponen untuk satu kartu statistik di halaman Home.
// Bisa dipakai ulang untuk menampilkan data yang berbeda.

import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  colorClassName: string; // Tailwind class, e.g., "text-green-500"
};

export function StatCard({ title, value, icon: Icon, colorClassName }: StatCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg bg-zinc-800 ${colorClassName}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}