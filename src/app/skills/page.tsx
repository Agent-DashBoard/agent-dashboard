// # NOTE PENANDA: Halaman Skills, cangkang untuk menampilkan galeri skill.

import { PageWrapper } from "@/components/PageWrapper";
import { Puzzle, Code, PenTool, BrainCircuit } from "lucide-react";

// # NOTE PENANDA: Komponen bohongan untuk satu kartu skill.
function SkillCard({ title, description, category, icon: Icon }: any) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{title}</h3>
                <Icon className="h-6 w-6 text-zinc-500" />
            </div>
            <p className="text-zinc-400 flex-grow mb-4">{description}</p>
            <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-1 bg-zinc-800 rounded-md text-zinc-300">{category}</span>
                <button className="text-blue-500 hover:underline">Details</button>
            </div>
        </div>
    );
}

export default function SkillsPage() {
  return (
    <PageWrapper
      title="Skills"
      subtitle="Kelola semua jurus andalan AI Anda yang siap pakai."
    >
      {/* # NOTE PENANDA: Aksi di atas galeri, seperti tombol tambah & search */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search skills..."
          className="bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md flex items-center space-x-2">
            <Puzzle className="h-4 w-4" />
            <span>Add New Skill</span>
        </button>
      </div>

      {/* Galeri Skill */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contoh kartu skill */}
        <SkillCard
            title="Website Builder"
            description="Membangun landing page dari sebuah ide dalam hitungan menit."
            category="coding"
            icon={Code}
        />
        <SkillCard
            title="Blog Post Writer"
            description="Mengubah poin-poin singkat menjadi sebuah artikel blog yang lengkap."
            category="writing"
            icon={PenTool}
        />
        <SkillCard
            title="Memory Indexer"
            description="Menganalisis file baru dan menyimpannya ke dalam memori jangka panjang."
            category="system"
            icon={BrainCircuit}
        />
         {/* Kartu-kartu skill lainnya akan muncul di sini */}
      </div>
    </PageWrapper>
  );
}