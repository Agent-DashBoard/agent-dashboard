// NOTE PENANDA: SKILLS_PAGE_v1.0
// Skills page - Static UI dengan mock data
// Menampilkan semua skills yang tersedia di HERMES JARVIS OS

'use client'

import { useState } from 'react'
import { SkillCard } from '@/components/SkillCard'
import { Search } from 'lucide-react'

// Mock skills data (dari 11 skills yang sudah dibuat)
const MOCK_SKILLS = [
  {
    id: '1',
    name: 'CODE-GENIUS',
    description: 'Spesialis koding Next.js, TypeScript, dan debugging.',
    tags: ['coding', 'typescript', 'nextjs', 'debugging'],
    version: '1.0.0',
    category: 'agents',
    author: 'BangBay & Abu',
  },
  {
    id: '2',
    name: 'HERMES-AGENT',
    description: 'Koordinator utama dan otak dari HERMES JARVIS OS.',
    tags: ['coordinator', 'decision-making', 'delegation'],
    version: '1.0.0',
    category: 'agents',
    author: 'BangBay & Abu',
  },
  {
    id: '3',
    name: 'OPENCLAW',
    description: 'Web scraping dan riset data dari internet.',
    tags: ['scraping', 'research', 'data-collection'],
    version: '1.0.0',
    category: 'agents',
    author: 'BangBay & Abu',
  },
  {
    id: '4',
    name: 'Git Workflow',
    description: 'Memastikan semua kode tersimpan aman dengan Git.',
    tags: ['git', 'version-control', 'backup'],
    version: '1.0.0',
    category: 'workflow',
    author: 'BangBay & Abu',
  },
  {
    id: '5',
    name: 'ROI Tracker',
    description: 'Melacak biaya AI dan ROI proyek HERMES.',
    tags: ['roi', 'financial', 'tracking'],
    version: '1.0.0',
    category: 'financial',
    author: 'BangBay & Abu',
  },
  {
    id: '6',
    name: 'Copywriting',
    description: 'Menulis konten persuasif dan marketing copy.',
    tags: ['copywriting', 'content', 'marketing'],
    version: '1.0.0',
    category: 'writing',
    author: 'BangBay & Abu',
  },
  {
    id: '7',
    name: 'Critical Thinking',
    description: 'Analisis mendalam dan keputusan berbasis data.',
    tags: ['thinking', 'decision-making', 'analysis'],
    version: '1.0.0',
    category: 'thinking',
    author: 'BangBay & Abu',
  },
  {
    id: '8',
    name: 'Prompt Engineering',
    description: 'Membuat prompt AI yang efektif dan hemat token.',
    tags: ['prompt', 'ai', 'optimization'],
    version: '1.0.0',
    category: 'ai',
    author: 'BangBay & Abu',
  },
  {
    id: '9',
    name: 'Research & Fact Checking',
    description: 'Riset mendalam dan verifikasi informasi akurat.',
    tags: ['research', 'fact-checking', 'verification'],
    version: '1.0.0',
    category: 'thinking',
    author: 'BangBay & Abu',
  },
  {
    id: '10',
    name: 'SaaS Planning',
    description: 'Merencanakan dan meluncurkan produk SaaS berbasis AI.',
    tags: ['saas', 'product', 'monetisasi'],
    version: '1.0.0',
    category: 'business',
    author: 'BangBay & Abu',
  },
  {
    id: '11',
    name: 'UI/UX & Architecture',
    description: 'Desain sistem scalable dan UX intuitif.',
    tags: ['uiux', 'design', 'architecture'],
    version: '1.0.0',
    category: 'design',
    author: 'BangBay & Abu',
  },
]

const CATEGORIES = [
  'all',
  ...Array.from(new Set(MOCK_SKILLS.map((s) => s.category))).sort(),
]

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter skills
  const filteredSkills = MOCK_SKILLS.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const matchesCategory =
      selectedCategory === 'all' || skill.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Skills</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Semua kemampuan dan tools yang tersedia untuk HERMES JARVIS OS.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900/80 transition-all"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <SkillCard key={skill.id} {...skill} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-zinc-500">Tidak ada skills yang cocok.</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500">
          Menampilkan {filteredSkills.length} dari {MOCK_SKILLS.length} skills
        </p>
      </div>
    </div>
  )
}
