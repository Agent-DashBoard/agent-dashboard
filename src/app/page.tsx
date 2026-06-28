// NOTE PENANDA: ROOT_HOME_PAGE_v1.0
// Home page - HERMES JARVIS OS dashboard (root entry point)
// Menampilkan ChatPanel + quick stats + agent status

'use client'

import { ChatPanel } from '@/components/ChatPanel'
import { TrendingUp, Zap, Activity, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col h-full"> {/* Root div takes full height */}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Selamat datang di HERMES JARVIS OS — AI Agent Management System
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Agents Active</p>
              <p className="text-2xl font-bold text-white mt-1">3</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Skills Loaded</p>
              <p className="text-2xl font-bold text-white mt-1">11</p>
            </div>
            <Zap className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Activities Today</p>
              <p className="text-2xl font-bold text-white mt-1">8</p>
            </div>
            <Activity className="text-green-500" size={24} />
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">API Cost Today</p>
              <p className="text-2xl font-bold text-white mt-1">$0.024</p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Main Content: Chat + Info */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Chat Panel - Takes 2 columns */}
        <div className="lg:col-span-2 flex flex-col min-h-0"> {/* min-h-0 untuk flex item */}
          <ChatPanel />
        </div>

        {/* Right Sidebar - Quick Info */}
        <div className="space-y-4">
          {/* Agent Status */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Agent Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">HERMES-AGENT</span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">OPENCLAW</span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                  Offline
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">CODE-GENIUS</span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Busy
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-medium transition-colors">
                Run All Agents
              </button>
              <button className="w-full px-3 py-2 rounded-lg bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 text-xs font-medium transition-colors">
                View Logs
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">System Info</h3>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Database</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>API Status</span>
                <span className="text-yellow-400">Mock Mode</span>
              </div>
              <div className="flex justify-between">
                <span>Memory</span>
                <span className="text-blue-400">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
