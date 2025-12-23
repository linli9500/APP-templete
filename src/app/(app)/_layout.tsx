/* eslint-disable react/no-unstable-nested-components */
import { Link, Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

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

import { useAppConfig } from '@/lib/use-app-config';

export default function TabLayout() {
  const { session, isLoaded } = useSupabase();
  const [isFirstTime] = useIsFirstTime();
  const { initApp } = useAppConfig();
  
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
  if (isLoaded && !session) {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.neutral[400],
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.pattern.bg,
          borderTopColor: colors.pattern.bg,
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
  );
}


