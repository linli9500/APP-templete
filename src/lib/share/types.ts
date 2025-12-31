/**
 * 分享模块类型定义
 */

// 支持的分享平台
export type SharePlatform =
  | 'instagram'
  | 'tiktok'
  | 'snapchat'
  | 'system'
  | 'clipboard';

// 分享内容类型
export interface ShareContent {
  /** 本地图片 URI (file://) */
  imageUri: string;
  /** 标题（用于口令/链接描述） */
  title?: string;
  /** 内容 ID（用于 Deep Link） */
  contentId?: string;
  /** 内容类型 */
  contentType: 'report' | 'poster';
}

// 分享结果
export interface ShareResult {
  /** 是否成功 */
  success: boolean;
  /** 分享平台 */
  platform: SharePlatform;
  /** 错误信息 */
  error?: ShareError;
}

// 分享错误类型
export type ShareError =
  | 'app_not_installed'
  | 'permission_denied'
  | 'cancelled'
  | 'unknown'
  | string;

// 短链接响应
export interface ShortLinkResponse {
  /** 短链接 URL */
  shortUrl: string;
  /** 完整 URL */
  fullUrl: string;
  /** 过期时间 */
  expiresAt?: string;
}

// 短链接创建请求
export interface CreateShortLinkRequest {
  /** 内容 ID */
  contentId: string;
  /** 内容类型 */
  contentType: 'report' | 'poster';
  /** UTM 来源 */
  utmSource?: string;
  /** UTM 媒介 */
  utmMedium?: string;
  /** UTM 活动 */
  utmCampaign?: string;
}

// 平台可用性状态
export interface PlatformAvailability {
  instagram: boolean;
  tiktok: boolean;
  snapchat: boolean;
  system: boolean;
}
