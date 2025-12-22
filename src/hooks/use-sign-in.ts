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
      refresh_token: data.access_token, // Bridge tokens are long-lived, reuse as refresh for now or handle rotation
    });

    if (error) throw error;
  };

  return {
    isLoaded,
    signInWithPassword,
  };
};
