import React, { useRef, useState, useCallback } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

import { Text } from '@/components/ui/text';
import { Download } from '@/components/ui/icons';
import { ShareCard } from './ShareCard';
import { translate } from '@/lib';
import { showSuccessMessage, showErrorMessage } from '@/components/ui/utils';

interface SharePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  keywords: string[];
  highlight: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * 分享预览模态框
 * 全屏展示分享卡片，支持下载到相册
 */
export const SharePreviewModal = ({
  visible,
  onClose,
  title,
  keywords,
  highlight,
}: SharePreviewModalProps) => {
  const insets = useSafeAreaInsets();
  const viewShotRef = useRef<ViewShot>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) {
        showErrorMessage(translate('share.save_failed') || 'Save failed');
        setIsSaving(false);
        return;
      }

      // 保存到相册
      await MediaLibrary.saveToLibraryAsync(uri);
      showSuccessMessage(translate('share.saved') || 'Saved to Album!');
      
      // 保存成功后关闭模态框
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('保存卡片失败:', error);
      showErrorMessage(translate('share.save_failed') || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, onClose]);

  // 计算卡片缩放比例以适应屏幕
  const cardWidth = 360;
  const cardHeight = 640;
  const availableWidth = SCREEN_WIDTH - 48;
  const availableHeight = SCREEN_HEIGHT - insets.top - insets.bottom - 160;
  const scale = Math.min(availableWidth / cardWidth, availableHeight / cardHeight, 1);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* 关闭按钮 */}
        <TouchableOpacity
          style={[styles.closeButton, { top: insets.top + 16 }]}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* 卡片预览区域 */}
        <View style={[styles.cardContainer, { transform: [{ scale }] }]}>
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
        </View>

        {/* 底部按钮区域 */}
        <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 24 }]}>
          <TouchableOpacity
            style={[styles.downloadButton, isSaving && styles.downloadButtonDisabled]}
            onPress={handleSaveToAlbum}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <Download color="#FFFFFF" width={20} height={20} />
            <Text style={styles.downloadText}>
              {isSaving 
                ? (translate('share.saving') || 'Saving...') 
                : (translate('share.download') || 'Download to Album')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
