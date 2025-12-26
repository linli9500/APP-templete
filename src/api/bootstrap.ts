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
  // 广告配置
  ads: {
    enabled: boolean;
    app_open_id?: string;  // 可选的自定义开屏广告单元 ID
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
  ads: {
    enabled: false,
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
  ads: {
    enabled: false,
  },
};

/**
 * Fetches aggregated configuration for the app startup.
 * Calls the backend /api/app/config endpoint.
 */
export const getBootstrapData = async (): Promise<AppBootstrapData> => {
  try {
    const { data } = await client.get('/app/config');
    
    // 处理后台返回的扁平格式配置，例如 "ads.enabled": true -> ads: { enabled: true }
    const parseNestedConfig = (prefix: string, defaultValue: any) => {
      // 优先使用嵌套格式
      if (data[prefix] && typeof data[prefix] === 'object') {
        return { ...defaultValue, ...data[prefix] };
      }
      // 如果没有嵌套格式，尝试从扁平格式解析
      const result = { ...defaultValue };
      Object.keys(data).forEach(key => {
        if (key.startsWith(`${prefix}.`)) {
          const subKey = key.replace(`${prefix}.`, '');
          // 解析布尔值
          if (data[key] === 'true' || data[key] === true) {
            result[subKey] = true;
          } else if (data[key] === 'false' || data[key] === false) {
            result[subKey] = false;
          } else {
            result[subKey] = data[key];
          }
        }
      });
      return result;
    };
    
    return {
        ...DEFAULT_BOOTSTRAP_DATA,
        ...data,
        version: parseNestedConfig('version', DEFAULT_BOOTSTRAP_DATA.version),
        features: parseNestedConfig('features', DEFAULT_BOOTSTRAP_DATA.features),
        ui: parseNestedConfig('ui', DEFAULT_BOOTSTRAP_DATA.ui),
        announcement: parseNestedConfig('announcement', DEFAULT_BOOTSTRAP_DATA.announcement),
        ads: parseNestedConfig('ads', DEFAULT_BOOTSTRAP_DATA.ads),
    };
  } catch (error) {
    // 静默处理错误，返回默认配置
    return DEFAULT_BOOTSTRAP_DATA;
  }
};
