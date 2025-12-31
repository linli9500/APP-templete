import { useEffect } from 'react';
import { useSupabase } from '@/hooks/use-supabase';
import { supabase } from '@/lib/supabase';
import { useProfileStore, ProfileData } from '@/stores/profile-store';
import { client } from '@/api/common/client';

// API 响应类型
interface ProfileApiResponse {
  id: string;
  birthDate: string;
  birthTime?: string;
  gender: 'male' | 'female';
  city?: string;
  label?: string;
  createdAt: string;
}

/**
 * Profile 双向同步 Hook
 * 在 _layout.tsx 中调用，登录后自动执行同步
 * 
 * 修复：使用 getState() 避免 React 闭包问题
 */
export const useProfileSync = () => {
  const { session } = useSupabase();

  useEffect(() => {
    // 未登录不同步
    if (!session?.user) return;

    const syncProfiles = async () => {
      try {
        // 验证 token 有效性
        const { data } = await supabase.auth.getSession();
        // @ts-ignore
        const customToken = supabase.rest?.headers?.['Authorization'];

        if (!data.session?.access_token && !customToken) {
          return;
        }

        // 【重要】在同步开始时获取本地数据快照
        // 使用 getState() 获取当前最新状态，避免闭包问题
        const currentProfiles = useProfileStore.getState().profiles;
        const localIdsBeforeSync = Object.keys(currentProfiles);

        // 1. 下行同步：从 API 拉取云端数据
        const response = await client.get('app/profile');
        const remoteProfiles: ProfileApiResponse[] = response.data?.profiles || [];
        const remoteIds = remoteProfiles.map(p => p.id);
        
        // 2. 合并到本地 Store（按 ID upsert）
        for (const remote of remoteProfiles) {
          const localProfile: ProfileData = {
            id: remote.id,
            birthDate: remote.birthDate,
            birthTime: remote.birthTime,
            gender: remote.gender,
            city: remote.city,
            label: remote.label,
            createdAt: remote.createdAt,
            updatedAt: remote.createdAt, // API 暂无 updatedAt，用 createdAt
          };
          useProfileStore.getState().upsertProfile(localProfile);
        }

        // 3. 上行同步：将同步前本地有但云端没有的推送到 API
        // 【关键】使用同步开始前的快照，而非 upsert 后的数据
        const missingOnServer = localIdsBeforeSync.filter(id => !remoteIds.includes(id));

        if (missingOnServer.length > 0) {
          const profilesToUpload = missingOnServer.map(id => currentProfiles[id]).filter(Boolean);
          
          // 逐个上传到服务器（传递本地 ID，让服务器做 upsert）
          for (const profile of profilesToUpload) {
            try {
              await client.post('app/profile', {
                id: profile.id, // 传递本地生成的 ID
                birthDate: profile.birthDate,
                birthTime: profile.birthTime,
                gender: profile.gender,
                city: profile.city,
                label: profile.label,
              });
            } catch (err) {
              // 静默失败，下次同步再试
              console.warn(`[ProfileSync] Upload failed for profile: ${profile.id}`, err);
            }
          }
        }

      } catch (error) {
        // 静默处理 401 等错误
        // @ts-ignore
        if (error?.response?.status !== 401) {
          console.error('[ProfileSync] Sync failed:', error);
        }
      }
    };

    syncProfiles();

    // 依赖: 仅在登录状态变化时执行
  }, [session?.user?.id]);
};
