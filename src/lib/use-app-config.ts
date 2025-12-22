import { create } from 'zustand';
import { AppBootstrapData, getBootstrapData } from '@/api/bootstrap';

interface AppConfigState {
  version: AppBootstrapData['version'] | null;
  features: AppBootstrapData['features'];
  ui: AppBootstrapData['ui'];
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
