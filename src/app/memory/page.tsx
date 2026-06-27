// # NOTE PENANDA: Halaman Memory, cangkang untuk menampung Memory Graph 3D.

import { PageWrapper } from "@/components/PageWrapper";
import { BrainCircuit, Sigma, AlertTriangle } from "lucide-react";

// # NOTE PENANDA: Komponen bohongan untuk kartu statistik di halaman ini.
// Dibuat di sini untuk sementara, nanti bisa kita pindah ke file sendiri.
function MemoryStatCard({ title, value, icon: Icon, isWarning = false }: any) {
    return (
        <div className="flex items-center space-x-3">
            <Icon className={`h-6 w-6 ${isWarning ? 'text-red-500' : 'text-zinc-400'}`} />
            <div>
                <p className="text-sm text-zinc-500">{title}</p>
                <p className={`text-2xl font-bold ${isWarning ? 'text-red-500' : 'text-white'}`}>{value}</p>
            </div>
        </div>
    );
}

export default function MemoryPage() {
  return (
    <PageWrapper
      title="Memory Graph"
      subtitle="Drag to rotate. Hover a node to trace its links. Click to inspect."
    >
      {/* Baris Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
        <MemoryStatCard title="TOTAL FILES" value="289" icon={BrainCircuit} />
        <MemoryStatCard title="WORKSPACES" value="25" icon={Sigma} />
        <MemoryStatCard title="VECTOR INDEXES" value="0" icon={BrainCircuit} />
        <MemoryStatCard title="MISSING" value="17" icon={AlertTriangle} isWarning={true} />
      </div>

      {/* Panel Utama untuk Grafik */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 min-h-[500px] flex items-center justify-center">
         <div className="text-center">
            <h3 className="text-2xl font-bold text-white">MEMORY GRAPH - 3D</h3>
            <p className="text-zinc-400">Area untuk komponen three.js akan ada di sini.</p>
         </div>
      </div>
    </PageWrapper>
  );
}