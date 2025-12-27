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
  fade: true,
});

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      // 1. 获取配置
      await useAppConfig.getState().initApp();
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
      
      // 4. 等待
      if (adsConfig.enabled) {
        await Promise.race([
          adPromise,
          new Promise(resolve => setTimeout(resolve, 5000))
        ]);
      }
      
      
      await otherInitPromise;
      
      // 注意：Splash 的隐藏移到了 onLayout 中
    };
    
    initializeApp();
  }, []);

  return (
    <Providers>
      <UpdateChecker />
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="email-login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
      onLayout={async () => {
        // 确保 View 渲染完成后再隐藏 Splash
        // 加一点点延迟确保绘制上屏
        setTimeout(async () => {
             await SplashScreen.hideAsync();
        }, 100);
      }}
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
