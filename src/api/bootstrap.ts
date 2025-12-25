// import { delay } from '@/lib'; // Removed missing import
import { client } from './common/client'; // Supabase client

export type AppBootstrapData = {
  version: {
    latest_version: string;
    force_update: boolean;
    download_url: string;
    ios_url?: string;
    android_url?: string;
  };
  features: {
    enable_new_year_theme: boolean;
    show_home_banner: boolean;
  };
  ui: {
    theme_color: string;
  };
  // 公告配置 - 内容格式: "title:标题内容; description:正文内容"
  announcement: {
    enabled: boolean;
    content: string;
  };
};

// Mock data suitable for initial development
const MOCK_BOOTSTRAP_DATA: AppBootstrapData = {
  version: {
    latest_version: '1.0.1',
    force_update: false,
    download_url: 'https://example.com/update',
    ios_url: '',
    android_url: '',
  },
  features: {
    enable_new_year_theme: false,
    show_home_banner: true,
  },
  ui: {
    theme_color: '#system',
  },
  announcement: {
    enabled: false,
    content: '',
  },
};

// Default safe values in case of API, network error
const DEFAULT_BOOTSTRAP_DATA: AppBootstrapData = {
  version: {
    latest_version: '1.0.0',
    force_update: false,
    download_url: '',
    ios_url: '',
    android_url: '',
  },
  features: {
    enable_new_year_theme: false,
    show_home_banner: false,
  },
  ui: {
    theme_color: '#system',
  },
  announcement: {
    enabled: false,
    content: '',
  },
};

/**
 * Fetches aggregated configuration for the app startup.
 * Calls the backend /api/app/config endpoint.
 */
export const getBootstrapData = async (): Promise<AppBootstrapData> => {
  try {
    const { data } = await client.get('/app/config');
    console.log('📱 Bootstrap config loaded:', data);
    
    // Ensure data shape is correct by merging with defaults
    return {
        ...DEFAULT_BOOTSTRAP_DATA,
        ...data,
        version: { ...DEFAULT_BOOTSTRAP_DATA.version, ...(data.version || {}) },
        features: { ...DEFAULT_BOOTSTRAP_DATA.features, ...(data.features || {}) },
        ui: { ...DEFAULT_BOOTSTRAP_DATA.ui, ...(data.ui || {}) },
        announcement: { ...DEFAULT_BOOTSTRAP_DATA.announcement, ...(data.announcement || {}) },
    };
  } catch (error) {
    console.error('Failed to fetch bootstrap data:', error);
    // Return safe defaults in case of error (offline, server down)
    return DEFAULT_BOOTSTRAP_DATA;
  }
};
