import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Text, FocusAwareStatusBar } from '@/components/ui';
import { translate } from '@/lib';

export default function Insight() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-black dark:text-white font-inter tracking-tight">
            {translate('insight.title')}
          </Text>
          <Text className="text-lg text-gray-500 dark:text-neutral-400 mt-2 font-inter">
            {translate('insight.subtitle')}
          </Text>
        </View>

        {/* Core Analysis Card */}
        <View className="bg-[#EBEBE6] dark:bg-neutral-800 rounded-[24px] p-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
             <Text className="text-xl font-bold text-black dark:text-white uppercase tracking-widest">
               {translate('insight.true_self')}
             </Text>
             <View className="bg-black dark:bg-white px-3 py-1 rounded-full">
               <Text className="text-white dark:text-black text-xs font-bold">{translate('insight.core_tag')}</Text>
             </View>
          </View>
          <Text className="text-3xl font-bold text-black dark:text-white leading-tight mb-4">
            {translate('insight.architect_title')}
          </Text>
          <Text className="text-base text-gray-700 dark:text-neutral-300 leading-relaxed mb-6">
            {translate('insight.architect_desc')}
          </Text>
           {/* Decorative Button */}
          <Link href="/analysis/input" asChild>
            <TouchableOpacity className="bg-black dark:bg-white rounded-full py-4 items-center active:opacity-90">
              <Text className="text-white dark:text-black font-bold text-sm tracking-wider uppercase">
                {translate('insight.view_report')}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Emotion Detector Section */}
        <View className="bg-[#DFDFD9] dark:bg-neutral-800 rounded-[24px] p-6 mb-6">
          <View className="mb-4">
             <Text className="text-xl font-bold text-black dark:text-white uppercase tracking-widest">
               {translate('insight.energy_station')}
             </Text>
          </View>
          
          <Text className="text-2xl font-bold text-black dark:text-white mb-2">
            {translate('insight.emotion_detector')}
          </Text>
          <Text className="text-base text-gray-700 dark:text-neutral-300 leading-relaxed mb-6">
            {translate('insight.current_vibe')} <Text className="font-bold text-black dark:text-white">{translate('insight.vibe_value')}</Text>
            {'\n'}
            {translate('insight.suggested_action')} <Text className="font-bold text-black dark:text-white">{translate('insight.action_value')}</Text>
          </Text>

          <View className="flex-row space-x-3">
             <View className="flex-1 bg-white/50 dark:bg-neutral-700 rounded-2xl py-4 items-center justify-center">
                <Text className="text-black dark:text-white font-bold">{translate('insight.charge')}</Text>
             </View>
             <View className="flex-1 bg-white/50 dark:bg-neutral-700 rounded-2xl py-4 items-center justify-center">
                <Text className="text-black dark:text-white font-bold">{translate('insight.analyze')}</Text>
             </View>
          </View>
        </View>

        {/* Daily Insight Placeholder */}
        <View className="bg-white dark:bg-neutral-800 rounded-[24px] p-6">
          <Text className="text-sm font-bold text-gray-400 dark:text-neutral-500 uppercase mb-2">
            {translate('insight.daily_guidance')}
          </Text>
          <Text className="text-xl font-medium text-black dark:text-white italic">
            {translate('insight.quote')}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
