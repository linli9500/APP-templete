// Import  global CSS file
import '../../global.css';

import { Env } from '@env';
import * as Sentry from '@sentry/react-native';
import { requestTrackingPermissionsAsync } from '@/lib/tracking';
import { useCallback, useEffect } from 'react';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Stack, Redirect } from 'expo-router'; // Add Redirect here as it might be used
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { APIProvider } from '@/api';
import { SupabaseProvider } from '@/providers/supabase-provider';
import { RevenueCatProvider } from '@/providers/revenue-cat-provider';
import { loadSelectedTheme, useIsFirstTime } from '@/lib'; // Check if useIsFirstTime is exported from @/lib
import { useThemeConfig } from '@/lib/use-theme-config';
import { useSupabase } from '@/hooks/use-supabase'; // Check imports for TabLayout vs RootLayout
// RootLayout seemed to just wrap Providers around Stack. 
// Step 155 showed RootLayout content. 
// Wait, Step 155 showed RootLayout wrapping Stack.
// Step 42 showed TabLayout.
// I am editing RootLayout (src/app/_layout.tsx).


Sentry.init({
  dsn: Env.SENTRY_DSN,
  debug: __DEV__,
});

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

// hydrateAuth();
loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

import { checkAppUpdate } from '@/lib/updates';
import { registerForPushNotificationsAsync } from '@/lib/notifications';
import { useAppConfig } from '@/lib/use-app-config'; 
import { UpdateChecker } from '@/components/update-checker';

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      // Small delay to ensure the app is ready/visible
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (Platform.OS === 'ios') {
        await requestTrackingPermissionsAsync();
      }
      await checkAppUpdate(); // Silent check
      await registerForPushNotificationsAsync(); // Register for Push
      
      // Initialize remote config
      useAppConfig.getState().initApp();
    })();
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
  },
});
