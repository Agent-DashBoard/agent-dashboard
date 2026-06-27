// NOTE PENANDA: CHAT_PANEL_COMPONENT_v1.0_WITH_ERROR_HANDLING
// Interactive chat UI component untuk HERMES JARVIS OS
// Send messages, display responses, track costs, error handling

'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, AlertCircle, RefreshCw, X } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  cost?: number
  tokens?: { input: number; output: number }
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCost, setTotalCost] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('id-ID'),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError(null)
    setIsLoading(true)

    try {
      // Send to Claude API endpoint
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()

      // Add assistant message
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString('id-ID'),
        cost: data.costUsd,
        tokens: {
          input: data.inputTokens,
          output: data.outputTokens,
        },
      }

      setMessages((prev) => [...prev, assistantMessage])
      setTotalCost((prev) => prev + data.costUsd)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 rounded-lg border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-white">HERMES Chat</h3>
        <p className="text-xs text-zinc-500 mt-1">
          Chat dengan HERMES-AGENT · Cost: ${totalCost.toFixed(4)}
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-zinc-500 text-sm">
              Mulai percakapan dengan HERMES-AGENT
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30'
                  : 'bg-zinc-800/50 text-zinc-100 border border-zinc-700'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-zinc-500">{msg.timestamp}</span>
                {msg.cost && (
                  <span className="text-xs text-yellow-500 ml-2">
                    ${msg.cost.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800/50 border border-zinc-700 px-4 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="bg-red-500/20 border border-red-500/50 px-4 py-2 rounded-lg flex items-center gap-2 max-w-xs">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-300 font-medium">Error</p>
                <p className="text-xs text-red-400 mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-zinc-800 p-4 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          className="flex-1 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  )
}
