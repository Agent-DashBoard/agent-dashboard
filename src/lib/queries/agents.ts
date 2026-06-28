// NOTE PENANDA: AGENT_QUERIES_SERVICE_v1.0
// Query functions untuk agents dari Supabase
// Get agents, update status, create new agents

import { supabase } from '@/lib/supabase-client'
import type { Agent } from '@/lib/supabase-client'

/**
 * Get all agents from Supabase
 */
export async function getAgents(): Promise<Agent[]> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching agents:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to get agents:', err)
    return []
  }
}

/**
 * Get single agent by ID
 */
export async function getAgentById(agentId: string): Promise<Agent | null> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (error) {
      console.error('Error fetching agent:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to get agent by ID:', err)
    return null
  }
}

/**
 * Get agents by status
 */
export async function getAgentsByStatus(
  status: 'online' | 'offline' | 'busy'
): Promise<Agent[]> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('status', status)

    if (error) {
      console.error('Error fetching agents by status:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to get agents by status:', err)
    return []
  }
}

/**
 * Update agent status
 */
export async function updateAgentStatus(
  agentId: string,
  status: 'online' | 'offline' | 'busy'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('agents')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', agentId)

    if (error) {
      console.error('Error updating agent status:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to update agent status:', err)
    return false
  }
}

/**
 * Create new agent
 */
export async function createAgent(agent: Omit<Agent, 'id' | 'created_at' | 'status' | 'updated_at'> & { status?: 'online' | 'offline' | 'busy' }): Promise<Agent | null> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .insert([
        {
          name: agent.name,
          description: agent.description, // Menambahkan deskripsi
          status: agent.status || 'offline', // Default status jika tidak ada
          config: agent.config || {}, // Default config jika tidak ada
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating agent:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to create agent:', err)
    return null
  }
}

/**
 * Update agent
 */
export async function updateAgent(
  agentId: string,
  updates: Partial<Omit<Agent, 'id' | 'created_at'>>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('agents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', agentId)

    if (error) {
      console.error('Error updating agent:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to update agent:', err)
    return false
  }
}

/**
 * Delete agent
 */
export async function deleteAgent(agentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId)

    if (error) {
      console.error('Error deleting agent:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to delete agent:', err)
    return false
  }
}

/**
 * Subscribe to agent status changes (real-time)
 */
export function subscribeToAgents(
  callback: (payload: {eventType: string, new: Agent | null, old: Agent | null, errors: any[] | null}) => void
): (() => void) | null {
  try {
    const subscription = supabase
      .channel('agents-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, (payload) => {
        // Panggil callback dengan payload Supabase secara langsung
        callback(payload as {eventType: string, new: Agent | null, old: Agent | null, errors: any[] | null});
      })
      .subscribe();

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe()
    }
  } catch (err) {
    console.error('Failed to subscribe to agents:', err)
    return null
  }
}
