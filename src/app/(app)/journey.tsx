import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FocusAwareStatusBar } from '@/components/ui';
import { translate } from '@/lib';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Journey() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <ScrollView contentContainerClassName="p-6" contentContainerStyle={{ paddingTop: insets.top + 20 }}>
        <Text className="text-3xl font-bold text-black dark:text-white mb-4">{translate('journey.title')}</Text>
        <Text className="text-lg text-gray-600 dark:text-neutral-400">
           {translate('journey.subtitle')}
        </Text>
        {/* Placeholder for Time Machine */}
        <View className="mt-8 p-6 bg-white dark:bg-neutral-800 rounded-3xl shadow-sm">
          <Text className="text-xl font-semibold mb-2 text-black dark:text-white">{translate('journey.time_machine')}</Text>
          <Text className="text-gray-500 dark:text-neutral-400">
             {translate('journey.time_machine_desc')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
