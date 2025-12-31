/**
 * 短链接服务
 * 调用 Web 端 API 生成短链接，用于分享和 Deep Linking
 */

import * as Clipboard from 'expo-clipboard';

import { Env } from '@/lib/env';

import type { CreateShortLinkRequest, ShortLinkResponse } from './types';

/**
 * 生成短链接
 *
 * @param request - 创建短链接请求
 * @returns 短链接响应
 * @throws Error 如果 EXPO_PUBLIC_API_URL 未配置或 API 请求失败
 */
export const generateShortLink = async (
  request: CreateShortLinkRequest
): Promise<ShortLinkResponse> => {
  const apiUrl = Env.EXPO_PUBLIC_API_URL;
  
  // 检查 API URL 是否已配置
  if (!apiUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is not configured. Please set it in your environment variables.');
  }

  const response = await fetch(`${apiUrl}/api/share/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contentId: request.contentId,
      contentType: request.contentType,
      utmSource: request.utmSource || 'app',
      utmMedium: request.utmMedium || 'share',
      utmCampaign: request.utmCampaign,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data as ShortLinkResponse;
};

/**
 * 复制短链接到剪贴板
 *
 * @param contentId - 内容 ID
 * @param contentType - 内容类型
 * @param introText - 可选的介绍语文本（已翻译）
 * @returns 是否成功复制
 */
export const copyShareLink = async (
  contentId: string,
  contentType: 'report' | 'poster',
  introText?: string
): Promise<{ success: boolean; shortUrl?: string; error?: string }> => {
  try {
    // 生成短链接
    const linkResponse = await generateShortLink({
      contentId,
      contentType,
      utmSource: 'app',
      utmMedium: 'clipboard',
    });

    // 构建复制内容：介绍语 + 链接
    const copyContent = introText 
      ? `${introText}\n${linkResponse.shortUrl}` 
      : linkResponse.shortUrl;

    // 复制到剪贴板
    await Clipboard.setStringAsync(copyContent);

    return {
      success: true,
      shortUrl: linkResponse.shortUrl,
    };
  } catch (error) {
    console.error('复制链接失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'unknown',
    };
  }
};

/**
 * 构建分享文案（带链接）
 *
 * @param title - 标题
 * @param shortUrl - 短链接
 * @returns 分享文案
 */
export const buildShareText = (title: string, shortUrl: string): string => {
  return `${title}\n\n${shortUrl}`;
};
