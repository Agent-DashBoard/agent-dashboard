// NOTE PENANDA: AGENT_TASK_PANEL_COMPONENT_v1.0
// Interactive agent task panel untuk execute tasks
// Displays agents, available tasks, run buttons, task results

'use client'

import { useState } from 'react'
import { Play, AlertCircle, Loader2 } from 'lucide-react'
import { TaskModal } from './TaskModal'
import { getAllAgents, getAgentTasks, executeAgentTask } from '@/lib/agents'
import type { Agent, Task, AgentType } from '@/lib/agents'

export function AgentTaskPanel() {
  const [agents] = useState<Agent[]>(getAllAgents())
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const availableTasks = selectedAgent
    ? getAgentTasks(selectedAgent.name as AgentType)
    : []

  const handleExecuteTask = async (taskTitle: string) => {
    if (!selectedAgent) return

    setIsExecuting(true)
    setError(null)

    try {
      // Call API to execute task
      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: selectedAgent.name,
          taskTitle,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const task: Task = await response.json()
      setCurrentTask(task)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      console.error('Task execution error:', err)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleRetryTask = async () => {
    if (!currentTask) return
    await handleExecuteTask(currentTask.title)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Agent Selector */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            Select Agent
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                disabled={agent.status === 'offline'}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedAgent?.id === agent.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
                } ${
                  agent.status === 'offline'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">
                    {agent.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      agent.status === 'online'
                        ? 'text-green-400'
                        : agent.status === 'busy'
                        ? 'text-yellow-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        agent.status === 'online'
                          ? 'bg-green-500'
                          : agent.status === 'busy'
                          ? 'bg-yellow-500'
                          : 'bg-zinc-500'
                      }`}
                    />
                    {agent.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {agent.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Available Tasks */}
        {selectedAgent && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Available Tasks
            </h3>

            {availableTasks.length > 0 ? (
              <div className="space-y-3">
                {availableTasks.map((taskTemplate, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">
                          {taskTemplate.title}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1">
                          {taskTemplate.description}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleExecuteTask(taskTemplate.title)
                        }
                        disabled={
                          isExecuting ||
                          selectedAgent.status === 'offline'
                        }
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                           bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20"
                      >
                        {isExecuting ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                        Run
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-zinc-700 bg-zinc-900/50">
                <p className="text-sm text-zinc-400">
                  No tasks available for this agent
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-300">Error</p>
              <p className="text-xs text-red-400 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={currentTask}
        onClose={() => setCurrentTask(null)}
        onRetry={handleRetryTask}
      />
    </>
  )
}
