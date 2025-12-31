/**
 * 分享模块入口
 * 导出所有分享服务和类型
 */

// 类型导出
export type {
  SharePlatform,
  ShareContent,
  ShareResult,
  ShareError,
  ShortLinkResponse,
  CreateShortLinkRequest,
  PlatformAvailability,
} from './types';

// Instagram 分享
export {
  isInstagramInstalled,
  shareToInstagramStory,
} from './instagram';

// TikTok 分享
export {
  isTikTokInstalled,
  shareToTikTok,
  getTikTokShareHint,
} from './tiktok';

// Snapchat 分享
export {
  isSnapchatInstalled,
  shareToSnapchat,
  getSnapchatShareHint,
} from './snapchat';

// 系统分享
export {
  isSystemShareAvailable,
  shareViaSystem,
} from './system';

// 短链接服务
export {
  generateShortLink,
  copyShareLink,
  buildShareText,
} from './short-link';

// 统一分享接口
import { isInstagramInstalled } from './instagram';
import { isTikTokInstalled } from './tiktok';
import { isSnapchatInstalled } from './snapchat';
import { isSystemShareAvailable } from './system';
import type { PlatformAvailability } from './types';

/**
 * 检查所有平台的可用性
 */
export const checkPlatformAvailability = async (): Promise<PlatformAvailability> => {
  const [instagram, tiktok, snapchat, system] = await Promise.all([
    isInstagramInstalled(),
    isTikTokInstalled(),
    isSnapchatInstalled(),
    isSystemShareAvailable(),
  ]);

  return {
    instagram,
    tiktok,
    snapchat,
    system,
  };
};
