import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: process.env.EXPO_PUBLIC_SUPABASE_SCHEMA || 'public',
  },
});

export const setGlobalAuthToken = (token: string) => {
  // This allows us to inject a token that Supabase Auth (GoTrue) doesn't recognize
  // but PostgreSQL (RLS) accepts valid.
  
  // @ts-ignore
  if (supabase.rest) {
    // @ts-ignore
    supabase.rest.headers['Authorization'] = `Bearer ${token}`; 
  }
  
  // Also set for Realtime if needed
  if (supabase.realtime) {
    supabase.realtime.setAuth(token);
  }
};

export const clearGlobalAuthToken = () => {
  // @ts-ignore
  if (supabase.rest) {
    // @ts-ignore
    delete supabase.rest.headers['Authorization'];
  }
  
  if (supabase.realtime) {
    // @ts-ignore
    supabase.realtime.setAuth(null);
  }
};





