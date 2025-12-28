import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = Platform.OS === 'web'
  ? (import.meta.env.VITE_SUPABASE_URL || '')
  : process.env.VITE_SUPABASE_URL || '';

const supabaseAnonKey = Platform.OS === 'web'
  ? (import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY || '')
  : process.env.VITE_SUPABASE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getAudioUrl = (path: string) => {
  return supabase.storage.from('audio-files').getPublicUrl(path).data.publicUrl;
};

export const getCoverArtUrl = (path: string) => {
  return supabase.storage.from('cover-art').getPublicUrl(path).data.publicUrl;
};

export const getProfileImageUrl = (path: string) => {
  return supabase.storage.from('profile-images').getPublicUrl(path).data.publicUrl;
};
