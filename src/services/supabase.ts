import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export async function hasCompleteResearchProfile(userId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase
    .from('profiles')
    .select('country, academic_institution')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data?.country?.trim() && data?.academic_institution?.trim());
}
