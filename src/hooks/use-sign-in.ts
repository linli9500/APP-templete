import { useSupabase } from './use-supabase';
import { usePendingProfile } from './usePendingProfile';
import { Env } from '@/lib/env';

export const useSignIn = () => {
  const { isLoaded, supabase } = useSupabase();
  const { syncToServer, getProfileCount } = usePendingProfile();

  const signInWithPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    // 1. Call Web Bridge API
    const response = await fetch(`${Env.EXPO_PUBLIC_API_URL}/api/app/login`, {
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
       } else {
         throw error;
       }
    } else {
        // Even if successful, ensure headers (extra safety)
         const { setGlobalAuthToken } = require('@/lib/supabase');
         setGlobalAuthToken(data.access_token);
    }

    // 3. 登录成功后，同步本地待同步的档案
    const pendingCount = getProfileCount();
    if (pendingCount > 0) {
      console.log(`[SignIn] 检测到 ${pendingCount} 条待同步档案，开始同步...`);
      // 异步执行同步，不阻塞登录流程
      syncToServer(data.access_token).catch((err) => {
        console.error('[SignIn] 档案同步失败:', err);
      });
    }
  };

  return {
    isLoaded,
    signInWithPassword,
  };
};

