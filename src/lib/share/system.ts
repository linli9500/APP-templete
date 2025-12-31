/**
 * 系统原生分享服务
 * 使用 expo-sharing 调用系统分享菜单
 * 作为其他平台不可用时的兜底方案
 */

import * as Sharing from 'expo-sharing';

import type { ShareResult } from './types';

/**
 * 检查系统分享是否可用
 */
export const isSystemShareAvailable = async (): Promise<boolean> => {
  try {
    return await Sharing.isAvailableAsync();
  } catch {
    return false;
  }
};

/**
 * 使用系统分享菜单分享图片
 *
 * @param imageUri - 本地图片 URI (file://)
 * @param options - 分享选项
 * @returns 分享结果
 */
export const shareViaSystem = async (
  imageUri: string,
  options?: {
    dialogTitle?: string;
    mimeType?: string;
  }
): Promise<ShareResult> => {
  try {
    // 1. 检查系统分享是否可用
    const available = await isSystemShareAvailable();
    if (!available) {
      return {
        success: false,
        platform: 'system',
        error: 'Sharing not available on this device',
      };
    }

    // 2. 调用系统分享
    await Sharing.shareAsync(imageUri, {
      mimeType: options?.mimeType || 'image/png',
      dialogTitle: options?.dialogTitle || 'Share',
    });

    return { success: true, platform: 'system' };
  } catch (error) {
    console.error('系统分享失败:', error);

    // 判断是否是用户取消
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes('cancel')
    ) {
      return {
        success: false,
        platform: 'system',
        error: 'cancelled',
      };
    }

    return {
      success: false,
      platform: 'system',
      error: error instanceof Error ? error.message : 'unknown',
    };
  }
};
