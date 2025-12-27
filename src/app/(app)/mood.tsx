import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Text, FocusAwareStatusBar } from '@/components/ui';
import { translate } from '@/lib';

export default function Mood() {
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
            {translate('mood.title')}
          </Text>
          <Text className="text-lg text-gray-500 dark:text-neutral-400 mt-2 font-inter">
            {translate('mood.subtitle')}
          </Text>
        </View>

        {/* 情绪状态卡片 */}
        <View className="bg-[#EBEBE6] dark:bg-neutral-800 rounded-[24px] p-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
             <Text className="text-xl font-bold text-black dark:text-white uppercase tracking-widest">
               {translate('mood.emotional_state')}
             </Text>
             <View className="bg-black dark:bg-white px-3 py-1 rounded-full">
               <Text className="text-white dark:text-black text-xs font-bold">{translate('mood.core_tag')}</Text>
             </View>
          </View>
          <Text className="text-3xl font-bold text-black dark:text-white leading-tight mb-4">
            {translate('mood.mood_title')}
          </Text>
          <Text className="text-base text-gray-700 dark:text-neutral-300 leading-relaxed mb-6">
            {translate('mood.mood_desc')}
          </Text>
           {/* 分析按钮 */}
          <Link href="/analysis/input" asChild>
            <TouchableOpacity className="bg-black dark:bg-white rounded-full py-4 items-center active:opacity-90">
              <Text className="text-white dark:text-black font-bold text-sm tracking-wider uppercase">
                {translate('mood.view_analysis')}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* 情绪签到区域 */}
        <View className="bg-[#DFDFD9] dark:bg-neutral-800 rounded-[24px] p-6 mb-6">
          <View className="mb-4">
             <Text className="text-xl font-bold text-black dark:text-white uppercase tracking-widest">
               {translate('mood.mood_station')}
             </Text>
          </View>
          
          <Text className="text-2xl font-bold text-black dark:text-white mb-2">
            {translate('mood.mood_detector')}
          </Text>
          <Text className="text-base text-gray-700 dark:text-neutral-300 leading-relaxed mb-6">
            {translate('mood.current_mood')} <Text className="font-bold text-black dark:text-white">{translate('mood.mood_value')}</Text>
            {'\n'}
            {translate('mood.suggested_remedy')} <Text className="font-bold text-black dark:text-white">{translate('mood.remedy_value')}</Text>
          </Text>

          <View className="flex-row space-x-3">
             <View className="flex-1 bg-white/50 dark:bg-neutral-700 rounded-2xl py-4 items-center justify-center">
                <Text className="text-black dark:text-white font-bold">{translate('mood.recharge')}</Text>
             </View>
             <View className="flex-1 bg-white/50 dark:bg-neutral-700 rounded-2xl py-4 items-center justify-center">
                <Text className="text-black dark:text-white font-bold">{translate('mood.reflect')}</Text>
             </View>
          </View>
        </View>

        {/* 每日肯定语 */}
        <View className="bg-white dark:bg-neutral-800 rounded-[24px] p-6">
          <Text className="text-sm font-bold text-gray-400 dark:text-neutral-500 uppercase mb-2">
            {translate('mood.daily_affirmation')}
          </Text>
          <Text className="text-xl font-medium text-black dark:text-white italic">
            {translate('mood.affirmation_quote')}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
