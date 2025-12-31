import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

import { Text } from '@/components/ui/text';
import { Share, Copy } from '@/components/ui/icons';
import Markdown from 'react-native-markdown-display';
import { translate } from '@/lib';
import { useRouter } from 'expo-router';
import { ArrowRight } from '@/components/ui/icons/arrow-right';
import { SharePreviewModal } from './SharePreviewModal';
import { extractReportSummary } from '@/lib/markdown-parser';
import { showSuccessMessage } from '@/components/ui/utils';

interface StreamReportProps {
  content: string;
  isEffectActive: boolean;
  /** 报告 ID，用于分享短链接 */
  reportId?: string | null;
}

// 分享引导组件 (静态版本，避免动画影响 Modal)
const ShareHint = ({ isDark }: { isDark: boolean }) => {
  return (
    <View style={styles.shareHintContainer} pointerEvents="none">
      <Text style={[styles.shareHintText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
        {translate('share.try_share') || 'Try sharing'}
      </Text>
      <Text style={[styles.shareHintArrow, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
        ↑
      </Text>
    </View>
  );
};

// 操作按钮组组件
interface ActionButtonsProps {
  onCopy: () => void;
  onShare: () => void;
  isDark: boolean;
  showHint?: boolean;
}

const ActionButtons = ({ onCopy, onShare, isDark, showHint = false }: ActionButtonsProps) => (
  <View className="items-end">
    <View className="flex-row items-center justify-end gap-4 py-2">
      <TouchableOpacity
        onPress={onCopy}
        className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 justify-center items-center"
        activeOpacity={0.7}
        accessibilityLabel={translate('share.copy')}
      >
        <Copy color={isDark ? '#FFFFFF' : '#000000'} width={18} height={18} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onShare}
        className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 justify-center items-center"
        activeOpacity={0.7}
        accessibilityLabel={translate('share.share')}
      >
        <Share color={isDark ? '#FFFFFF' : '#000000'} width={18} height={18} />
      </TouchableOpacity>
    </View>
    {showHint && <ShareHint isDark={isDark} />}
  </View>
);

export const StreamReport = ({ content, isEffectActive, reportId }: StreamReportProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const spin = useSharedValue(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // 分享模态框状态
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  useEffect(() => {
    if (isEffectActive) {
      spin.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      spin.value = 0;
    }
  }, [isEffectActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${spin.value}deg` }],
      opacity: isEffectActive ? 1 : 0,
    };
  }, [isEffectActive]);

  const markdownStyles = useMemo(() => ({
    body: {
      color: isDark ? 'white' : 'black',
      fontSize: 16,
      lineHeight: 28,
    },
    heading1: {
        fontSize: 28,
        marginBottom: 16,
        color: isDark ? 'white' : 'black',
        fontWeight: 'bold',
    },
    heading2: {
        fontSize: 22,
        marginBottom: 12,
        marginTop: 24,
        color: isDark ? 'white' : 'black', 
        fontWeight: '600',
    },
    paragraph: {
        marginBottom: 16,
    },
    // 其他元素样式在需要时添加
  }), [isDark]);

  // 从报告中提取摘要信息（用于分享卡片）
  const reportSummary = useMemo(() => {
    return extractReportSummary(content);
  }, [content]);

  // 复制报告内容到剪贴板
  const handleCopy = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(content);
      showSuccessMessage(translate('share.copied'));
    } catch (error) {
      console.error('复制失败:', error);
    }
  }, [content]);

  // 打开分享模态框
  const handleShare = useCallback(() => {
    setIsShareModalVisible(true);
  }, []);

  // 关闭分享模态框
  const handleCloseShareModal = useCallback(() => {
    setIsShareModalVisible(false);
  }, []);

  // 是否显示操作按钮（仅在生成完成后显示）
  const showActions = !isEffectActive && content.length > 0;

  return (
  <>
    <View className="flex-1 bg-pattern-bg dark:bg-black">
        <ScrollView 
            className="flex-1 px-6" 
            contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            {/* 头部区域 - 在ScrollView内部，可滚动 */}
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <View 
                        className="w-8 h-8 rounded-full bg-black dark:bg-neutral-800 justify-center items-center" 
                        style={{ transform: [{ rotate: '180deg' }] }}
                    >
                        <ArrowRight color="white" width={16} height={16} />
                    </View>
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-black dark:text-white flex-1 text-center pr-8">
                    {translate('analysis.report_title')}
                </Text>
            </View>

            {/* 操作按钮区域 1 - 标题下方、正文上方 */}
            {showActions && (
              <ActionButtons 
                onCopy={handleCopy} 
                onShare={handleShare} 
                isDark={isDark}
                showHint={true}
              />
            )}

            {/* 分隔线 */}
            {showActions && (
              <View className="h-px bg-neutral-200 dark:bg-neutral-800 mb-4" />
            )}

            {/* 报告内容 */}
            <Markdown style={markdownStyles}>
                {content}
            </Markdown>

            {/* 加载中指示器 */}
            {isEffectActive && (
                <View className="flex-row items-center mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <View className="w-2.5 h-4.5 bg-black dark:bg-white mr-2" /> 
                    <Animated.View style={[styles.spinner, animatedStyle]}>
                    <View className="w-0.5 h-3 bg-black dark:bg-white" />
                    </Animated.View>
                    <Text className="text-neutral-500 dark:text-neutral-400 text-base ml-2">
                    {translate('analysis.decoding_in_progress')}
                    </Text>
                </View>
            )}

            {/* 操作按钮区域 2 - 报告底部 */}
            {showActions && (
              <View className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <ActionButtons 
                  onCopy={handleCopy} 
                  onShare={handleShare} 
                  isDark={isDark}
                  showHint={true}
                />
              </View>
            )}
        </ScrollView>

        {/* 当分享模态框打开时，显示底部遮罩层，覆盖透明导航栏区域 */}
        {isShareModalVisible && (
          <View 
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: insets.bottom + 60, // 覆盖导航栏区域及额外空间
              backgroundColor: isDark ? '#000000' : '#F5F5F0', // 和报告背景色一致
            }}
            pointerEvents="none"
          />
        )}
    </View>

    {/* 分享预览模态框 - 放在根 View 外面确保正常渲染 */}
    <SharePreviewModal
      visible={isShareModalVisible}
      onClose={handleCloseShareModal}
      title={reportSummary.title}
      keywords={reportSummary.keywords}
      highlight={reportSummary.highlight}
      contentId={reportId || undefined}
      contentType="report"
    />
  </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  spinner: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingRight: 4,
    marginTop: 4,
  },
  shareHintText: {
    fontSize: 12,
    fontWeight: '500',
  },
  shareHintArrow: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
