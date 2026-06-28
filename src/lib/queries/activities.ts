// NOTE PENANDA: ACTIVITY_QUERIES_SERVICE_v1.0
// Query functions untuk activities dari Supabase
// Get activities, create logs, filter by agent

import { supabase } from '@/lib/supabase-client'
import type { Activity } from '@/lib/supabase-client'

/**
 * Get all activities
 */
export async function getActivities(): Promise<Activity[]> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching activities:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to get activities:', err)
    return []
  }
}

/**
 * Get activities for specific agent
 */
export async function getActivitiesByAgent(agentId: string): Promise<Activity[]> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching agent activities:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to get agent activities:', err)
    return []
  }
}

/**
 * Get activities for today
 */
export async function getActivitiesToday(): Promise<Activity[]> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching today activities:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to get today activities:', err)
    return []
  }
}

/**
 * Get activity by ID
 */
export async function getActivityById(activityId: string): Promise<Activity | null> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('id', activityId)
      .single()

    if (error) {
      console.error('Error fetching activity:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to get activity by ID:', err)
    return null
  }
}

/**
 * Create new activity log
 */
export async function createActivity(
  activity: Omit<Activity, 'id' | 'created_at'>
): Promise<Activity | null> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([
        {
          agent_id: activity.agent_id,
          action: activity.action,
          status: activity.status,
          result: activity.result,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating activity:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to create activity:', err)
    return null
  }
}

/**
 * Update activity
 */
export async function updateActivity(
  activityId: string,
  updates: Partial<Activity>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .update(updates)
      .eq('id', activityId)

    if (error) {
      console.error('Error updating activity:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to update activity:', err)
    return false
  }
}

/**
 * Delete activity
 */
export async function deleteActivity(activityId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .eq('id', activityId)

    if (error) {
      console.error('Error deleting activity:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to delete activity:', err)
    return false
  }
}

/**
 * Subscribe to activity changes (real-time)
 */
export function subscribeToActivities(
  callback: (activities: Activity[]) => void
): (() => void) | null {
  try {
    const subscription = supabase
      .channel('activity-logs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, () => {
        getActivities().then(callback)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  } catch (err) {
    console.error('Failed to subscribe to activities:', err)
    return null
  }
}
