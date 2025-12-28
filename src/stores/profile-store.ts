import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { v4 as uuidv4 } from 'uuid';

// 创建专门的 MMKV 存储实例
export const profileStorage = new MMKV({
  id: 'profile-storage',
});

// Zustand 存储适配器
const zustandStorage = {
  setItem: (name: string, value: string) => {
    return profileStorage.set(name, value);
  },
  getItem: (name: string) => {
    const value = profileStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return profileStorage.delete(name);
  },
};

// Profile 数据结构
export interface ProfileData {
  id: string;
  birthDate: string;
  birthTime?: string;
  gender: 'male' | 'female';
  city?: string;
  label?: string;
  createdAt: string;
  updatedAt: string;
}

// Store 状态接口
interface ProfileState {
  profiles: Record<string, ProfileData>;
  defaultProfileId: string | null; // 默认 profile ID
  // CRUD 操作
  addProfile: (data: Omit<ProfileData, 'id' | 'createdAt' | 'updatedAt'>) => ProfileData;
  updateProfile: (id: string, data: Partial<Omit<ProfileData, 'id' | 'createdAt'>>) => void;
  removeProfile: (id: string) => void;
  // 默认设置
  setDefaultProfile: (id: string | null) => void;
  // 批量操作
  setProfiles: (profiles: Record<string, ProfileData>) => void;
  upsertProfile: (profile: ProfileData) => void;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: {},
      defaultProfileId: null, // 默认无选中
      
      // 添加新的 Profile
      addProfile: (data) => {
        const now = new Date().toISOString();
        const newProfile: ProfileData = {
          ...data,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => {
          const isFirst = Object.keys(state.profiles).length === 0;
          return {
            profiles: { ...state.profiles, [newProfile.id]: newProfile },
            // 如果是第一个 profile，自动设为默认
            defaultProfileId: isFirst ? newProfile.id : state.defaultProfileId,
          };
        });
        
        return newProfile;
      },
      
      // 更新 Profile
      updateProfile: (id, data) => {
        set((state) => {
          const existing = state.profiles[id];
          if (!existing) return state;
          
          return {
            profiles: {
              ...state.profiles,
              [id]: {
                ...existing,
                ...data,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      // 删除 Profile
      removeProfile: (id) => {
        set((state) => {
          const newProfiles = { ...state.profiles };
          delete newProfiles[id];
          
          // 如果删除的是默认 profile，清空默认或设为第一个
          let newDefaultId = state.defaultProfileId;
          if (state.defaultProfileId === id) {
            const remainingIds = Object.keys(newProfiles);
            newDefaultId = remainingIds.length > 0 ? remainingIds[0] : null;
          }
          
          return { profiles: newProfiles, defaultProfileId: newDefaultId };
        });
      },
      
      // 设置默认 Profile
      setDefaultProfile: (id) => {
        set({ defaultProfileId: id });
      },
      
      // 批量设置（覆盖）
      setProfiles: (profiles) => set({ profiles }),
      
      // 按 ID 插入或更新（用于同步）
      upsertProfile: (profile) => {
        set((state) => ({
          profiles: { ...state.profiles, [profile.id]: profile },
        }));
      },
      
      // 清空所有
      clear: () => set({ profiles: {}, defaultProfileId: null }),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
