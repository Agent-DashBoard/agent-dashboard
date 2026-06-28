// NOTE PENANDA: SUPABASE_TEST_ROUTE_v1.0
// Route untuk testing koneksi Supabase dan RLS dari Next.js server.
// Akses via http://localhost:3000/api/supabase/test atau http://localhost:3001/api/supabase/test

import { NextResponse } from 'next/server'
import { testSupabaseConnection } from '@/lib/supabase-client'
import { getMemories } from '@/lib/queries/memories'

export async function GET() {
  try {
    const isConnected = await testSupabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { message: 'Supabase connection failed!', success: false },
        { status: 500 }
      )
    }

    // Test fetching memories with the client's current permissions
    const testMemories = await getMemories();
    if (!testMemories) { // getMemories returns [] on error, so check length
        return NextResponse.json(
            { message: 'Failed to fetch memories from API route - check RLS!', success: false, data: [] },
            { status: 500 }
        )
    }

    return NextResponse.json(
      {
        message: 'Supabase connected and memories fetched successfully!',
        success: true,
        testMemoriesCount: testMemories.length,
        testMemoriesSample: testMemories.slice(0,2) // show first 2
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('API Error /api/supabase/test:', error)
    return NextResponse.json(
      { message: `API Error: ${error.message}`, success: false },
      { status: 500 }
    )
  }
}
