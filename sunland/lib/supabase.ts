import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getEnvVar = (key: string): string => {
  if (Platform.OS === 'web' && typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || '';
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error('Missing Supabase environment variables');
  }
}

const createSupabaseClient = () => {
  return createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
      auth: {
        storage: typeof window !== 'undefined' ? AsyncStorage : undefined as any,
        autoRefreshToken: true,
        persistSession: typeof window !== 'undefined',
        detectSessionInUrl: false,
      },
    }
  );
};

export const supabase = createSupabaseClient();

export const getAudioUrl = (path: string) => {
  return supabase.storage.from('audio-files').getPublicUrl(path).data.publicUrl;
};

export const getCoverArtUrl = (path: string) => {
  return supabase.storage.from('cover-art').getPublicUrl(path).data.publicUrl;
};

export const getProfileImageUrl = (path: string) => {
  return supabase.storage.from('profile-images').getPublicUrl(path).data.publicUrl;
};
