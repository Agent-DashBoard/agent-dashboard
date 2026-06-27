// NOTE PENANDA: ACTIVITY_PAGE_v1.0
// Activity page - Static UI dengan mock data
// Menampilkan log semua aktivitas dari agents

'use client'

import { useState } from 'react'
import { ActivityCard } from '@/components/ActivityCard'
import { Filter, TrendingUp } from 'lucide-react'

// Mock activity data
const MOCK_ACTIVITIES = [
  {
    id: '1',
    agentName: 'CODE-GENIUS',
    action: 'Refactor React component',
    result: 'Successfully refactored AgentCard component, removed 40 lines of duplicate code.',
    costUsd: 0.0024,
    timestamp: '5 mins ago',
    status: 'success' as const,
  },
  {
    id: '2',
    agentName: 'OPENCLAW',
    action: 'Scrape competitor pricing',
    result: 'Found 12 competitors in AI video generation space, average price Rp1,200/video.',
    costUsd: 0.0018,
    timestamp: '15 mins ago',
    status: 'success' as const,
  },
  {
    id: '3',
    agentName: 'HERMES-AGENT',
    action: 'Analyze project ROI',
    result: 'Current ROI: +250% for past 7 days. Token cost: $2.45. Revenue potential: $50k/month if SaaS launch.',
    costUsd: 0.0031,
    timestamp: '1 hour ago',
    status: 'success' as const,
  },
  {
    id: '4',
    agentName: 'CODE-GENIUS',
    action: 'Debug Supabase integration',
    result: 'Fixed 401 error by correcting API key naming. RLS policy verified.',
    costUsd: 0.0022,
    timestamp: '2 hours ago',
    status: 'success' as const,
  },
  {
    id: '5',
    agentName: 'OPENCLAW',
    action: 'Research SaaS market trends',
    result: 'AI tools market growing 45% YoY. Highest demand: content generation & automation.',
    costUsd: 0.0041,
    timestamp: '3 hours ago',
    status: 'success' as const,
  },
  {
    id: '6',
    agentName: 'CODE-GENIUS',
    action: 'Create Memory page UI',
    result: 'Built MemoryCard component & Memory page with search/filter. Dark mode design complete.',
    costUsd: 0.0019,
    timestamp: '4 hours ago',
    status: 'success' as const,
  },
  {
    id: '7',
    agentName: 'HERMES-AGENT',
    action: 'Validate SaaS idea',
    result: 'Checked product-market fit: pain point valid, market size ~50k potential users in Indonesia.',
    costUsd: 0.0028,
    timestamp: '1 day ago',
    status: 'success' as const,
  },
  {
    id: '8',
    agentName: 'CODE-GENIUS',
    action: 'Setup Supabase agents table',
    result: 'Created agents table with schema: id, name, description, status, config. Inserted 3 agents.',
    costUsd: 0.0015,
    timestamp: '1 day ago',
    status: 'success' as const,
  },
]

const TOTAL_COST = MOCK_ACTIVITIES.reduce((sum, a) => sum + a.costUsd, 0)

export default function ActivityPage() {
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'success' | 'error' | 'pending'
  >('all')

  // Filter activities
  const filteredActivities = MOCK_ACTIVITIES.filter(
    (activity) =>
      selectedStatus === 'all' || activity.status === selectedStatus
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Activity</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Log semua aktivitas dari agents. Track progress, costs, dan results.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Total Activities</p>
              <p className="text-2xl font-bold text-white mt-1">
                {MOCK_ACTIVITIES.length}
              </p>
            </div>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Success Rate</p>
              <p className="text-2xl font-bold text-green-400 mt-1">100%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-sm font-bold text-green-400">✓</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Total API Cost</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">
                ${TOTAL_COST.toFixed(4)}
              </p>
            </div>
            <TrendingUp className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'success', 'error', 'pending'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} {...activity} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500">Tidak ada activities yang cocok.</p>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500">
          Menampilkan {filteredActivities.length} dari {MOCK_ACTIVITIES.length}{' '}
          activities | Total cost: ${TOTAL_COST.toFixed(4)}
        </p>
      </div>
    </div>
  )
}
