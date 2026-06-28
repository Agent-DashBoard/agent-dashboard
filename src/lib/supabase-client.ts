// NOTE PENANDA: SUPABASE_CLIENT_v1.2 - Singleton Pattern (Global Object for HMR)
// Supabase client initialization untuk HERMES JARVIS OS
// Centralized instance untuk semua database operations, memastikan hanya satu instance
// Menggunakan globalThis untuk mengatasi masalah HMR di Next.js

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured. Using mock mode.')
}

declare global {
  var supabaseInstance: SupabaseClient | undefined
}

function getSupabaseClient() {
  if (!globalThis.supabaseInstance) {
    globalThis.supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return globalThis.supabaseInstance
}

export const supabase = getSupabaseClient()

// Test connection
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Supabase connection error:', error.message)
      return false
    }

    console.log('✅ Supabase connected successfully')
    return true
  } catch (err) {
    console.error('Supabase test error:', err)
    return false
  }
}

// Database types (inferred from Supabase schema)
export interface Agent {
  id: string
  name: string
  role: string
  status: 'online' | 'offline' | 'busy'
  description: string
  created_at: string
}

export interface Memory {
  id: string
  title: string
  content: string
  tags: string[]
  status: 'active' | 'archived' | 'important'
  relevance: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  description: string
  category: 'coding' | 'writing' | 'system' | 'creative' | 'research' // Contoh kategori
  config: Record<string, any> | null // Konfigurasi skill dalam bentuk JSON
  status: 'active' | 'inactive' | 'deprecated'
  icon: string | null // Nama icon dari LucideReact atau sejenisnya
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: Agent
        Insert: Omit<Agent, 'id' | 'created_at'>
        Update: Partial<Omit<Agent, 'id' | 'created_at'>>
      }
      memories: {
        Row: Memory
        Insert: Omit<Memory, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Memory, 'id' | 'created_at'>>
      }
      skills: { // Tambahkan tabel skills di sini
        Row: Skill
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Skill, 'id' | 'created_at'>>
      }
      activities: {
        Row: Activity
        Insert: Omit<Activity, 'id' | 'created_at'>
        Update: Partial<Omit<Activity, 'id' | 'created_at'>>
      }
      chat_messages: {
        Row: ChatMessage
        Insert: Omit<ChatMessage, 'id' | 'created_at'>
        Update: Partial<Omit<ChatMessage, 'id' | 'created_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}



export interface Activity {
  id: string
  agent_id: string
  action: string
  status: string
  result: string
  created_at: string
}

export interface ChatMessage {
  id: string
  agent_id: string
  content: string
  role: 'user' | 'assistant'
  cost: number
  created_at: string
}
