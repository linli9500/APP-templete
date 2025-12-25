import React, { useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import Markdown from 'react-native-markdown-display';
import { translate } from '@/lib';
import { useRouter } from 'expo-router';
import { ArrowRight } from '@/components/ui/icons/arrow-right';

interface StreamReportProps {
  content: string;
  isEffectActive: boolean;
}

export const StreamReport = ({ content, isEffectActive }: StreamReportProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const spin = useSharedValue(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

  return (
    <View className="flex-1 bg-pattern-bg dark:bg-black">
        <ScrollView 
            className="flex-1 px-6" 
            contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            {/* 头部区域 - 在ScrollView内部，可滚动 */}
            <View className="flex-row items-center justify-between mb-6">
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
        </ScrollView>
    </View>
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
});
