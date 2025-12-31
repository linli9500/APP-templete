/**
 * 分享平台选择器组件
 * 显示 Instagram / TikTok / Snapchat / 更多 / 复制链接 按钮
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { Text } from '@/components/ui/text';
import { Instagram, TikTok, Snapchat, Share } from '@/components/ui/icons';
import { Copy } from '@/components/ui/icons';
import { translate } from '@/lib';
import { showSuccessMessage, showErrorMessage } from '@/components/ui/utils';
import {
  shareToInstagramStory,
  shareToTikTok,
  shareToSnapchat,
  shareViaSystem,
  copyShareLink,
  checkPlatformAvailability,
  type ShareResult,
  type PlatformAvailability,
} from '@/lib/share';

interface SharePlatformSelectorProps {
  /** 本地图片 URI */
  imageUri: string;
  /** 内容 ID（用于生成短链接） */
  contentId?: string;
  /** 内容类型 */
  contentType?: 'report' | 'poster';
  /** 分享完成回调 */
  onShareComplete?: (result: ShareResult) => void;
  /** 自定义样式 */
  style?: object;
}

/**
 * 分享平台选择器
 */
export const SharePlatformSelector = ({
  imageUri,
  contentId,
  contentType = 'report',
  onShareComplete,
  style,
}: SharePlatformSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [platformAvailability, setPlatformAvailability] = useState<PlatformAvailability>({
    instagram: true,
    tiktok: true,
    snapchat: true,
    system: true,
  });

  // 检查平台可用性
  useEffect(() => {
    checkPlatformAvailability().then(setPlatformAvailability);
  }, []);

  // 处理 Instagram 分享
  const handleInstagramShare = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await shareToInstagramStory(imageUri);
      
      if (!result.success && result.error === 'app_not_installed') {
        Alert.alert(
          translate('share.app_not_installed', { app: 'Instagram' }) || 'Instagram is not installed',
          translate('share.install_app_hint') || 'Please install Instagram to share.'
        );
      }

      onShareComplete?.(result);
    } finally {
      setIsLoading(false);
    }
  }, [imageUri, isLoading, onShareComplete]);

  // 处理 TikTok 分享
  const handleTikTokShare = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await shareToTikTok(imageUri);
      
      if (!result.success && result.error === 'app_not_installed') {
        Alert.alert(
          translate('share.app_not_installed', { app: 'TikTok' }) || 'TikTok is not installed',
          translate('share.install_app_hint') || 'Please install TikTok to share.'
        );
      } else if (result.success) {
        // 由于 TikTok 无法直接带图，提示用户
        showSuccessMessage(
          translate('share.open_app_hint', { app: 'TikTok' }) || 'TikTok opened. Select from camera roll.'
        );
      }

      onShareComplete?.(result);
    } finally {
      setIsLoading(false);
    }
  }, [imageUri, isLoading, onShareComplete]);

  // 处理 Snapchat 分享
  const handleSnapchatShare = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await shareToSnapchat(imageUri);
      
      if (!result.success && result.error === 'app_not_installed') {
        Alert.alert(
          translate('share.app_not_installed', { app: 'Snapchat' }) || 'Snapchat is not installed',
          translate('share.install_app_hint') || 'Please install Snapchat to share.'
        );
      } else if (result.success) {
        showSuccessMessage(
          translate('share.open_app_hint', { app: 'Snapchat' }) || 'Snapchat opened. Select from camera roll.'
        );
      }

      onShareComplete?.(result);
    } finally {
      setIsLoading(false);
    }
  }, [imageUri, isLoading, onShareComplete]);

  // 处理系统分享
  const handleSystemShare = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await shareViaSystem(imageUri, {
        dialogTitle: translate('share.share_to') || 'Share to',
      });
      onShareComplete?.(result);
    } finally {
      setIsLoading(false);
    }
  }, [imageUri, isLoading, onShareComplete]);

  // 处理复制链接
  const handleCopyLink = useCallback(async () => {
    if (isLoading || !contentId) return;
    setIsLoading(true);

    try {
      // 获取国际化的介绍语
      const introText = translate('share.share_intro') || "I'm using Fortune to explore my personality DNA, it's fascinating! Come check it out.";
      const result = await copyShareLink(contentId, contentType, introText);
      
      if (result.success) {
        showSuccessMessage(translate('share.link_copied') || 'Link copied!');
      } else {
        showErrorMessage(translate('share.copy_failed') || 'Failed to copy link');
      }
    } finally {
      setIsLoading(false);
    }
  }, [contentId, contentType, isLoading]);

  return (
    <View style={[styles.container, style]}>
      {/* 平台按钮行 - 5个图标 */}
      <View style={styles.platformRow}>
        {/* Instagram */}
        <TouchableOpacity
          style={[styles.platformButton, !platformAvailability.instagram && styles.platformButtonDisabled]}
          onPress={handleInstagramShare}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Instagram width={26} height={26} />
          </View>
          <Text style={styles.platformLabel}>Instagram</Text>
        </TouchableOpacity>

        {/* TikTok */}
        <TouchableOpacity
          style={[styles.platformButton, !platformAvailability.tiktok && styles.platformButtonDisabled]}
          onPress={handleTikTokShare}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <TikTok width={26} height={26} color="#000000" />
          </View>
          <Text style={styles.platformLabel}>TikTok</Text>
        </TouchableOpacity>

        {/* Snapchat */}
        <TouchableOpacity
          style={[styles.platformButton, !platformAvailability.snapchat && styles.platformButtonDisabled]}
          onPress={handleSnapchatShare}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Snapchat width={26} height={26} />
          </View>
          <Text style={styles.platformLabel}>Snapchat</Text>
        </TouchableOpacity>

        {/* 更多 */}
        <TouchableOpacity
          style={styles.platformButton}
          onPress={handleSystemShare}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Share width={22} height={22} color="#666666" />
          </View>
          <Text style={styles.platformLabel}>
            {translate('share.more_options') || 'More'}
          </Text>
        </TouchableOpacity>

        {/* 复制链接 - 作为第5个图标 */}
        {contentId && (
          <TouchableOpacity
            style={styles.platformButton}
            onPress={handleCopyLink}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Copy width={22} height={22} color="#666666" />
            </View>
            <Text style={styles.platformLabel}>
              {translate('share.copy_link_short') || 'Copy'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  platformRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  platformButton: {
    alignItems: 'center',
    minWidth: 60,
  },
  platformButtonDisabled: {
    opacity: 0.4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  platformLabel: {
    fontSize: 11,
    color: '#333333',
    fontWeight: '500',
  },
});

export default SharePlatformSelector;
