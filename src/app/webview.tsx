import React, { useState, useRef } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

import { Text, FocusAwareStatusBar } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';

export default function WebViewScreen() {
  const params = useLocalSearchParams<{ url: string; title?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900">
        <FocusAwareStatusBar />
        
        {/* 自定义导航栏 */}
        <View 
          className="flex-row items-center justify-between px-6 pb-4 bg-[#F5F5F0] dark:bg-neutral-900"
          style={{ paddingTop: insets.top + 10 }}
        >
          {/* 返回按钮 */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-8 h-8 rounded-full bg-black dark:bg-neutral-800 justify-center items-center"
            style={{ transform: [{ rotate: '180deg' }] }}
          >
            <ArrowRight color="white" width={16} height={16} />
          </TouchableOpacity>
          
          {/* 标题 */}
          <Text 
            className="text-xl font-bold text-black dark:text-white flex-1 text-center"
            numberOfLines={1}
          >
            {params.title || 'Web View'}
          </Text>
          
          {/* 占位保持居中 */}
          <View className="w-8" />
        </View>

        {/* WebView 内容 */}
        <View className="flex-1 bg-white dark:bg-black overflow-hidden rounded-t-3xl">
          <WebView 
            ref={webViewRef}
            source={{ uri: params.url }} 
            style={{ flex: 1 }}
            startInLoadingState={false}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
          
          {/* 加载指示器 */}
          {isLoading && (
            <View className="absolute inset-0 justify-center items-center bg-white dark:bg-black">
              <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#000000'} />
            </View>
          )}
        </View>
      </View>
    </>
  );
}
