// NOTE PENANDA: queries/activities.ts
// Service untuk interaksi CRUD dengan tabel 'activities' di Supabase.

import { supabase } from '@/lib/supabase-client';
import type { Activity } from '@/lib/supabase-client';

// Mendapatkan semua activities
export async function getActivities(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
  return data;
}

// Membuat activity baru
export async function createActivity(newActivityData: Omit<Activity, 'id' | 'created_at'>): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .insert([newActivityData])
    .select()
    .single();

  if (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
  return data;
}

// Memperbarui activity yang sudah ada (jarang dipakai untuk activities, lebih sering hanya create dan read)
export async function updateActivity(activityId: string, updatedActivityData: Partial<Omit<Activity, 'id' | 'created_at'>>): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .update(updatedActivityData)
    .eq('id', activityId)
    .select()
    .single();

  if (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
  return data;
}

// Menghapus activity
export async function deleteActivity(activityId: string): Promise<boolean> {
  const { error } = await supabase.from('activities').delete().eq('id', activityId);

  if (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
  return true;
}

/**
 * Subscribe to activity changes (real-time)
 */
export function subscribeToActivities(
  callback: (payload: {eventType: string, new: Activity | null, old: Activity | null, errors: any[] | null}) => void
): (() => void) | null {
  try {
    const subscription = supabase
      .channel('activities-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, (payload) => {
        // Panggil callback dengan payload Supabase secara langsung
        callback(payload as {eventType: string, new: Activity | null, old: Activity | null, errors: any[] | null});
      })
      .subscribe();

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  } catch (err) {
    console.error('Failed to subscribe to activities:', err);
    return null;
  }
}