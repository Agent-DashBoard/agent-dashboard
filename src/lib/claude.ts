// NOTE PENANDA: CLAUDE_CLIENT_LIBRARY_v1.0
// Claude API client & utilities for HERMES JARVIS OS
// Handles chat, streaming, token counting, cost tracking

import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Type definitions
export interface MessageParams {
  userMessage: string
  systemPrompt?: string
  model?: string
  maxTokens?: number
}

export interface ChatResponse {
  content: string
  stopReason: string
  inputTokens: number
  outputTokens: number
  costUsd: number
}

// Pricing (as of June 2026)
const PRICING = {
  'claude-3-5-sonnet-20241022': {
    inputPer1M: 3.0,
    outputPer1M: 15.0,
  },
  'claude-3-5-haiku-20241022': {
    inputPer1M: 0.8,
    outputPer1M: 4.0,
  },
}

// Calculate cost in USD
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING[model as keyof typeof PRICING] || PRICING['claude-3-5-sonnet-20241022']
  
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPer1M
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPer1M
  
  return inputCost + outputCost
}

// Send message to Claude
export async function sendMessage(params: MessageParams): Promise<ChatResponse> {
  const {
    userMessage,
    systemPrompt = 'Kamu adalah HERMES-AGENT, asisten AI untuk HERMES JARVIS OS. Jawab dalam Bahasa Indonesia, to the point, tidak bertele-tele.',
    model = 'claude-3-5-sonnet-20241022',
    maxTokens = 1024,
  } = params

  try {
    const message = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const textContent = message.content.find((block) => block.type === 'text')
    const responseText = textContent && 'text' in textContent ? textContent.text : ''

    const costUsd = calculateCost(
      model,
      message.usage.input_tokens,
      message.usage.output_tokens
    )

    return {
      content: responseText,
      stopReason: message.stop_reason,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
      costUsd,
    }
  } catch (error) {
    console.error('Claude API Error:', error)
    throw error
  }
}

// Send streaming message to Claude
export async function* streamMessage(params: MessageParams): AsyncGenerator<string> {
  const {
    userMessage,
    systemPrompt = 'Kamu adalah HERMES-AGENT, asisten AI untuk HERMES JARVIS OS. Jawab dalam Bahasa Indonesia, to the point, tidak bertele-tele.',
    model = 'claude-3-5-sonnet-20241022',
    maxTokens = 1024,
  } = params

  try {
    const stream = await client.messages.stream({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield chunk.delta.text
      }
    }
  } catch (error) {
    console.error('Claude Stream Error:', error)
    throw error
  }
}

// Get token count (estimation)
export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4)
}

export { client }
