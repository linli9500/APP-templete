import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import * as ScreenCapture from 'expo-screen-capture';

import { Text, FocusAwareStatusBar } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';
import { translate } from '@/lib';

export default function ScreenshotTestPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [detected, setDetected] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('checking');

  // 请求权限并设置监听器
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    const setupListener = async () => {
      // Android 13 及以下需要请求权限
      if (Platform.OS === 'android') {
        try {
          const { status } = await ScreenCapture.requestPermissionsAsync();
          console.log('[Screenshot] 权限状态:', status);
          setPermissionStatus(status);
          
          if (status !== 'granted') {
            console.log('[Screenshot] 权限未授予');
            return;
          }
        } catch (error) {
          console.log('[Screenshot] 权限请求失败:', error);
          setPermissionStatus('error');
          return;
        }
      } else {
        // iOS 不需要权限
        setPermissionStatus('granted');
      }

      // 设置截图监听器
      subscription = ScreenCapture.addScreenshotListener(() => {
        console.log('[Screenshot] 检测到截图!');
        setDetected(true);
        
        // 3秒后恢复
        setTimeout(() => {
          setDetected(false);
        }, 3000);
      });
    };

    setupListener();

    // 清理订阅
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900 px-6" style={{ paddingTop: insets.top }}>
        <FocusAwareStatusBar />
        
        {/* 自定义头部 */}
        <View className="flex-row items-center justify-between mt-6 mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <View 
              className="w-8 h-8 rounded-full bg-black dark:bg-neutral-800 justify-center items-center" 
              style={{ transform: [{ rotate: '180deg' }] }}
            >
              <ArrowRight color="white" width={16} height={16} />
            </View>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black dark:text-white flex-1 text-center pr-8">
            {translate('settings.screenshot_test')}
          </Text>
        </View>

        {/* 内容区域 */}
        <View className="flex-1 items-center justify-center">
          {/* 权限状态提示 */}
          <View className="mb-4 px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800">
            <Text className="text-sm text-neutral-600 dark:text-neutral-400">
              权限状态: {permissionStatus === 'granted' ? '✅ 已授权' : 
                        permissionStatus === 'denied' ? '❌ 已拒绝' :
                        permissionStatus === 'checking' ? '⏳ 检查中...' : 
                        `⚠️ ${permissionStatus}`}
            </Text>
          </View>

          <Text className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 text-center px-4">
            {translate('settings.screenshot_test_hint')}
          </Text>

          {/* 状态指示按钮 */}
          <View 
            className={`w-32 h-32 rounded-full items-center justify-center ${
              detected 
                ? 'bg-blue-500' 
                : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <Text className={`text-lg font-bold ${detected ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
              {detected 
                ? translate('settings.screenshot_detected') || '已检测'
                : translate('settings.screenshot_waiting') || '等待中'
              }
            </Text>
          </View>

          {detected && (
            <Text className="text-green-600 dark:text-green-400 mt-6 text-base font-medium">
              ✓ {translate('settings.screenshot_success') || '截图检测成功!'}
            </Text>
          )}

          {permissionStatus === 'denied' && (
            <Text className="text-red-500 mt-6 text-sm text-center px-4">
              请在系统设置中授予应用读取媒体文件的权限
            </Text>
          )}
        </View>
      </View>
    </>
  );
}
