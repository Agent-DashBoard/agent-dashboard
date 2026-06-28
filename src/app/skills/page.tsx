// NOTE PENANDA: Halaman Skills, sekarang fetch data dari Supabase.
// Menggunakan useEffect untuk load data saat halaman dimuat, serta CRUD.

'use client'; // Client Component karena butuh useEffect dan useState

import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button'; // Import Button component
import { Search, Filter, Plus, XCircle } from 'lucide-react'; // Import ikon
import { SkillCard } from '@/components/SkillCard'; // Import SkillCard
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/lib/queries/skills'; // Import CRUD functions
import type { Skill } from '@/lib/supabase-client'; // Import Skill interface
import { CreateSkillModal } from '@/components/CreateSkillModal'; // Import CreateSkillModal
import { EditSkillModal } from '@/components/EditSkillModal'; // Import EditSkillModal
import { DeleteSkillConfirm } from '@/components/DeleteSkillConfirm'; // Import DeleteSkillConfirm
import { ViewSkillModal } from '@/components/ViewSkillModal'; // Import ViewSkillModal


export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'active' | 'inactive' | 'deprecated'
  >('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State untuk modal create
  const [selectedSkillToEdit, setSelectedSkillToEdit] = useState<Skill | null>(null); // State untuk skill yang akan diedit
  const [skillToDeleteId, setSkillToDeleteId] = useState<string | null>(null); // State untuk ID skill yang akan dihapus
  const [selectedSkillToView, setSelectedSkillToView] = useState<Skill | null>(null); // State untuk skill yang akan dilihat detailnya


  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSkills();
        setSkills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat skills');
      } finally {
        setLoading(false);
      }
    };
    fetchSkillsData();
  }, []);

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' || skill.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });


  const handleCreateSkill = (newSkill: Skill) => {
    setSkills((prev) => [...prev, newSkill]);
    setIsCreateModalOpen(false);
  };

  const handleEditClick = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      setSelectedSkillToEdit(skill);
    }
  };

  const handleDeleteClick = (skillId: string) => {
    setSkillToDeleteId(skillId);
  };

  const handleViewClick = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      setSelectedSkillToView(skill);
    }
  };

  const handleUpdateSkill = (updatedSkill: Skill) => {
    setSkills((prev) => prev.map(s => (s.id === updatedSkill.id ? updatedSkill : s)));
    setSelectedSkillToEdit(null);
  };

  const handleConfirmDelete = async (skillId: string) => {
    try {
      // deleteSkill akan dipanggil dari dalam modal DeleteSkillConfirm
      // Jadi di sini hanya perlu update state setelah terkonfirmasi
      setSkills((prev) => prev.filter(s => s.id !== skillId));
      setSkillToDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus skill.");
    }
  };

  return (
    <PageWrapper
      title="Skills"
      subtitle="Kelola semua jurus andalan AI Anda yang siap pakai."
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Daftar Skill</h2>
          <Button
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat Skill Baru
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Cari skill berdasarkan nama, deskripsi, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900/80 transition-all h-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'inactive', 'deprecated'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all h-full ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading && <LoadingSpinner text="Memuat skills dari Supabase..." />}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span>Terjadi kesalahan: {error}</span>
          </div>
        )}

        {!loading && filteredSkills.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-zinc-500 border border-zinc-800 rounded-lg">
            <Filter className="w-12 h-12 mb-4" />
            <p className="text-lg font-semibold">Tidak ada skill yang cocok</p>
            <p className="text-sm text-center">Coba sesuaikan pencarian atau filter Anda.</p>
          </div>
        )}

        {!loading && filteredSkills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="pt-4 border-t border-zinc-800 text-right">
            <p className="text-xs text-zinc-500">
              Menampilkan {filteredSkills.length} dari {skills.length} skill
            </p>
          </div>
        )}

        {/* Create Skill Modal */}
        <CreateSkillModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSkillCreated={handleCreateSkill}
        />

        {/* Edit Skill Modal */}
        {selectedSkillToEdit && (
          <EditSkillModal
            isOpen={!!selectedSkillToEdit}
            onClose={() => setSelectedSkillToEdit(null)}
            skill={selectedSkillToEdit}
            onSkillUpdated={handleUpdateSkill}
          />
        )}

        {/* Delete Skill Confirmation Modal */}
        {skillToDeleteId && (
          <DeleteSkillConfirm
            isOpen={!!skillToDeleteId}
            onClose={() => setSkillToDeleteId(null)}
            onConfirm={handleConfirmDelete}
            skillId={skillToDeleteId}
            skillName={skills.find(s => s.id === skillToDeleteId)?.name || 'Skill'}
          />
        )}

        {/* View Skill Modal */}
        {selectedSkillToView && (
          <ViewSkillModal
            isOpen={!!selectedSkillToView}
            onClose={() => setSelectedSkillToView(null)}
            skill={selectedSkillToView}
          />
        )}
      </div>
    </PageWrapper>
  );
}
