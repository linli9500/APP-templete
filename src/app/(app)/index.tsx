import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, FocusAwareStatusBar } from '@/components/ui';
import { translate } from '@/lib';

export default function Insight() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900">
      <FocusAwareStatusBar />
      
      {/* Main Content Area */}
      <View 
        className="flex-1 px-5 flex-col gap-3"
        style={{ paddingTop: insets.top + 20, paddingBottom: 10 }}
      >
        {/* Header Title */}
        <View className="mb-4 flex-row items-end">
          <Text className="text-4xl font-bold text-black dark:text-white tracking-tight mr-3 pt-2">
            {translate('insight.title')}
          </Text>
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 pb-1.5">
            {translate('insight.subtitle_new')}
          </Text>
        </View>

        {/* Slogan */}
        <View className="mb-4 px-1 -mt-2">
          <Text 
            className="text-xs font-serif font-bold italic text-neutral-800 dark:text-neutral-200 leading-relaxed" 
            numberOfLines={1} 
            adjustsFontSizeToFit
          >
            {translate('insight.slogan')}
          </Text>
        </View>

        {/* Module 1: Hero Card - Self Analysis (Flex 3) */}
        <Link href="/analysis/input" asChild>
          <TouchableOpacity 
            className="w-full flex-[3] bg-[#EBEBE6] dark:bg-neutral-800 rounded-[32px] p-5 justify-between shadow-sm active:opacity-95 overflow-hidden"
            activeOpacity={0.9}
          >
            {/* Visual Decoration */}
            <View className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-200/40 rounded-full blur-3xl opacity-60" />
            <View className="absolute -left-10 bottom-0 w-40 h-40 bg-purple-200/30 rounded-full blur-2xl opacity-50" />

            <View className="flex-row justify-between items-start">
               <View className="bg-white/80 dark:bg-black/40 px-3 py-1 rounded-full">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-black dark:text-white">
                    {translate('insight.core_tag')}
                  </Text>
               </View>
            </View>

            <View className="flex-1 justify-center my-2">
              <Text className="text-5xl font-bold text-black dark:text-white mb-2 pt-2 leading-tight">
                {translate('insight.architect')}
              </Text>
              <Text className="text-base text-neutral-600 dark:text-neutral-400 font-medium opacity-80">
                {translate('insight.core_desc')}
              </Text>
            </View>

            <View className="flex-row justify-between items-end">
               <View className="flex-row space-x-2">
                  <View className="bg-black/5 dark:bg-white/10 px-3 py-1 rounded-lg">
                    <Text className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">
                      {translate('insight.order')}
                    </Text>
                  </View>
                  <View className="bg-black/5 dark:bg-white/10 px-3 py-1 rounded-lg">
                    <Text className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">
                      {translate('insight.logic')}
                    </Text>
                  </View>
               </View>
               <View className="w-10 h-10 rounded-full bg-black dark:bg-white justify-center items-center">
                  <Text className="text-white dark:text-black">↗</Text>
               </View>
            </View>
          </TouchableOpacity>
        </Link>

        {/* Module 2: Mood Analysis - Banner Card (Flex 2) */}
        <TouchableOpacity 
          className="w-full flex-[2] bg-[#FFF8E1] dark:bg-[#4A3B2A] rounded-[24px] p-4 shadow-sm active:opacity-95 justify-between overflow-hidden"
        >
           {/* Background Decoration for Warmth */}
           <View className="absolute top-0 right-0 w-32 h-32 bg-orange-200/40 rounded-full blur-3xl -mr-10 -mt-10" />

           <View className="flex-row justify-between items-center z-10">
              <Text className="text-xs font-bold uppercase tracking-wider text-orange-900/60 dark:text-orange-100/60 animate-pulse">
                ● {translate('insight.mood_title')}
              </Text>
              <View className="bg-orange-900/10 dark:bg-white/10 px-2 py-0.5 rounded">
                 <Text className="text-[10px] font-bold text-orange-900 dark:text-orange-100">
                   {translate('insight.scan_tag')}
                 </Text>
              </View>
           </View>
           
           {/* Visual: Abstract Healing/Flow */}
           <View className="flex-row items-center justify-center h-10 my-1 z-10">
              <View className="w-full h-2 bg-orange-900/10 dark:bg-white/10 rounded-full overflow-hidden">
                 <View className="w-2/3 h-full bg-orange-400 dark:bg-orange-300 opacity-60" />
              </View>
           </View>

           <View className="z-10">
             <Text className="text-lg font-bold text-orange-950 dark:text-orange-50 mb-1">
               {translate('insight.mood_question')}
             </Text>
             <Text className="text-xs text-orange-900/70 dark:text-orange-100/70 leading-snug">
               {translate('insight.mood_desc')}
             </Text>
           </View>
        </TouchableOpacity>

        {/* Module 3 & 4: Grid Layout (Flex 2) */}
        <View className="flex-row justify-between space-x-3 flex-[2]">
           {/* Love / Connections */}
           <TouchableOpacity className="flex-1 bg-[#F5E6E0] dark:bg-[#3D2C29] rounded-[24px] p-4 justify-between shadow-sm active:opacity-95 relative overflow-hidden">
              <View className="absolute top-0 right-0 w-24 h-24 bg-red-200/40 rounded-full blur-2xl -mr-8 -mt-8" />
              
              <View>
                 <Text className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                   {translate('insight.connect_tag')}
                 </Text>
                 <Text className="text-lg font-bold text-black dark:text-white leading-tight">
                   {translate('insight.connect_title').replace('{nl}', '\n')}
                 </Text>
              </View>

              <View className="items-center">
                 <View className="flex-row -space-x-2 mb-1">
                    <View className="w-8 h-8 rounded-full bg-neutral-300 border-2 border-white dark:border-neutral-800" />
                    <View className="w-8 h-8 rounded-full bg-neutral-400 border-2 border-white dark:border-neutral-800" />
                 </View>
                 <Text className="text-[10px] text-neutral-500 text-center">
                   {translate('insight.connect_desc')}
                 </Text>
              </View>
           </TouchableOpacity>

           {/* Wealth */}
           <TouchableOpacity className="flex-1 bg-[#E0EBE2] dark:bg-[#2A332C] rounded-[24px] p-4 justify-between shadow-sm active:opacity-95 relative overflow-hidden">
              <View className="absolute top-0 right-0 w-24 h-24 bg-green-200/40 rounded-full blur-2xl -mr-8 -mt-8" />
              
              <View>
                 <Text className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                   {translate('insight.wealth_tag')}
                 </Text>
                 <Text className="text-lg font-bold text-black dark:text-white leading-tight">
                   {translate('insight.wealth_title').replace('{nl}', '\n')}
                 </Text>
              </View>

              <View className="mt-auto">
                 <Text className="text-2xl mb-1">💰</Text>
                 <Text className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                   {translate('insight.wealth_index')} ⭐⭐⭐
                 </Text>
              </View>
           </TouchableOpacity>
        </View>

        {/* Daily Wisdom - Minimal footer */}
        <View className="items-center justify-center pt-1 pb-1">
          <Text className="text-[10px] text-neutral-400 uppercase tracking-widest text-center mb-0.5">
            {translate('insight.daily_wisdom')}
          </Text>
          <Text 
            className="text-center font-serif italic text-neutral-600 dark:text-neutral-500 px-4 text-xs"
            numberOfLines={1}
          >
            "In the middle of difficulty lies opportunity."
          </Text>
        </View>

      </View>
    </View>
  );
}
