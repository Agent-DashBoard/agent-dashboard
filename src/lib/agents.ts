// NOTE PENANDA: AGENT_SERVICE_LIBRARY_v1.0
// Agent execution service untuk HERMES JARVIS OS
// Handle agent tasks, status tracking, results

export type AgentType = 'HERMES-AGENT' | 'OPENCLAW' | 'CODE-GENIUS'
export type TaskStatus = 'idle' | 'running' | 'completed' | 'failed'

export interface Agent {
  id: string
  name: AgentType
  description: string
  status: 'online' | 'offline' | 'busy'
  lastTask?: string
  lastUpdate?: string
}

export interface Task {
  id: string
  agentId: string
  agentName: AgentType
  title: string
  description: string
  status: TaskStatus
  progress: number // 0-100
  result?: string
  error?: string
  startTime: string
  endTime?: string
  costUsd: number
}

// Mock agents database
export const AGENTS: Record<AgentType, Agent> = {
  'HERMES-AGENT': {
    id: 'agent-1',
    name: 'HERMES-AGENT',
    description: 'AI Operator utama. Bertugas sebagai otak dan koordinator semua tugas.',
    status: 'online',
    lastTask: 'Koordinasi agents',
    lastUpdate: new Date().toISOString(),
  },
  'OPENCLAW': {
    id: 'agent-2',
    name: 'OPENCLAW',
    description: 'Agent spesialis untuk web scraping dan riset data dari internet.',
    status: 'offline',
    lastTask: undefined,
    lastUpdate: new Date().toISOString(),
  },
  'CODE-GENIUS': {
    id: 'agent-3',
    name: 'CODE-GENIUS',
    description: 'Agent yang difokuskan untuk menulis, menganalisis, dan me-refactor kode.',
    status: 'busy',
    lastTask: 'Refactor payment module',
    lastUpdate: new Date().toISOString(),
  },
}

// Mock task templates
const TASK_TEMPLATES: Record<AgentType, { title: string; description: string }[]> = {
  'HERMES-AGENT': [
    {
      title: 'Koordinasi Agents',
      description: 'Koordinasikan semua agents untuk menjalankan tugas penting',
    },
    {
      title: 'Analisa Performa',
      description: 'Analisis performa sistem dan laporkan hasil',
    },
  ],
  'OPENCLAW': [
    {
      title: 'Web Scraping',
      description: 'Scrape data dari website kompetitor',
    },
    {
      title: 'Riset Pasar',
      description: 'Riset tren pasar dan competitor intelligence',
    },
  ],
  'CODE-GENIUS': [
    {
      title: 'Code Review',
      description: 'Review kode dan berikan saran improvement',
    },
    {
      title: 'Refactor Module',
      description: 'Refactor module untuk performa lebih baik',
    },
  ],
}

// Generate mock task result
function generateTaskResult(agentName: AgentType, taskTitle: string): string {
  const results: Record<string, string> = {
    'Koordinasi Agents': '✅ Semua agents sudah siap. HERMES-AGENT berhasil mengkoordinasikan 3 agents.',
    'Analisa Performa': '📊 Performa sistem: CPU 45%, Memory 62%, Latency 120ms',
    'Web Scraping': '🔍 Berhasil scrape 250 data dari 5 website. Data disimpan ke database.',
    'Riset Pasar': '📈 Riset selesai. Ditemukan 3 opportunity baru di market.',
    'Code Review': '✔️ Code review selesai. 8 issues ditemukan, 5 critical, 3 minor.',
    'Refactor Module': '⚡ Refactor payment module selesai. Performance +40%, Memory -25%.',
  }

  return results[taskTitle] || 'Task selesai. Cek logs untuk detail.'
}

// Execute agent task (mock)
export async function executeAgentTask(
  agentName: AgentType,
  taskTitle: string
): Promise<Task> {
  const agent = AGENTS[agentName]

  if (agent.status === 'offline') {
    throw new Error(`Agent ${agentName} sedang offline`)
  }

  const task: Task = {
    id: `task-${Date.now()}`,
    agentId: agent.id,
    agentName,
    title: taskTitle,
    description: 'Executing task...',
    status: 'running',
    progress: 0,
    startTime: new Date().toISOString(),
    costUsd: 0,
  }

  // Simulate task execution with progress updates
  return new Promise((resolve) => {
    let progress = 0

    const interval = setInterval(() => {
      progress += Math.random() * 30

      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        const result = generateTaskResult(agentName, taskTitle)
        const costUsd = Math.random() * 0.05 + 0.01

        resolve({
          ...task,
          status: 'completed',
          progress: 100,
          result,
          costUsd: parseFloat(costUsd.toFixed(4)),
          endTime: new Date().toISOString(),
        })
      } else {
        // Update progress in real scenario would use websocket/server-sent-events
        task.progress = Math.round(progress)
      }
    }, 800)
  })
}

// Get available tasks for agent
export function getAgentTasks(agentName: AgentType): { title: string; description: string }[] {
  return TASK_TEMPLATES[agentName] || []
}

// Get all agents
export function getAllAgents(): Agent[] {
  return Object.values(AGENTS)
}

// Get agent by name
export function getAgent(name: AgentType): Agent {
  return AGENTS[name]
}
