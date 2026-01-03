/* eslint-disable react/no-unstable-nested-components */
import { Link, Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { Pressable, Text, colors } from '@/components/ui';
import {
  Journey as JourneyIcon,
  Connections as ConnectionsIcon,
  Insight as InsightIcon,
  MoodWave as MoodIcon,
  You as YouIcon,
} from '@/components/ui/icons';
import { useIsFirstTime } from '@/lib';
import { useSupabase } from '@/hooks/use-supabase';
import { translate } from '@/lib';
import { AnnouncementModal } from '@/components/announcement-modal';

import { useHistorySync } from '@/hooks/use-history-sync';
import { useProfileSync } from '@/hooks/use-profile-sync';

export default function TabLayout() {
  const { session, isLoaded } = useSupabase();
  const [isFirstTime] = useIsFirstTime();
  const { colorScheme } = useColorScheme();
  
  // 启用同步 Hooks
  useHistorySync();
  useProfileSync();
  const isDark = colorScheme === 'dark';
  
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    // 注意：initApp() 已在根 _layout.tsx 中调用，这里不再重复调用
    if (isLoaded) {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, isLoaded]);

  // if (isFirstTime) {
  //   return <Redirect href="/onboarding" />;
  // }
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
        {/* 1. Journey - 旅程 */}
        <Tabs.Screen
          name="journey"
          options={{
            title: translate('journey.title'), 
            tabBarIcon: ({ color }) => <JourneyIcon color={color} />,
            tabBarButtonTestID: 'journey-tab',
          }}
        />

        {/* 2. Connections - 连结 */}
        <Tabs.Screen
          name="bonds"
          options={{
            title: translate('bonds.title'),
            tabBarIcon: ({ color }) => <ConnectionsIcon color={color} />,
            tabBarButtonTestID: 'bonds-tab',
          }}
        />

        {/* 3. Insight - 核心分析 (默认首页，中间位置) */}
        <Tabs.Screen
          name="index"
          options={{
            title: translate('insight.title'),
            tabBarIcon: ({ color }) => <InsightIcon color={color} />,
            tabBarButtonTestID: 'insight-tab',
          }}
        />

        {/* 4. Mood - 情绪 (新增) */}
        <Tabs.Screen
          name="mood"
          options={{
            title: translate('mood.title'),
            tabBarIcon: ({ color }) => <MoodIcon color={color} />,
            tabBarButtonTestID: 'mood-tab',
          }}
        />

        {/* 5. You - 我的 */}
        <Tabs.Screen
          name="settings"
          options={{
            title: translate('journey.settings_title'),
            headerShown: false,
            tabBarIcon: ({ color }) => <YouIcon color={color} />,
            tabBarButtonTestID: 'settings-tab',
          }}
        />
      </Tabs>
    </>
  );
}


