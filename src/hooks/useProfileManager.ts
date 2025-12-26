import { useCallback } from 'react';
import { useProfileStore, ProfileData } from '@/stores/profile-store';
import { useSupabase } from '@/hooks/use-supabase';
import { client } from '@/api/common/client';
import type { Profile } from '@/api/profiles';

/**
 * 统一的档案管理 Hook - Local-First 架构
 * 
 * 核心原则：
 * - 始终从本地 Store 读取数据（即时显示）
 * - 本地变更立即更新 UI
 * - 已登录时后台同步到云端
 */
export const useProfileManager = () => {
  const { session } = useSupabase();
  const isLoggedIn = !!session?.user;

  // Local Store
  const { 
    profiles: localProfiles, 
    addProfile: addLocalProfile, 
    updateProfile: updateLocalProfile, 
    removeProfile: removeLocalProfile 
  } = useProfileStore();

  /**
   * 获取档案列表 - 始终从本地读取
   */
  const getProfiles = useCallback((): Profile[] => {
    return Object.values(localProfiles).map(p => ({
      id: p.id,
      birthDate: p.birthDate,
      birthTime: p.birthTime || '',
      gender: p.gender,
      city: p.city,
      label: p.label,
      createdAt: p.createdAt,
    }));
  }, [localProfiles]);

  /**
   * 添加档案
   * 1. 立即更新本地 Store
   * 2. 已登录时后台推送到 API
   */
  const addProfile = useCallback(async (data: {
    birthDate: string;
    birthTime: string;
    gender: 'male' | 'female';
    city?: string;
    label?: string;
  }) => {
    // 1. 立即保存到本地
    const newProfile = addLocalProfile(data);
    
    // 2. 已登录时后台同步到云端
    if (isLoggedIn) {
      try {
        await client.post('app/profile', data);
      } catch (err) {
        // 静默失败，下次登录时会同步
      }
    }
    
    return {
      ...newProfile,
      birthTime: newProfile.birthTime || '',
    };
  }, [isLoggedIn, addLocalProfile]);

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
    // 1. 立即更新本地
    updateLocalProfile(id, data);
    
    // 2. 已登录时后台同步
    if (isLoggedIn) {
      try {
        await client.put(`app/profile/${id}`, data);
      } catch (err) {
        // 静默失败
      }
    }
    
    const updated = localProfiles[id];
    return updated ? {
      ...updated,
      birthTime: updated.birthTime || '',
    } : null;
  }, [isLoggedIn, updateLocalProfile, localProfiles]);

  /**
   * 删除档案
   */
  const removeProfile = useCallback(async (id: string) => {
    // 1. 立即从本地删除
    removeLocalProfile(id);
    
    // 2. 已登录时后台删除
    if (isLoggedIn) {
      try {
        await client.delete(`app/profile/${id}`);
      } catch (err) {
        // 静默失败
      }
    }
  }, [isLoggedIn, removeLocalProfile]);

  return {
    profiles: getProfiles(),
    isLoading: false, // Local-First 无需等待加载
    isMutating: false,
    addProfile,
    updateProfile,
    removeProfile,
    refresh: () => {}, // 本地优先，无需手动刷新
  };
};
