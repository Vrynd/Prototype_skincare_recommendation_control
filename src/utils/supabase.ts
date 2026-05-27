// =============================================================================
// SUPABASE CLIENT
// Singleton client Supabase yang dipakai di seluruh aplikasi.
// Jangan pernah hardcode URL/Key — selalu ambil dari environment variables.
// =============================================================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '[Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_PUBLISHABLE_KEY tidak ditemukan di .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
