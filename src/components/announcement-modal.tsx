import React, { useState, useEffect, useMemo } from 'react';
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { MMKV } from 'react-native-mmkv';
import { Text } from '@/components/ui/text';
import { useAppConfig } from '@/lib/use-app-config';
import { translate } from '@/lib';

// 用于存储已忽略的公告
const storage = new MMKV({ id: 'announcement-storage' });
const DISMISSED_ANNOUNCEMENT_KEY = 'dismissed_announcement_hash';

/**
 * 生成简单的内容哈希值
 * 用于判断公告内容是否发生变化
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

/**
 * 解析公告内容
 * 格式: "title:标题内容; description:正文内容"
 * 支持空格和换行
 */
function parseAnnouncementContent(content: string): { title: string; description: string } {
  const result = { title: '', description: '' };
  
  if (!content) return result;
  
  // 使用正则匹配 title: 和 description:
  const titleMatch = content.match(/title:\s*([^;]*)/i);
  const descMatch = content.match(/description:\s*(.*)/is);
  
  if (titleMatch && titleMatch[1]) {
    result.title = titleMatch[1].trim();
  }
  
  if (descMatch && descMatch[1]) {
    result.description = descMatch[1].trim();
  }
  
  return result;
}

interface AnnouncementModalProps {
  // 可选：外部控制是否显示
  forceShow?: boolean;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ forceShow }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { announcement, isLoading } = useAppConfig();
  const [visible, setVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // 计算当前公告内容的哈希值
  const contentHash = useMemo(() => {
    return simpleHash(announcement.content || '');
  }, [announcement.content]);

  // 当配置加载完成且公告启用时显示
  useEffect(() => {
    if (!isLoading && announcement.enabled && !hasShown) {
      // 检查是否已经忽略过这个公告
      const dismissedHash = storage.getString(DISMISSED_ANNOUNCEMENT_KEY);
      
      if (dismissedHash === contentHash) {
        // 内容相同，用户已选择不再提示，不显示
        console.log('[Announcement] 用户已选择不再提示此公告');
        return;
      }
      
      setVisible(true);
      setHasShown(true);
    }
  }, [isLoading, announcement.enabled, hasShown, contentHash]);

  // 如果外部强制显示
  useEffect(() => {
    if (forceShow !== undefined) {
      setVisible(forceShow);
    }
  }, [forceShow]);

  // 关闭弹窗（仅本次）
  const handleClose = () => {
    setVisible(false);
  };

  // 不再提示（持久化存储）
  const handleDismissForever = () => {
    storage.set(DISMISSED_ANNOUNCEMENT_KEY, contentHash);
    console.log('[Announcement] 已保存不再提示，hash:', contentHash);
    setVisible(false);
  };

  // 解析内容
  const { title, description } = parseAnnouncementContent(announcement.content);

  // 如果没有内容，不显示
  if (!title && !description) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View 
          className="w-full max-w-sm bg-[#F5F5F0] dark:bg-neutral-900 rounded-3xl p-6 shadow-xl"
          style={{ maxHeight: '70%' }}
        >
          {/* 标题 */}
          {title ? (
            <Text className="text-2xl font-bold text-black dark:text-white text-center mb-4">
              {title}
            </Text>
          ) : null}
          
          {/* 内容 */}
          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 300 }}
          >
            {description ? (
              <Text className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {description}
              </Text>
            ) : null}
          </ScrollView>

          {/* 按钮区域 */}
          <View className="mt-6 flex-col items-center space-y-3">
            {/* 确定按钮 */}
            <TouchableOpacity
              onPress={handleClose}
              className="bg-black dark:bg-white py-3 px-8 rounded-full"
              activeOpacity={0.8}
            >
              <Text className="text-white dark:text-black font-bold text-base">
                {translate('common.confirm') || '我知道了'}
              </Text>
            </TouchableOpacity>

            {/* 不再提示按钮 */}
            <TouchableOpacity
              onPress={handleDismissForever}
              className="py-2"
              activeOpacity={0.6}
            >
              <Text className="text-neutral-500 dark:text-neutral-400 text-sm">
                {translate('common.dont_show_again') || '不再提示'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
