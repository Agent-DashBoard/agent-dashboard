// NOTE PENANDA: Halaman Agents, sekarang fetch data dari Supabase.
// Menggunakan useEffect untuk load data saat halaman dimuat.

"use client"; // Client Component karena butuh useEffect

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button"; // Import Button component
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { Plus, Zap, Settings, XCircle, Trash2 } from "lucide-react"; // Import semua ikon yang dibutuhkan
import { CreateAgentModal } from "@/components/CreateAgentModal"; // Import modal
import { EditAgentModal } from "@/components/EditAgentModal"; // Import modal Edit
import { DeleteAgentConfirm } from "@/components/DeleteAgentConfirm"; // Import modal Delete

import { AgentTaskPanel } from "@/components/AgentTaskPanel";
import { getAgents, updateAgent, deleteAgent } from "@/lib/queries/agents"; // Import updateAgent dan deleteAgent
import type { Agent } from "@/lib/supabase-client";

// AgentCard component didefinisikan di sini atau di file terpisah,
// tapi karena kita sudah punya strukturnya, Abu akan memasukannya di sini.
function AgentCard({ name, description, status, id, onEdit, onDelete }: Agent & { onEdit: (id: string) => void; onDelete: (id: string) => void; }) {
  const statusConfig = {
    online: { color: "bg-green-500", text: "Online", badgeClass: "bg-green-500/20 text-green-400", cardBorderHover: "hover:border-green-500", shadowColor: "shadow-green-500/20" },
    offline: { color: "bg-zinc-500", text: "Offline", badgeClass: "bg-zinc-500/20 text-zinc-400", cardBorderHover: "hover:border-zinc-500", shadowColor: "shadow-zinc-500/20" },
    busy: { color: "bg-yellow-500", text: "Busy", badgeClass: "bg-yellow-500/20 text-yellow-400", cardBorderHover: "hover:border-yellow-500", shadowColor: "shadow-yellow-500/20" },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className={`relative group rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 flex flex-col justify-between h-full
        ${currentStatus.cardBorderHover} hover:bg-zinc-900/80 hover:shadow-lg ${currentStatus.shadowColor}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex-1 pr-2">{name}</h3>
        <Badge className={`ml-2 ${currentStatus.badgeClass} border-0 text-xs`}>
          <span className={`h-2 w-2 rounded-full ${currentStatus.color} mr-1`}></span>
          {currentStatus.text}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-grow">{description}</p>

      <div className="flex gap-2 mt-auto">
        <Button variant="default" size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20">
          <Zap className="h-4 w-4 mr-2" />
          Jalankan Tugas
        </Button>
        <Button variant="outline" size="sm" className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-900/50 hover:text-white shadow-md shadow-purple-500/10"
                onClick={(e) => { e.stopPropagation(); onEdit(id); }}> {/* Tombol Edit */}
          <Settings className="h-4 w-4 mr-2" />
          Konfigurasi
        </Button>
        <Button variant="destructive" size="sm" className="w-10 p-0 rounded-md bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20"
          onClick={(e) => { e.stopPropagation(); onDelete(id); }}> {/* Tombol Delete */}
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State untuk modal create
  const [selectedAgentToEdit, setSelectedAgentToEdit] = useState<Agent | null>(null); // State untuk agent yang akan diedit
  const [agentToDeleteId, setAgentToDeleteId] = useState<string | null>(null); // State untuk ID agent yang akan dihapus

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAgents();
        // NOTE PENANDA: Sorting Agents sesuai request BangBay
        const sortedData = [...data].sort((a, b) => {
          const order = ['HERMES-AGENT', 'OPENCLAW', 'CODE-GENIUS'];
          const indexA = order.indexOf(a.name);
          const indexB = order.indexOf(b.name);

          // Jika keduanya ada di order, urutkan sesuai index
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          // Jika hanya A yang ada di order, A di depan
          if (indexA !== -1) {
            return -1;
          }
          // Jika hanya B yang ada di order, B di depan
          if (indexB !== -1) {
            return 1;
          }
          // Jika keduanya tidak ada di order, biarkan urutan default
          return 0;
        });
        setAgents(sortedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat agent");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleCreateAgent = (newAgent: Agent) => {
    setAgents((prev) => [...prev, newAgent]);
    setIsCreateModalOpen(false);
  };

  const handleEditClick = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgentToEdit(agent);
    }
  };

  const handleDeleteClick = (agentId: string) => {
    setAgentToDeleteId(agentId);
  };

  const handleUpdateAgent = (updatedAgent: Agent) => {
    setAgents((prev) => prev.map(agent => (agent.id === updatedAgent.id ? updatedAgent : agent)));
    setSelectedAgentToEdit(null);
  };

  const handleConfirmDelete = async () => {
    if (!agentToDeleteId) return;

    try {
      const success = await deleteAgent(agentToDeleteId);
      if (success) {
        setAgents((prev) => prev.filter(agent => agent.id !== agentToDeleteId));
        setAgentToDeleteId(null);
      } else {
        setError("Gagal menghapus agent.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus agent.");
    }
  };

  return (
    <PageWrapper
      title="Agents"
      subtitle="Markas besar untuk semua AI Agent Anda yang siap tempur."
    >
      <div className="space-y-8">
        {/* Agents List Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Agent Terdaftar</h2>
          <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20"
            onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Agent Baru
          </Button>
        </div>
        {loading && <LoadingSpinner text="Memuat agent dari Supabase..." />}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span>Terjadi kesalahan: {error}</span>
          </div>
        )}

        {!loading && agents.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-zinc-500 border border-zinc-800 rounded-lg">
            <Zap className="w-12 h-12 mb-4" />
            <p className="text-lg font-semibold">Tidak ada agent terdaftar</p>
            <p className="text-sm text-center">Silakan buat agent baru atau cek koneksi Supabase Anda.</p>
          </div>
        )}

        {!loading && agents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} {...agent}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* Task Execution Section */}
        <div className="border-t border-zinc-800 pt-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Jalankan Tugas</h2>
          <AgentTaskPanel />
        </div>
      </div>

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAgentCreated={handleCreateAgent}
      />

      {/* Edit Agent Modal */}
      {selectedAgentToEdit && (
        <EditAgentModal
          isOpen={!!selectedAgentToEdit}
          onClose={() => setSelectedAgentToEdit(null)}
          agent={selectedAgentToEdit}
          onAgentUpdated={handleUpdateAgent}
        />
      )}

      {/* Delete Agent Confirmation Modal */}
      {agentToDeleteId && (
        <DeleteAgentConfirm
          isOpen={!!agentToDeleteId}
          onClose={() => setAgentToDeleteId(null)}
          onConfirm={handleConfirmDelete}
          agentId={agentToDeleteId}
        />
      )}
    </PageWrapper>
  );
}