// # NOTE PENANDA: Halaman Activity, cangkang untuk menampilkan log timeline.

import { PageWrapper } from "@/components/PageWrapper";
import { Zap, BrainCircuit, Puzzle } from "lucide-react";

// # NOTE PENANDA: Komponen bohongan untuk satu item log.
function ActivityItem({ time, title, description, icon: Icon, color }: any) {
    return (
        <div className="flex space-x-4 pb-8 border-l-2 border-zinc-700 ml-3">
            <div className="-ml-4 mt-1">
                <span className={`h-7 w-7 rounded-full flex items-center justify-center bg-zinc-800 ${color}`}>
                    <Icon className="h-4 w-4 text-white" />
                </span>
            </div>
            <div>
                <p className="text-sm text-zinc-500">{time}</p>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-zinc-400">{description}</p>
            </div>
        </div>
    );
}

export default function ActivityPage() {
  return (
    <PageWrapper
      title="Activity Log"
      subtitle="Jejak digital dari semua yang terjadi di dalam sistem Anda."
    >
      {/* # NOTE PENANDA: Aksi filter di atas timeline */}
      <div className="flex justify-start items-center mb-6">
        <input
          type="text"
          placeholder="Search logs..."
          className="bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Timeline Log */}
      <div>
        <ActivityItem
            time="10:05:12 AM"
            title="Agent 'HERMES' started task"
            description='Task: "Scrape competitor data for project X"'
            icon={Zap}
            color="bg-blue-600"
        />
        <ActivityItem
            time="10:07:45 AM"
            title="Memory Indexed 5 New Files"
            description="Source: 'Obsidian Vault'"
            icon={BrainCircuit}
            color="bg-purple-600"
        />
        <ActivityItem
            time="10:09:01 AM"
            title="Skill 'Blog Writer' Executed"
            description="Generated a 500-word article from bullet points."
            icon={Puzzle}
            color="bg-green-600"
        />
        {/* Log-log lainnya akan muncul di sini */}
      </div>
    </PageWrapper>
  );
}