/* eslint-disable react/no-unstable-nested-components */
import { Link, Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { Pressable, Text, colors } from '@/components/ui';
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from '@/components/ui/icons';
import { useIsFirstTime } from '@/lib';
import { useSupabase } from '@/hooks/use-supabase';

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
        tabBarStyle: {
          backgroundColor: colors.pattern.bg,
          borderTopColor: colors.pattern.bg,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerStyle: {
          backgroundColor: colors.pattern.bg,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontFamily: 'Inter', // Ensure Inter is used
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          headerRight: () => <CreateNewPostLink />,
          tabBarButtonTestID: 'feed-tab',
        }}
      />

      <Tabs.Screen
        name="style"
        options={{
          title: 'Style',
          headerShown: false,
          tabBarIcon: ({ color }) => <StyleIcon color={color} />,
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}

const CreateNewPostLink = () => {
  return (
    <Link href="/feed/add-post" asChild>
      <Pressable>
        <Text className="px-3 text-primary-300">Create</Text>
      </Pressable>
    </Link>
  );
};
