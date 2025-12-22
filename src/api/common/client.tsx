import { Env } from '@env';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { showMessage } from 'react-native-flash-message';

export const client = axios.create({
  baseURL: Env.API_URL,
});

// Request Interceptor: Inject Supabase Token
client.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  return config;
});

// Response Interceptor: Handle Global Errors
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. Handle 401 Unauthorized (Kick out)
    if (error.response?.status === 401) {
      await supabase.auth.signOut();
      showMessage({
        message: 'Session Expired',
        description: 'Please sign in again.',
        type: 'danger',
      });
      return Promise.reject(error);
    }

    // 2. Handle 500 or Network Errors
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    showMessage({
      message: 'Error',
      description: message,
      type: 'danger',
    });

    return Promise.reject(error);
  }
);
