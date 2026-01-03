import { Env } from '@env';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { showErrorMessage } from '@/components/ui/utils';

export const client = axios.create({
  baseURL: `${Env.EXPO_PUBLIC_API_URL}/api`,
  timeout: 15000,
});

// Request Interceptor: Inject Supabase Token
client.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  } else {
    // Fallback: Check for custom bridge token (e.g. from webview/legacy auth)
    // @ts-ignore
    const customToken = supabase.rest?.headers?.['Authorization'];
    if (customToken) {
        config.headers.Authorization = customToken;
    }
  }
  return config;
});

// Response Interceptor: Handle Global Errors
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. Handle 401 Unauthorized
    // 注意：不再自动登出用户！让调用方决定如何处理 401
    // 某些 API（如 history sync）在未登录时返回 401 是正常的
    if (error.response?.status === 401) {
      // 静默处理 401，不显示错误消息，不自动登出
      // 让各个 API 调用方自己决定如何处理
      return Promise.reject(error);
    }

    // 2. Handle 500 or Network Errors
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    showErrorMessage(message);

    return Promise.reject(error);
  }
);
