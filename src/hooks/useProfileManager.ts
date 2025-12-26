import { useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { usePendingProfile } from './usePendingProfile';
import { 
  useProfiles as useRemoteProfiles, 
  useAddProfile as useRemoteAddProfile,
  useUpdateProfile as useRemoteUpdateProfile,
  useDeleteProfile as useRemoteDeleteProfile,
  Profile
} from '@/api/profiles';

/**
 * 统一的档案管理 Hook
 * 根据登录状态自动切换存储策略：
 * - 未登录：使用本地存储 (usePendingProfile)
 * - 已登录：使用后端 API (useProfiles)
 */
export const useProfileManager = () => {
  const token = useAuth.use.token();
  const isLoggedIn = !!token;

  console.log('[ProfileManager] State Check:', { 
    hasToken: !!token, 
    // token is TokenType { access: string, refresh: string }, not string
    tokenAccess: token?.access ? '***' + token.access.slice(-4) : 'null',
    isLoggedIn 
  });

  // Local Storage Hooks
  const { 
    getProfiles: getLocalProfiles, 
    addProfile: addLocalProfile, 
    updateProfile: updateLocalProfile, 
    removeProfile: removeLocalProfile 
  } = usePendingProfile();

  // Remote API Hooks
  const { data: remoteData, isLoading: isRemoteLoading, refetch: refetchRemote } = useRemoteProfiles({
    variables: undefined,
    enabled: isLoggedIn,
  });
  
  const { mutateAsync: addRemoteProfile, isPending: isAdding } = useRemoteAddProfile();
  const { mutateAsync: updateRemoteProfile, isPending: isUpdating } = useRemoteUpdateProfile();
  const { mutateAsync: deleteRemoteProfile, isPending: isDeleting } = useRemoteDeleteProfile();

  /**
   * 获取档案列表
   */
  const getProfiles = useCallback((): Profile[] => {
    if (isLoggedIn) {
      return remoteData?.profiles || [];
    } else {
      // 适配本地数据结构到 Profile 接口
      return getLocalProfiles().map(p => ({
        id: p.id,
        birthDate: p.birthDate,
        birthTime: p.birthTime || '', // 本地可能为 undefined，远程为 string
        gender: p.gender,
        city: p.city,
        label: p.label,
        createdAt: new Date(p.createdAt).toISOString(),
      }));
    }
  }, [isLoggedIn, remoteData, getLocalProfiles]);

  /**
   * 添加档案
   */
  const addProfile = useCallback(async (data: {
    birthDate: string;
    birthTime: string;
    gender: 'male' | 'female';
    city?: string;
    label?: string;
  }) => {
    if (isLoggedIn) {
      const res = await addRemoteProfile(data);
      // refetchRemote(); // React Query通常会自动处理，或者在mutation onSuccess中处理 invalidate
      // 这里为了保险起见，可以手动刷新，但更推荐 reliance on query invalidation
      // 因为 react-query-kit hooks 没有直接暴露 invalidation，需要 verify standard behavior.
      // 暂时假设需要手动刷新或依赖 cache key change.
      // 实际上 createMutation 默认不自动 invalidate，需要在 mutation options 里配置 onSuccess
      // 这里我们简单返回结果，UI 层可能需要 refetch
      refetchRemote();
      return res.profile;
    } else {
      const localProfile = addLocalProfile(data);
      return {
        ...localProfile,
        birthTime: localProfile.birthTime || '', // Ensure string
        createdAt: new Date(localProfile.createdAt).toISOString()
      };
    }
  }, [isLoggedIn, addRemoteProfile, addLocalProfile, refetchRemote]);

  /**
   * 更新档案
   */
  const updateProfile = useCallback(async (id: string, data: {
    birthDate?: string;
    birthTime?: string;
    gender?: 'male' | 'female';
    city?: string;
    label?: string;
  }) => {
    if (isLoggedIn) {
      const res = await updateRemoteProfile({ id, ...data });
      refetchRemote();
      return res.profile;
    } else {
      const updated = updateLocalProfile(id, data);
      if (!updated) return null;
      return {
        ...updated,
        birthTime: updated.birthTime || '',
        createdAt: new Date(updated.createdAt).toISOString()
      };
    }
  }, [isLoggedIn, updateRemoteProfile, updateLocalProfile, refetchRemote]);

  /**
   * 删除档案
   */
  const removeProfile = useCallback(async (id: string) => {
    if (isLoggedIn) {
      await deleteRemoteProfile({ id });
      refetchRemote();
    } else {
      removeLocalProfile(id);
    }
  }, [isLoggedIn, deleteRemoteProfile, removeLocalProfile, refetchRemote]);

  return {
    profiles: getProfiles(),
    isLoading: isLoggedIn ? isRemoteLoading : false,
    isMutating: isAdding || isUpdating || isDeleting,
    addProfile,
    updateProfile,
    removeProfile,
    refresh: isLoggedIn ? refetchRemote : () => {},
  };
};
