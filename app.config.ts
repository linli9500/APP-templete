/* eslint-disable max-lines-per-function */
import type { ConfigContext, ExpoConfig } from '@expo/config';
import type { AppIconBadgeConfig } from 'app-icon-badge/types';

import { ClientEnv, Env } from './env';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.APP_ENV !== 'production',
  badges: [
    {
      text: Env.APP_ENV,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  owner: Env.EXPO_ACCOUNT_OWNER,
  scheme: Env.SCHEME,
  slug: 'obytesapp',
  version: Env.VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/icon-fortune-bg.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: false,
  updates: {
    fallbackToCacheTimeout: 0,
    url: `https://u.expo.dev/${Env.EAS_PROJECT_ID}`,
  },
  runtimeVersion: Env.VERSION.toString(),
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.BUNDLE_ID,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      // 相册保存权限说明（用于分享卡片保存）
      NSPhotoLibraryAddUsageDescription: 'We need access to save your energy report card to your photo library for sharing on social media.',
    },
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST ?? './GoogleService-Info.plist',
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon-fortune-bg.png',
      backgroundColor: '#F5F5F0',
    },
    package: Env.PACKAGE,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    '@react-native-firebase/app',
    [
      'expo-splash-screen',
      {
        "backgroundColor": "#F5F5F0",
        "image": "./assets/logo.png",
        "imageWidth": 150
      },
    ],
    [
      'expo-font',
      {
        fonts: ['./assets/fonts/Inter.ttf'],
      },
    ],
    'expo-localization',
    'expo-router',
    ['app-icon-badge', appIconBadgeConfig],
    ['react-native-edge-to-edge'],
    'expo-apple-authentication',
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '15.1',
          useFrameworks: 'static',
        },
      },
    ],
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        organization: Env.SENTRY_ORG,
        project: Env.SENTRY_PROJECT,
      },
    ],
    [
      'expo-tracking-transparency',
      {
        userTrackingPermission:
          'This identifier will be used to deliver personalized ads to you.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/logo.png',
        color: '#ffffff',
      },
    ],
    // 相册保存权限（用于分享卡片保存）
    [
      'expo-media-library',
      {
        photosPermission: 'Allow $(PRODUCT_NAME) to save your energy report cards to your photo library.',
        savePhotosPermission: 'Allow $(PRODUCT_NAME) to save your energy report cards to your photo library.',
        isAccessMediaLocationEnabled: false,
      },
    ],
    // Google AdMob 广告
    [
      'react-native-google-mobile-ads',
      {
        // 使用 Google 官方测试 App ID（生产环境需替换为真实 ID）
        androidAppId: process.env.ADMOB_ANDROID_APP_ID,
        iosAppId: process.env.ADMOB_IOS_APP_ID,
      },
    ],
  ],
  extra: {
    ...ClientEnv,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
});
