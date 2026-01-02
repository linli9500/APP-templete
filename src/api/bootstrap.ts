import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { getLocales } from 'expo-localization';
import { client } from './common/client';
import { getLanguage } from '@/lib/i18n/utils';
import { storage } from '@/lib/storage';
import * as Crypto from 'expo-crypto';

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

// 设备信息类型
export type DeviceInfo = {
  platform: string;
  locale: string;
  timezone: string;
  regionCode: string | null;
  deviceLocale: string | null;
  appVersion: string | null;
  buildNumber: string | null;
  osVersion: string | null;
  deviceBrand: string | null;
  deviceModel: string | null;
  isDevice: boolean;
  pushToken?: string;
  deviceId: string;
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
 * 收集设备信息
 * 这些都是非隐私数据，可安全收集用于全球化和产品优化
 */
export const collectDeviceInfo = (): DeviceInfo => {
  const locales = getLocales();
  const firstLocale = locales[0];
  
  // 获取用户设置的语言（App内切换的）
  const userLocale = getLanguage() || 'en';
  
  // 获取设备时区
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // 获取 App 版本
  const appVersion = Constants.expoConfig?.version || null;
  
  // 获取构建号
  // 获取构建号
  const buildNumber = Platform.OS === 'ios' 
    ? Constants.expoConfig?.ios?.buildNumber 
    : Constants.expoConfig?.android?.versionCode?.toString() || null;

  // 获取或生成持久化 Device ID
  let deviceId = storage.getString('device_id');
  if (!deviceId) {
    deviceId = Crypto.randomUUID();
    storage.set('device_id', deviceId);
  }

  return {
    platform: Platform.OS,
    locale: userLocale,
    timezone: timezone,
    regionCode: firstLocale?.regionCode || null,
    deviceLocale: firstLocale?.languageCode || null,
    appVersion: appVersion,
    buildNumber: buildNumber || null,
    osVersion: Device.osVersion || null,
    deviceBrand: Device.brand || null,
    deviceModel: Device.modelName || null,
    isDevice: Device.isDevice,
    deviceId,
  };
};

/**
 * 获取应用启动配置（合并接口）
 * 
 * 上行：发送设备信息到服务器
 * 下行：接收配置信息
 */
export const getBootstrapData = async (pushToken?: string): Promise<AppBootstrapData> => {
  try {
    // 收集设备信息
    const deviceInfo = collectDeviceInfo();
    
    // 打印上行设备信息
    console.log('[Bootstrap] 上行设备信息:', JSON.stringify({
      deviceId: deviceInfo.deviceId,
      platform: deviceInfo.platform,
      locale: deviceInfo.locale,
      timezone: deviceInfo.timezone,
      regionCode: deviceInfo.regionCode,
      appVersion: deviceInfo.appVersion,
    }));
    
    // 发送 POST 请求，上报设备信息并获取配置
    const { data } = await client.post('/app/bootstrap', {
      ...deviceInfo,
      pushToken, // 可选，推送 Token 在授权后单独传递
    });
    
    // 打印完整的后端响应数据
    console.log('[Bootstrap] 完整响应数据:', JSON.stringify(data, null, 2));
    
    // 处理后台返回的扁平格式配置
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
    
    const config = {
      ...DEFAULT_BOOTSTRAP_DATA,
      ...data,
      version: parseNestedConfig('version', DEFAULT_BOOTSTRAP_DATA.version),
      features: parseNestedConfig('features', DEFAULT_BOOTSTRAP_DATA.features),
      ui: parseNestedConfig('ui', DEFAULT_BOOTSTRAP_DATA.ui),
      announcement: parseNestedConfig('announcement', DEFAULT_BOOTSTRAP_DATA.announcement),
      ads: parseNestedConfig('ads', DEFAULT_BOOTSTRAP_DATA.ads),
    };
    
    // 打印下行配置信息
    console.log('[Bootstrap] 下行配置:', JSON.stringify({
      version: config.version.latest_version,
      forceUpdate: config.version.force_update,
      features: config.features,
      announcement: config.announcement.enabled,
      ads: config.ads.enabled,
    }));
    
    return config;
  } catch (error) {
    // 静默处理错误，返回默认配置
    console.warn('[Bootstrap] Failed to fetch config, using defaults:', error);
    return DEFAULT_BOOTSTRAP_DATA;
  }
};
