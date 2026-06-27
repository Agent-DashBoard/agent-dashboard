// NOTE PENANDA: AGENT_EXECUTE_API_v1.0
// API endpoint untuk execute agent tasks
// POST /api/agents/execute → trigger task execution

import { NextRequest, NextResponse } from 'next/server'
import { executeAgentTask } from '@/lib/agents'
import type { AgentType } from '@/lib/agents'

export const runtime = 'nodejs'

interface ExecuteRequest {
  agentName: AgentType
  taskTitle: string
}

// POST handler - Execute agent task
export async function POST(request: NextRequest) {
  try {
    const body: ExecuteRequest = await request.json()

    const { agentName, taskTitle } = body

    // Validate input
    if (!agentName || !taskTitle) {
      return NextResponse.json(
        { error: 'agentName and taskTitle are required' },
        { status: 400 }
      )
    }

    // Execute task (mock)
    const task = await executeAgentTask(agentName, taskTitle)

    return NextResponse.json(task, { status: 200 })
  } catch (error) {
    console.error('Agent Execute Error:', error)

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

// GET handler - Get task status (future enhancement)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Use POST to execute tasks' },
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
