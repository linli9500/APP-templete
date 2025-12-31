/**
 * Snapchat 分享服务
 * 使用 URL Scheme 方式打开 Snapchat
 *
 * 简化版实现: 仅打开 Snapchat APP
 * 用户需要手动从相册选择已保存的图片
 *
 * 完整功能需要集成 Snap Kit，后续可升级
 */

import * as Linking from 'expo-linking';

import type { ShareResult } from './types';

// Snapchat URL Schemes
const SNAPCHAT_APP_SCHEME = 'snapchat://';

/**
 * 检查 Snapchat 是否已安装
 */
export const isSnapchatInstalled = async (): Promise<boolean> => {
  try {
    return await Linking.canOpenURL(SNAPCHAT_APP_SCHEME);
  } catch {
    return false;
  }
};

/**
 * 分享到 Snapchat
 *
 * 简化版: 打开 Snapchat APP
 * 用户需要手动从相册选择已保存的图片
 *
 * @param _imageUri - 本地图片 URI (暂不使用)
 * @returns 分享结果
 */
export const shareToSnapchat = async (_imageUri: string): Promise<ShareResult> => {
  try {
    // 1. 检查 Snapchat 是否已安装
    const isInstalled = await isSnapchatInstalled();
    if (!isInstalled) {
      return {
        success: false,
        platform: 'snapchat',
        error: 'app_not_installed',
      };
    }

    // 2. 打开 Snapchat
    await Linking.openURL(SNAPCHAT_APP_SCHEME);
    
    return { success: true, platform: 'snapchat' };
  } catch (error) {
    console.error('Snapchat 分享失败:', error);
    return {
      success: false,
      platform: 'snapchat',
      error: error instanceof Error ? error.message : 'unknown',
    };
  }
};

/**
 * 获取 Snapchat 分享提示信息
 */
export const getSnapchatShareHint = (): string => {
  return 'share.open_app_hint'; // 翻译 key: "打开 Snapchat 后从相册选择图片"
};
