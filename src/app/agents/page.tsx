// # NOTE PENANDA: Halaman Agents, sekarang fetch data dari Supabase.
// Menggunakan useEffect untuk load data saat halaman dimuat.

"use client"; // Client Component karena butuh useEffect

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Zap } from "lucide-react";
import { AgentTaskPanel } from "@/components/AgentTaskPanel";
import { getAgents } from "@/lib/queries/agents";
import type { Agent } from "@/lib/supabase-client";

function AgentCard({ name, description, status }: Agent) {
    const statusConfig = {
        online: { color: "bg-green-500", text: "Online" },
        offline: { color: "bg-zinc-500", text: "Offline" },
        busy: { color: "bg-yellow-500", text: "Busy" },
    };

    const currentStatus = statusConfig[status];

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold mb-1">{name}</h3>
                    <p className="text-zinc-400 text-sm">{description}</p>
                </div>
                <div className="flex items-center space-x-2 text-xs px-2 py-1 rounded-full bg-zinc-800">
                    <span className={`h-2 w-2 rounded-full ${currentStatus.color}`}></span>
                    <span>{currentStatus.text}</span>
                </div>
            </div>
            <div className="mt-6 flex space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-3 py-1 rounded-md flex items-center space-x-1">
                    <Zap className="h-3 w-3" />
                    <span>Run Task</span>
                </button>
                 <button className="bg-zinc-700 hover:bg-zinc-600 text-white font-semibold text-sm px-3 py-1 rounded-md">
                    Configure
                </button>
            </div>
        </div>
    );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAgents();
        setAgents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal fetch agents");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <PageWrapper
      title="Agents"
      subtitle="Markas besar untuk semua AI Agent Anda yang siap tempur."
    >
      <div className="space-y-8">
        {/* Agents List Section */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Registered Agents</h2>
          {loading && <LoadingSpinner text="Loading agents from Supabase..." />}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              Error: {error}
            </div>
          )}

          {!loading && agents.length === 0 && (
            <p className="text-zinc-400">Tidak ada agents.</p>
          )}

          {!loading && agents.length > 0 && (
            <div className="space-y-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} {...agent} />
              ))}
            </div>
          )}
        </div>

        {/* Task Execution Section */}
        <div className="border-t border-zinc-800 pt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Execute Tasks</h2>
          <AgentTaskPanel />
        </div>
      </div>
    </PageWrapper>
  );
}