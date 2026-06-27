// NOTE PENANDA: CLAUDE_API_ROUTE_v1.0
// Next.js API route untuk Claude chat endpoint
// POST /api/claude → send message & get response
// NOTE: Using MOCK for development (will swap to real API later)

import { NextRequest, NextResponse } from 'next/server'
import { sendMockMessage, streamMockMessage } from '@/lib/claude-mock'

export const runtime = 'nodejs'

interface ChatRequest {
  message: string
  systemPrompt?: string
  stream?: boolean
  model?: string
}

// POST handler - non-streaming response
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()

    const { message, systemPrompt, stream = false, model } = body

    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // STREAMING: Return ReadableStream
    if (stream) {
      const encoder = new TextEncoder()
      const stream_gen = streamMockMessage(message)

      // Create ReadableStream from async generator
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream_gen) {
              controller.enqueue(encoder.encode(chunk))
            }
            controller.close()
          } catch (error) {
            console.error('Stream error:', error)
            controller.error(error)
          }
        },
      })

      return new NextResponse(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // NON-STREAMING: Regular JSON response (using mock)
    const response = await sendMockMessage(message)

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Claude API Error:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    )
  }
}

// OPTIONS handler - CORS support
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}
