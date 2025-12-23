import { useSupabase } from './use-supabase';

export const useSignIn = () => {
  const { isLoaded, supabase } = useSupabase();

  const signInWithPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    // 1. Call Web Bridge API
    const response = await fetch(`${process.env.EXPO_PUBLIC_WEB_API_URL || 'https://mfexai-v2.workers.dev'}/api/app/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // 2. Set Supabase Session manually
    const { error } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.access_token, 
    });

    if (error) {
       // Suppress "User from sub claim..." error which is expected for custom tokens
       if (error.message && error.message.includes('User from sub claim')) {
         console.log('ℹ️ Supabase Auth warning (expected): Custom Token detected. Manually setting headers.');
         const { setGlobalAuthToken } = require('@/lib/supabase');
         setGlobalAuthToken(data.access_token);
         // Manually trigger a "signed in" state if needed, or let the RLS data fetch prove it.
         return; 
       }
       throw error;
    } else {
        // Even if successful, ensure headers (extra safety)
         const { setGlobalAuthToken } = require('@/lib/supabase');
         setGlobalAuthToken(data.access_token);
    }
  };

  return {
    isLoaded,
    signInWithPassword,
  };
};
