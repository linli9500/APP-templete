// Import global CSS file
import '../../global.css';

import { Env } from '@env';
import * as Sentry from '@sentry/react-native';
import { requestTrackingPermissionsAsync } from '@/lib/tracking';
import React, { useEffect, useState } from 'react';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Platform } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';


import { AppSplash } from '@/components/AppSplash';

import { APIProvider } from '@/api';
import { SupabaseProvider } from '@/providers/supabase-provider';
import { RevenueCatProvider } from '@/providers/revenue-cat-provider';
import { loadSelectedTheme } from '@/lib';
import { useThemeConfig } from '@/lib/use-theme-config';
import { hydrateAuth } from '@/lib/auth';
import { checkAppUpdate } from '@/lib/updates';
import { registerForPushNotificationsAsync } from '@/lib/notifications';
import { useAppConfig } from '@/lib/use-app-config'; 
import { UpdateChecker } from '@/components/update-checker';
import { initializeAdMob, preloadAppOpenAd, showAppOpenAd } from '@/lib/admob';

Sentry.init({
  dsn: Env.SENTRY_DSN,
  debug: __DEV__,
});

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

hydrateAuth();
loadSelectedTheme();
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 500,
  fade: false, // 禁用原生 fade，交由 AppSplash 接管
});

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isConfigReady, setIsConfigReady] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [shouldHideSplash, setShouldHideSplash] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // 1. 获取配置 (最快速度执行)
      try {
        await useAppConfig.getState().initApp();
      } catch (e) {
        // ignore config error
      }
      // 标记配置已就绪 -> 触发隐藏原生 Splash，显示 AppSplash
      setIsConfigReady(true);
      
      const adsConfig = useAppConfig.getState().ads;
      
      // 2. 广告初始化
      const adPromise = adsConfig.enabled ? (async () => {
        try {
          await initializeAdMob();
          const loaded = await preloadAppOpenAd(adsConfig.app_open_id);
          if (loaded) {
            await showAppOpenAd();
          }
        } catch (error) {
          // ignore
        }
      })() : Promise.resolve();
      
      // 3. 其他任务
      const otherInitPromise = (async () => {
        if (Platform.OS === 'ios') {
          await requestTrackingPermissionsAsync();
        }
        await checkAppUpdate();
        await registerForPushNotificationsAsync();
      })();
      
      // 4. 等待策略
      // 行业惯例：品牌闪屏至少展示 2-3 秒，太短用户看不清，太长用户会烦
      // 我们设定：至少 2.5秒，最多 5秒 (如果有广告且加载慢)
      
      const MIN_SPLASH_DURATION = 2500; // 最小展示 2.5秒
      const MAX_AD_WAIT = 5000;         // 广告最大等待 5秒

      const waitPromises: Promise<any>[] = [
        otherInitPromise,
        new Promise(resolve => setTimeout(resolve, MIN_SPLASH_DURATION))
      ];

      if (adsConfig.enabled) {
        // 如果开启了广告，我们尝试等待广告加载
        // 但如果广告加载时间超过 MAX_AD_WAIT (5s)，就放弃等待直接进 App
        const adWaitPromise = Promise.race([
          adPromise,
          new Promise(resolve => setTimeout(resolve, MAX_AD_WAIT))
        ]);
        waitPromises.push(adWaitPromise);
      }
      
      // 等待所有必要条件满足（时间到了 & 初始化好了 & 广告好了/超时了）
      await Promise.all(waitPromises);
      
      // 全部初始化完成 -> 触发 AppSplash 淡出，进入主页
      setIsAppReady(true);
    };
    
    initializeApp();
  }, []);

  // 阶段一：当 配置就绪 且 布局就绪时 -> 隐藏原生 Splash (让用户立刻看到 Web Splash)
  useEffect(() => {
    if (isConfigReady && isLayoutReady) {
         setTimeout(async () => {
              await SplashScreen.hideAsync();
         }, 50);
    }
  }, [isConfigReady, isLayoutReady]);

  // 阶段二：当 App全部就绪时 -> 通知 Web Splash 淡出
  useEffect(() => {
    if (isAppReady) {
        setShouldHideSplash(true);
    }
  }, [isAppReady]);

  const onSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <Providers
      onLayout={() => {
        setIsLayoutReady(true);
      }}
    >
      <UpdateChecker />
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="email-login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      {showSplash && <AppSplash onFinish={onSplashFinish} shouldHide={shouldHideSplash} />}
    </Providers>
  );
}

function Providers({ children, onLayout }: { children: React.ReactNode, onLayout?: () => void }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
      onLayout={onLayout}
    >
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <APIProvider>
            <BottomSheetModalProvider>
              <SupabaseProvider>
                <RevenueCatProvider>
                  {children}
                  <FlashMessage position="center" floating={true} />
                </RevenueCatProvider>
              </SupabaseProvider>
            </BottomSheetModalProvider>
          </APIProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // 强制背景色与 Launch Screen 一致，防止透出黑底
    backgroundColor: '#F5F5F0',
  },
});
