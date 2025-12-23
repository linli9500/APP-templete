import { useSupabase } from './use-supabase';

export const useSignUp = () => {
  const { isLoaded, supabase } = useSupabase();

  const signUp = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name?: string;
  }) => {
    // Call Web Bridge API for registration
    const response = await fetch(`${process.env.EXPO_PUBLIC_WEB_API_URL || 'https://mfexai-v2.workers.dev'}/api/app/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
  };

  const verifyOtp = async ({
    email,
    token,
  }: {
    email: string;
    token: string;
  }) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw error;
  };

  return {
    isLoaded,
    signUp,
    verifyOtp,
  };
};
