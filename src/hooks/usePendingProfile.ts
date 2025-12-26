import { useCallback } from 'react';
import { storage } from '@/lib/storage';

/**
 * 待同步的用户档案数据结构
 * 用于存储未登录用户的分析输入数据
 */
export interface PendingProfile {
  id: string;                           // 唯一标识（时间戳 + 随机数）
  birthDate: string;                    // 格式: yyyy-MM-dd
  birthTime: string;                    // 格式: HH:mm
  gender: 'male' | 'female' | 'other';  // 性别
  createdAt: number;                    // 创建时间戳（毫秒）
}

// 存储键
const STORAGE_KEY = 'pending_profiles';
// 过期时间：15 天（毫秒）
const EXPIRY_DURATION = 15 * 24 * 60 * 60 * 1000;

/**
 * 生成唯一 ID
 */
const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 从存储中获取所有待同步档案
 */
const getAllProfiles = (): PendingProfile[] => {
  const value = storage.getString(STORAGE_KEY);
  if (!value) return [];
  try {
    return JSON.parse(value) as PendingProfile[];
  } catch {
    return [];
  }
};

/**
 * 保存所有档案到存储
 */
const saveAllProfiles = (profiles: PendingProfile[]): void => {
  storage.set(STORAGE_KEY, JSON.stringify(profiles));
};

/**
 * 清理过期的档案（超过 15 天）
 */
const cleanExpiredProfiles = (): PendingProfile[] => {
  const profiles = getAllProfiles();
  const now = Date.now();
  const validProfiles = profiles.filter(
    (profile) => now - profile.createdAt < EXPIRY_DURATION
  );
  
  // 如果有过期数据，更新存储
  if (validProfiles.length !== profiles.length) {
    saveAllProfiles(validProfiles);
  }
  
  return validProfiles;
};

/**
 * 未登录用户的本地档案管理 Hook
 * 
 * 功能：
 * - 保存用户分析输入到本地（支持多条记录）
 * - 读取所有待同步的档案
 * - 自动清理超过 15 天的过期数据
 * - 同步成功后删除指定档案
 */
export const usePendingProfile = () => {
  /**
   * 添加新的待同步档案
   * @param profile 档案数据（不含 id 和 createdAt）
   * @returns 新增的完整档案对象
   */
  const addProfile = useCallback(
    (profile: Omit<PendingProfile, 'id' | 'createdAt'>): PendingProfile => {
      // 先清理过期数据
      const existingProfiles = cleanExpiredProfiles();
      
      // 创建新档案
      const newProfile: PendingProfile = {
        ...profile,
        id: generateId(),
        createdAt: Date.now(),
      };
      
      // 添加到列表并保存
      const updatedProfiles = [...existingProfiles, newProfile];
      saveAllProfiles(updatedProfiles);
      
      console.log('[PendingProfile] 已保存本地档案:', newProfile.id);
      return newProfile;
    },
    []
  );

  /**
   * 获取所有待同步的档案（自动过滤过期数据）
   */
  const getProfiles = useCallback((): PendingProfile[] => {
    return cleanExpiredProfiles();
  }, []);

  /**
   * 删除指定的档案（同步成功后调用）
   * @param id 档案 ID
   */
  const removeProfile = useCallback((id: string): void => {
    const profiles = getAllProfiles();
    const updatedProfiles = profiles.filter((p) => p.id !== id);
    saveAllProfiles(updatedProfiles);
    console.log('[PendingProfile] 已删除本地档案:', id);
  }, []);

  /**
   * 批量删除档案（批量同步成功后调用）
   * @param ids 档案 ID 列表
   */
  const removeProfiles = useCallback((ids: string[]): void => {
    const profiles = getAllProfiles();
    const updatedProfiles = profiles.filter((p) => !ids.includes(p.id));
    saveAllProfiles(updatedProfiles);
    console.log('[PendingProfile] 已批量删除本地档案:', ids.length, '条');
  }, []);

  /**
   * 清空所有待同步档案
   */
  const clearAllProfiles = useCallback((): void => {
    storage.delete(STORAGE_KEY);
    console.log('[PendingProfile] 已清空所有本地档案');
  }, []);

  /**
   * 获取待同步档案数量
   */
  const getProfileCount = useCallback((): number => {
    return cleanExpiredProfiles().length;
  }, []);

  /**
   * 同步本地档案到服务器
   * 在用户登录/注册成功后调用
   * @param accessToken 用户的访问令牌
   * @returns 同步结果
   */
  const syncToServer = useCallback(
    async (accessToken: string): Promise<{ success: boolean; synced: number }> => {
      const profiles = getProfiles();
      
      if (profiles.length === 0) {
        console.log('[PendingProfile] 没有待同步的档案');
        return { success: true, synced: 0 };
      }

      try {
        // 从环境变量获取 API URL
        const { Env } = await import('@/lib/env');
        const apiUrl = Env.API_URL?.replace(/\/api$/, '') || '';
        
        const response = await fetch(`${apiUrl}/api/app/profile/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            profiles: profiles.map(p => ({
              birthDate: p.birthDate,
              birthTime: p.birthTime,
              gender: p.gender,
            })),
          }),
        });

        if (!response.ok) {
          console.error('[PendingProfile] 同步失败:', response.status);
          return { success: false, synced: 0 };
        }

        const result = await response.json();
        
        if (result.success) {
          // 同步成功，清除本地档案
          const syncedIds = profiles.map(p => p.id);
          removeProfiles(syncedIds);
          console.log('[PendingProfile] 同步成功:', result.synced, '条档案');
          return { success: true, synced: result.synced };
        }

        return { success: false, synced: 0 };
      } catch (error) {
        console.error('[PendingProfile] 同步出错:', error);
        return { success: false, synced: 0 };
      }
    },
    [getProfiles, removeProfiles]
  );

  return {
    addProfile,
    getProfiles,
    removeProfile,
    removeProfiles,
    clearAllProfiles,
    getProfileCount,
    syncToServer,
  };
};
