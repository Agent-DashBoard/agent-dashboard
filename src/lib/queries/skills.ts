// NOTE PENANDA: queries/skills.ts
// Service untuk interaksi CRUD dengan tabel 'skills' di Supabase.

import { supabase } from '@/lib/supabase-client';
import type { Skill } from '@/lib/supabase-client'; // Import tipe Agent dari supabase-client

// Mendapatkan semua skills
export async function getSkills(): Promise<Skill[]> {
  // const supabase = createClient(); // Baris ini tidak lagi diperlukan
  const { data, error } = await supabase.from('skills').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
  return data;
}

// Membuat skill baru
export async function createSkill(newSkillData: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill | null> {
  // const supabase = createClient(); // Baris ini tidak lagi diperlukan
  const { data, error } = await supabase
    .from('skills')
    .insert([newSkillData])
    .select()
    .single();

  if (error) {
    console.error('Error creating skill:', error);
    throw error;
  }
  return data;
}

// Memperbarui skill yang sudah ada
export async function updateSkill(skillId: string, updatedSkillData: Partial<Omit<Skill, 'id' | 'created_at'>>): Promise<Skill | null> {
  // const supabase = createClient(); // Baris ini tidak lagi diperlukan
  const { data, error } = await supabase
    .from('skills')
    .update(updatedSkillData)
    .eq('id', skillId)
    .select()
    .single();

  if (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
  return data;
}

// Menghapus skill
export async function deleteSkill(skillId: string): Promise<boolean> {
  // const supabase = createClient(); // Baris ini tidak lagi diperlukan
  const { error } = await supabase.from('skills').delete().eq('id', skillId);

  if (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
  return true;
}

/**
 * Subscribe to skill changes (real-time)
 */
export function subscribeToSkills(
  callback: (payload: {eventType: string, new: Skill | null, old: Skill | null, errors: any[] | null}) => void
): (() => void) | null {
  try {
    const subscription = supabase
      .channel('skills-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, (payload) => {
        // Panggil callback dengan payload Supabase secara langsung
        callback(payload as {eventType: string, new: Skill | null, old: Skill | null, errors: any[] | null});
      })
      .subscribe();

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  } catch (err) {
    console.error('Failed to subscribe to skills:', err);
    return null;
  }
}
