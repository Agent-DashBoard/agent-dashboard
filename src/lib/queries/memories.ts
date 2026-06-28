// NOTE PENANDA: MEMORY_QUERIES_SERVICE_v1.0
// Query functions untuk memories dari Supabase
// Get memories, create, update, delete operations

import { supabase } from '@/lib/supabase-client'
import type { Memory } from '@/lib/supabase-client'

/**
 * Get all memories from Supabase
 */
export async function getMemories(): Promise<Memory[]> {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching memories:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to get memories:', err)
    return []
  }
}

/**
 * Get memories by status
 */
export async function getMemoriesByStatus(
  status: 'active' | 'archived' | 'important'
): Promise<Memory[]> {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching memories by status:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to get memories by status:', err)
    return []
  }
}

/**
 * Search memories by title or content
 */
export async function searchMemories(query: string): Promise<Memory[]> {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .or(
        `title.ilike.%${query}%,content.ilike.%${query}%`
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching memories:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to search memories:', err)
    return []
  }
}

/**
 * Get single memory by ID
 */
export async function getMemoryById(memoryId: string): Promise<Memory | null> {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('id', memoryId)
      .single()

    if (error) {
      console.error('Error fetching memory:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to get memory by ID:', err)
    return null
  }
}

/**
 * Create new memory
 */
export async function createMemory(
  memory: Omit<Memory, 'id' | 'created_at' | 'updated_at'>
): Promise<Memory | null> {
  try {
    const { data, error } = await supabase
      .from('memories')
      .insert([
        {
          title: memory.title,
          content: memory.content,
          tags: memory.tags,
          status: memory.status,
          relevance: memory.relevance,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating memory:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to create memory:', err)
    return null
  }
}

/**
 * Update memory
 */
export async function updateMemory(
  memoryId: string,
  updates: Partial<Memory>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('memories')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', memoryId)

    if (error) {
      console.error('Error updating memory:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to update memory:', err)
    return false
  }
}

/**
 * Delete memory
 */
export async function deleteMemory(memoryId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memoryId)

    if (error) {
      console.error('Error deleting memory:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to delete memory:', err)
    return false
  }
}

/**
 * Subscribe to memory changes (real-time)
 */
export function subscribeToMemories(
  callback: (payload: {eventType: string, new: Memory | null, old: Memory | null, errors: any[] | null}) => void
): (() => void) | null {
  try {
    const subscription = supabase
      .channel('memories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'memories' }, (payload) => {
        // Panggil callback dengan payload Supabase secara langsung
        callback(payload as {eventType: string, string, new: Memory | null, old: Memory | null, errors: any[] | null});
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  } catch (err) {
    console.error('Failed to subscribe to memories:', err)
    return null
  }
}
