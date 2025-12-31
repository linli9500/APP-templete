import React, { useRef, useState, useCallback } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

import { Text } from '@/components/ui/text';
import { Download } from '@/components/ui/icons';
import { ShareCard } from './ShareCard';
import { SharePlatformSelector } from '@/components/share';
import { translate } from '@/lib';
import { showSuccessMessage, showErrorMessage } from '@/components/ui/utils';

interface SharePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  keywords: string[];
  highlight: string;
  /** 内容 ID（用于生成短链接） */
  contentId?: string;
  /** 内容类型 */
  contentType?: 'report' | 'poster';
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

/**
 * 分享预览模态框
 * 全屏展示分享卡片，支持下载到相册和社交平台分享
 */
export const SharePreviewModal = ({
  visible,
  onClose,
  title,
  keywords,
  highlight,
  contentId,
  contentType = 'report',
}: SharePreviewModalProps) => {
  const insets = useSafeAreaInsets();
  const viewShotRef = useRef<ViewShot>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);

  // 捕获卡片为图片
  const captureCard = useCallback(async (): Promise<string | null> => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        setCapturedImageUri(uri);
        return uri;
      }
      return null;
    } catch (error) {
      console.error('捕获卡片失败:', error);
      return null;
    }
  }, []);

  // 保存卡片到相册
  const handleSaveToAlbum = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      // 请求相册权限
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          translate('share.permission_required') || 'Permission Required',
          translate('share.album_permission_message') || 'Please grant album access to save the image.'
        );
        setIsSaving(false);
        return;
      }

      // 捕获卡片为图片
      const uri = await captureCard();
      if (!uri) {
        showErrorMessage(translate('share.save_failed') || 'Save failed');
        setIsSaving(false);
        return;
      }

      // 保存到相册
      await MediaLibrary.saveToLibraryAsync(uri);
      showSuccessMessage(translate('share.saved') || 'Saved to Album!');
    } catch (error) {
      console.error('保存卡片失败:', error);
      showErrorMessage(translate('share.save_failed') || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, captureCard]);

  // 准备分享（先保存到相册，获取图片 URI）
  const prepareForShare = useCallback(async (): Promise<string | null> => {
    // 先保存到相册
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        translate('share.permission_required') || 'Permission Required',
        translate('share.album_permission_message') || 'Please grant album access to share.'
      );
      return null;
    }

    // 捕获卡片
    const uri = await captureCard();
    if (uri) {
      // 保存到相册（这样用户可以从相册选择）
      await MediaLibrary.saveToLibraryAsync(uri);
      showSuccessMessage(translate('share.saved') || 'Saved! Now share to your favorite platform.');
    }
    return uri;
  }, [captureCard]);

  // 获取用于分享的图片 URI
  const getShareImageUri = useCallback(async (): Promise<string> => {
    if (capturedImageUri) {
      return capturedImageUri;
    }
    const uri = await prepareForShare();
    return uri || '';
  }, [capturedImageUri, prepareForShare]);

  // 计算卡片与底部区域的总高度，用于缩放计算
  const cardWidth = 360;
  const cardHeight = 640;
  const footerHeight = 160; 
  const overlapHeight = 30; // 重叠高度，略大于圆角(24)以确保完全覆盖
  // 视觉总高度 = 卡片 + 底部 - 重叠部分
  const totalHeight = cardHeight + footerHeight - overlapHeight;
  
  const availableWidth = SCREEN_WIDTH - 48;
  const availableHeight = SCREEN_HEIGHT - insets.top - insets.bottom - 48;
  
  const scale = Math.min(
    availableWidth / cardWidth, 
    availableHeight / totalHeight,
    1
  );

  // 计算缩放造成的垂直空白，用于向上偏移以实现顶对齐
  const verticalOffset = (totalHeight * (1 - scale)) / 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      // @ts-ignore
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 视觉容器 */}
          <View style={[
            styles.visualContainer, 
            { 
              transform: [{ scale }],
              marginTop: -verticalOffset // 抵消缩放产生的顶部空白
            }
          ]}>
            
            {/* 1. 卡片区域 (在底层) */}
            <View style={styles.cardWrapper}>
              <ViewShot
                ref={viewShotRef}
                options={{ format: 'png', quality: 1 }}
              >
                <ShareCard
                  title={title}
                  keywords={keywords}
                  highlight={highlight}
                />
              </ViewShot>

              {/* 卡片内嵌关闭按钮 (ViewShot 之外) */}
              <TouchableOpacity
                style={styles.cardCloseButton}
                onPress={onClose}
                activeOpacity={0.6}
              >
                <Text style={styles.cardCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 2. 底部操作区域 (覆盖在卡片底部之上) */}
            <View style={styles.footerContainer}>
              
              <SharePlatformSelector
                imageUri={capturedImageUri || ''}
                contentId={contentId}
                contentType={contentType}
                onShareComplete={async (result) => {
                  if (!capturedImageUri) {
                    await prepareForShare();
                  }
                  console.log('分享结果:', result);
                }}
                style={styles.platformSelector}
              />

               <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={handleSaveToAlbum}
                disabled={isSaving}
                activeOpacity={0.8}
              >
                <Download color="#FFFFFF" width={18} height={18} />
                <Text style={styles.saveButtonText}>
                  {isSaving 
                    ? (translate('share.saving') || 'Saving...') 
                    : (translate('share.download') || 'Save Image')
                  }
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start', // 靠上对齐
    minHeight: '100%',
  },
  visualContainer: {
    width: 360, 
    alignItems: 'center',
  },
  cardWrapper: {
    width: 360,
    height: 640,
    zIndex: 1, 
    position: 'relative', // 用于定位关闭按钮
  },
  cardCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cardCloseText: {
    color: '#000000', 
    fontSize: 24,
    fontWeight: '300',
    opacity: 0.6,
  },
  footerContainer: {
    width: 360,
    backgroundColor: '#F5F5F0', 
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 12, // 微调顶部连接处
    borderTopRightRadius: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
    marginTop: -30, // 向上重叠，覆盖卡片底部圆角
    zIndex: 2, // 位于上层
  },
  shareTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    opacity: 0.8,
  },
  platformSelector: {
    marginBottom: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 25,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
