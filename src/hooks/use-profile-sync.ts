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
 */
export const useProfileSync = () => {
  const { session } = useSupabase();
  const { profiles, upsertProfile } = useProfileStore();

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
          upsertProfile(localProfile);
        }

        // 3. 上行同步：将本地有但云端没有的推送到 API
        const localIds = Object.keys(profiles);
        const missingOnServer = localIds.filter(id => !remoteIds.includes(id));

        if (missingOnServer.length > 0) {
          const profilesToUpload = missingOnServer.map(id => profiles[id]);
          
          // 逐个上传到服务器（使用现有的 POST 接口）
          for (const profile of profilesToUpload) {
            try {
              await client.post('app/profile', {
                birthDate: profile.birthDate,
                birthTime: profile.birthTime,
                gender: profile.gender,
                city: profile.city,
                label: profile.label,
              });
            } catch (err) {
              // 静默失败，下次同步再试
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
