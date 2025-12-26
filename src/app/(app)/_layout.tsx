/* eslint-disable react/no-unstable-nested-components */
import { Link, Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { Pressable, Text, colors } from '@/components/ui';
import {
  Feed as FeedIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
  User as UserIcon,
} from '@/components/ui/icons';
import { useIsFirstTime } from '@/lib';
import { useSupabase } from '@/hooks/use-supabase';
import { translate } from '@/lib';
import { AnnouncementModal } from '@/components/announcement-modal';

import { useAppConfig } from '@/lib/use-app-config';
import { useHistorySync } from '@/hooks/use-history-sync';

export default function TabLayout() {
  const { session, isLoaded } = useSupabase();
  const [isFirstTime] = useIsFirstTime();
  const { initApp } = useAppConfig();
  const { colorScheme } = useColorScheme();
  
  // 启用历史记录同步
  useHistorySync();
  const isDark = colorScheme === 'dark';
  
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    // Start bootstrap when layout mounts
    // We allow navigation to proceed even if bootstrap isn't finished to avoid blocking UI too long,
    // or we can await it if critical. Here we fire-and-forget but log.
    initApp();

    if (isLoaded) {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, isLoaded, initApp]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  // Remove mandatory login check to allow guest access
  // if (isLoaded && !session) {
  //   return <Redirect href="/login" />;
  // }
  return (
    <>
      {/* 公告弹窗 - 当后台配置 announcement.enabled 为 true 时自动显示 */}
      <AnnouncementModal />
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDark ? colors.white : colors.black,
          tabBarInactiveTintColor: isDark ? colors.neutral[500] : colors.neutral[400],
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDark ? colors.charcoal[950] : colors.pattern.bg,
            borderTopColor: isDark ? colors.charcoal[950] : colors.pattern.bg,
            elevation: 0,
            shadowOpacity: 0,
            height: 90,
            paddingBottom: 10,
            paddingTop: 15,
          },
          headerTitleStyle: {
            fontFamily: 'Inter',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 2,
            color: isDark ? colors.white : colors.black,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: translate('insight.title'),
            tabBarIcon: ({ color }) => <HomeIcon color={color} />,
            tabBarButtonTestID: 'insight-tab',
          }}
        />

        <Tabs.Screen
          name="bonds"
          options={{
            title: translate('bonds.title'),
            tabBarIcon: ({ color }) => <StyleIcon color={color} />, // Placeholder icon
            tabBarButtonTestID: 'bonds-tab',
          }}
        />

        <Tabs.Screen
          name="journey"
          options={{
            title: translate('journey.title'), 
            tabBarIcon: ({ color }) => <FeedIcon color={color} />, // Placeholder icon
            tabBarButtonTestID: 'journey-tab',
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: translate('journey.settings_title'),
            headerShown: false,
            tabBarIcon: ({ color }) => <UserIcon color={color} />,
            tabBarButtonTestID: 'settings-tab',
          }}
        />
      </Tabs>
    </>
  );
}


