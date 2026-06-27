// # NOTE PENANDA: Client Supabase untuk frontend.
// File ini membaca URL dan anon key dari .env.local.
// Jangan pakai secret/service_role key di sini.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL belum diisi di .env.local");
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi di .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);