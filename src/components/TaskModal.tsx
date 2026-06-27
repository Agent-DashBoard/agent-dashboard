// NOTE PENANDA: TASK_MODAL_COMPONENT_v1.0
// Task execution result modal untuk HERMES JARVIS OS
// Menampilkan task details, progress, results, costs

'use client'

import { useState } from 'react'
import { X, CheckCircle, AlertCircle, Clock, DollarSign, PlayCircle } from 'lucide-react'
import type { Task } from '@/lib/agents'

interface TaskModalProps {
  task: Task | null
  onClose: () => void
  onRetry?: () => void
}

export function TaskModal({ task, onClose, onRetry }: TaskModalProps) {
  if (!task) return null

  const isCompleted = task.status === 'completed'
  const isFailed = task.status === 'failed'
  const isRunning = task.status === 'running'

  // Parse timestamps
  const startTime = new Date(task.startTime)
  const endTime = task.endTime ? new Date(task.endTime) : new Date()
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-zinc-800 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isCompleted && (
                <CheckCircle className="w-6 h-6 text-green-400" />
              )}
              {isFailed && (
                <AlertCircle className="w-6 h-6 text-red-400" />
              )}
              {isRunning && (
                <PlayCircle className="w-6 h-6 text-blue-400 animate-pulse" />
              )}
              <div>
                <h2 className="text-xl font-bold text-white">{task.title}</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Agent: <span className="font-medium">{task.agentName}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-zinc-300">Progress</span>
                <span className="text-sm font-bold text-white">{task.progress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isCompleted
                    ? 'bg-green-500/20 text-green-400'
                    : isFailed
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {task.status.toUpperCase()}
              </span>
            </div>

            {/* Task Description */}
            {task.description && (
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-2">
                  Description
                </h4>
                <p className="text-sm text-zinc-400">{task.description}</p>
              </div>
            )}

            {/* Task Result */}
            {isCompleted && task.result && (
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-zinc-300 mb-2">
                  Result
                </h4>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                  {task.result}
                </p>
              </div>
            )}

            {/* Error Message */}
            {isFailed && task.error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-red-400 mb-2">Error</h4>
                <p className="text-sm text-red-300">{task.error}</p>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Duration</p>
                <p className="flex items-center gap-1 text-sm font-semibold text-white">
                  <Clock className="w-4 h-4" />
                  {duration}s
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Cost</p>
                <p className="flex items-center gap-1 text-sm font-semibold text-yellow-400">
                  <DollarSign className="w-4 h-4" />
                  ${task.costUsd.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Started</p>
                <p className="text-sm font-semibold text-white">
                  {startTime.toLocaleTimeString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-800 p-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
            >
              Close
            </button>
            {(isFailed || isCompleted) && onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
