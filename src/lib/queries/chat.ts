// NOTE PENANDA: CHAT_QUERIES_SERVICE_v1.0
// Query functions untuk chat messages dari Supabase
// Get chat history, create messages, track costs

import { supabase } from '@/lib/supabase-client'
import type { ChatMessage } from '@/lib/supabase-client'

/**
 * Get all chat messages
 */
export async function getChatMessages(): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching chat messages:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to get chat messages:', err)
    return []
  }
}

/**
 * Get chat messages for specific agent
 */
export async function getChatMessagesByAgent(agentId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching agent chat messages:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to get agent chat messages:', err)
    return []
  }
}

/**
 * Get chat message by ID
 */
export async function getChatMessageById(messageId: string): Promise<ChatMessage | null> {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('id', messageId)
      .single()

    if (error) {
      console.error('Error fetching chat message:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to get chat message by ID:', err)
    return null
  }
}

/**
 * Create new chat message
 */
export async function createChatMessage(
  message: Omit<ChatMessage, 'id' | 'created_at'>
): Promise<ChatMessage | null> {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .insert([
        {
          agent_id: message.agent_id,
          content: message.content,
          role: message.role,
          cost: message.cost,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating chat message:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to create chat message:', err)
    return null
  }
}

/**
 * Calculate total chat cost for agent
 */
export async function getAgentChatCost(agentId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('cost')
      .eq('agent_id', agentId)

    if (error) {
      console.error('Error calculating chat cost:', error.message)
      return 0
    }

    const totalCost = (data || []).reduce((sum, msg) => sum + (msg.cost || 0), 0)
    return totalCost
  } catch (err) {
    console.error('Failed to calculate chat cost:', err)
    return 0
  }
}

/**
 * Get total API cost across all agents
 */
export async function getTotalApiCost(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('cost')

    if (error) {
      console.error('Error fetching total cost:', error.message)
      return 0
    }

    const totalCost = (data || []).reduce((sum, msg) => sum + (msg.cost || 0), 0)
    return totalCost
  } catch (err) {
    console.error('Failed to get total API cost:', err)
    return 0
  }
}

/**
 * Delete chat message
 */
export async function deleteChatMessage(messageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('id', messageId)

    if (error) {
      console.error('Error deleting chat message:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to delete chat message:', err)
    return false
  }
}

/**
 * Subscribe to chat messages (real-time)
 */
export function subscribeToChatMessages(
  agentId: string,
  callback: (messages: ChatMessage[]) => void
): (() => void) | null {
  try {
    const subscription = supabase
      .channel(`chat-history-${agentId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_history' }, () => {
        getChatMessagesByAgent(agentId).then(callback)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  } catch (err) {
    console.error('Failed to subscribe to chat messages:', err)
    return null
  }
}
