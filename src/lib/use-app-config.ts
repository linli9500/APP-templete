import { create } from 'zustand';
import { AppBootstrapData, getBootstrapData } from '@/api/bootstrap';

interface AppConfigState {
  version: AppBootstrapData['version'] | null;
  features: AppBootstrapData['features'];
  ui: AppBootstrapData['ui'];
  announcement: AppBootstrapData['announcement'];
  ads: AppBootstrapData['ads'];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initApp: () => Promise<void>;
}

export const useAppConfig = create<AppConfigState>((set) => ({
  version: null,
  features: {
    enable_new_year_theme: false,
    show_home_banner: false,
  },
  ui: {
    theme_color: 'system',
  },
  announcement: {
    enabled: false,
    content: '',
  },
  ads: {
    enabled: false,
  },
  isLoading: true,
  error: null,

  initApp: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getBootstrapData();
      set({
        version: data.version,
        features: data.features,
        ui: data.ui,
        announcement: data.announcement,
        ads: data.ads,
        isLoading: false,
      });
    } catch (e) {
      set({ 
        isLoading: false, 
        error: 'Failed to load app configuration' 
      });
    }
  },
}));

