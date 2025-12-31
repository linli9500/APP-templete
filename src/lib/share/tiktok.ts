/**
 * TikTok 分享服务
 * 使用 URL Scheme 方式分享到 TikTok
 *
 * 注意: TikTok 的 URL Scheme 功能有限，无法直接带图片
 * 完整功能需要集成官方 SDK，但需要注册开发者账号
 *
 * 当前实现: 打开 TikTok APP，用户需从相册手动选择图片
 */

import * as Linking from 'expo-linking';

import type { ShareResult } from './types';

// TikTok URL Schemes
const TIKTOK_APP_SCHEME = 'tiktok://';
const TIKTOK_SNSSDK_SCHEME = 'snssdk1128://';

/**
 * 检查 TikTok 是否已安装
 */
export const isTikTokInstalled = async (): Promise<boolean> => {
  try {
    // 尝试多个可能的 scheme
    const canOpenMain = await Linking.canOpenURL(TIKTOK_APP_SCHEME);
    if (canOpenMain) return true;

    const canOpenSdk = await Linking.canOpenURL(TIKTOK_SNSSDK_SCHEME);
    return canOpenSdk;
  } catch {
    return false;
  }
};

/**
 * 分享到 TikTok
 *
 * 注意: 由于 TikTok URL Scheme 限制，当前只能打开 APP
 * 用户需要手动从相册选择已保存的图片
 *
 * @param _imageUri - 本地图片 URI (暂不使用，需用户手动选择)
 * @returns 分享结果
 */
export const shareToTikTok = async (_imageUri: string): Promise<ShareResult> => {
  try {
    // 1. 检查 TikTok 是否已安装
    const isInstalled = await isTikTokInstalled();
    if (!isInstalled) {
      return {
        success: false,
        platform: 'tiktok',
        error: 'app_not_installed',
      };
    }

    // 2. 尝试打开 TikTok
    // 由于 URL Scheme 限制，只能打开 APP，无法直接带图片
    const opened = await Linking.openURL(TIKTOK_APP_SCHEME);
    
    if (opened) {
      return { success: true, platform: 'tiktok' };
    }

    // 尝试备用 scheme
    await Linking.openURL(TIKTOK_SNSSDK_SCHEME);
    return { success: true, platform: 'tiktok' };
  } catch (error) {
    console.error('TikTok 分享失败:', error);
    return {
      success: false,
      platform: 'tiktok',
      error: error instanceof Error ? error.message : 'unknown',
    };
  }
};

/**
 * 获取 TikTok 分享提示信息
 * 由于无法直接带图，需要提示用户手动操作
 */
export const getTikTokShareHint = (): string => {
  return 'share.open_app_hint'; // 翻译 key: "打开 TikTok 后从相册选择图片"
};
