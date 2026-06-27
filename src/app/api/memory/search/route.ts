// NOTE PENANDA: MEMORY_SEARCH_API_v1.0
// API endpoint untuk search memories dengan semantic similarity
// POST /api/memory/search → query memories via Pinecone

import { NextRequest, NextResponse } from 'next/server'
import { searchMemories, storeMemory } from '@/lib/pinecone'
import type { MemoryItem } from '@/lib/pinecone'

export const runtime = 'nodejs'

interface SearchRequest {
  query: string
  limit?: number
}

interface StoreRequest {
  content: string
  metadata?: Record<string, any>
}

// POST handler - Search memories
export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { query, limit = 5 } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query cannot be empty' },
        { status: 400 }
      )
    }

    // Search in Pinecone
    const results = await searchMemories(query, limit)

    return NextResponse.json(
      {
        query,
        results,
        count: results.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Memory Search Error:', error)

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

// GET handler - Get search info
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Use POST with query parameter to search memories' },
    { status: 200 }
  )
}

// OPTIONS handler - CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}
