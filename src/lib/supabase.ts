import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function isSupabaseConfigured(): boolean {
  return isConfigured && supabase !== null;
}

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    isConfigured,
    maskedKey: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 6)}...${supabaseAnonKey.slice(-4)}` : 'Belum Ditetapkan',
  };
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      message: 'Supabase URL dan Anon Key belum dikonfigurasikan di fail persekitaran (.env). Data kini disimpan secara selamat dalam Storan Tempatan Pelayar (Local Storage / IndexedDB).',
    };
  }

  try {
    const { error } = await supabase.from('students').select('id').limit(1);
    if (error) {
      return {
        success: false,
        message: `Ralat sambungan Supabase: ${error.message}. Pastikan jadual pangkalan data telah dicipta menggunakan skrip SQL yang disediakan.`,
      };
    }
    return {
      success: true,
      message: 'Sambungan ke pangkalan data Supabase berjaya disahkan!',
    };
  } catch (err) {
    return {
      success: false,
      message: `Gagal menyambung ke Supabase: ${(err as Error).message}`,
    };
  }
}
