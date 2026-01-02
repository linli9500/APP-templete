import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, FocusAwareStatusBar } from '@/components/ui';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AnimatedGlow } from '@/components/ui/AnimatedGlow';
import { Wealth } from '@/components/ui/icons';
import { translate } from '@/lib';

export default function Insight() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900">
      <FocusAwareStatusBar />
      
      {/* Main Content Area */}
      <View 
        className="flex-1 px-5"
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

        {/* Module 1: Hero Card - Self Analysis */}
        <AnimatedCard delay={0} style={{ flex: 3, marginBottom: 12 }}>
          <Link href="/analysis/input" asChild>
            <TouchableOpacity 
              className="flex-1 bg-[#EBEBE6] dark:bg-neutral-800 rounded-[32px] p-5 justify-between overflow-hidden"
              activeOpacity={0.9}
            >
              {/* 动态光晕装饰 */}
              <AnimatedGlow 
                color="energy" 
                size="large" 
                position={{ top: -80, right: -80 }}
              />
              <AnimatedGlow 
                color="earth" 
                size="medium" 
                breathDuration={5000}
                position={{ bottom: 0, left: -40 }}
              />

              <View className="flex-row justify-between items-start z-10">
                 <View className="bg-white/80 dark:bg-black/40 px-3 py-1 rounded-full">
                   <Text className="text-[10px] font-bold uppercase tracking-wider text-black dark:text-white">
                     {translate('insight.core_tag')}
                   </Text>
                 </View>
              </View>

              <View className="flex-1 justify-center my-2 z-10">
                <Text className="text-5xl font-bold text-black dark:text-white mb-2 pt-2 leading-tight">
                  {translate('insight.architect')}
                </Text>
                <Text className="text-base text-neutral-600 dark:text-neutral-400 font-medium opacity-80">
                  {translate('insight.core_desc')}
                </Text>
              </View>

              <View className="flex-row justify-between items-end z-10">
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
        </AnimatedCard>

        {/* Module 2: Mood Analysis - Banner Card */}
        <AnimatedCard delay={100} style={{ flex: 2, marginBottom: 12 }}>
          <TouchableOpacity 
            className="flex-1 bg-[#FFF8E1] dark:bg-[#4A3B2A] rounded-[24px] p-4 justify-between overflow-hidden"
            activeOpacity={0.9}
          >
             {/* 动态光晕装饰 */}
             <AnimatedGlow 
               color="fire" 
               size="medium" 
               position={{ top: -40, right: -40 }}
             />

             <View className="flex-row justify-between items-center z-10">
                <Text className="text-xs font-bold uppercase tracking-wider text-orange-900/60 dark:text-orange-100/60">
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
        </AnimatedCard>

        {/* Module 3 & 4: Grid Layout */}
        <View className="flex-row gap-3" style={{ flex: 2 }}>
           {/* Love / Connections */}
           <AnimatedCard delay={200} style={{ flex: 1 }}>
             <TouchableOpacity 
               className="flex-1 bg-[#F5E6E0] dark:bg-[#3D2C29] rounded-[24px] p-4 justify-between overflow-hidden"
               activeOpacity={0.9}
             >
                <AnimatedGlow 
                  color="love" 
                  size="small" 
                  position={{ top: -32, right: -32 }}
                />
                
                <View className="z-10">
                   <Text className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                     {translate('insight.connect_tag')}
                   </Text>
                   <Text className="text-lg font-bold text-black dark:text-white leading-tight">
                     {translate('insight.connect_title').replace('{nl}', '\n')}
                   </Text>
                </View>

                <View className="items-center z-10">
                   <View className="flex-row -space-x-2 mb-1">
                      <View className="w-8 h-8 rounded-full bg-neutral-300 border-2 border-white dark:border-neutral-800" />
                      <View className="w-8 h-8 rounded-full bg-neutral-400 border-2 border-white dark:border-neutral-800" />
                   </View>
                   <Text className="text-[10px] text-neutral-500 text-center">
                     {translate('insight.connect_desc')}
                   </Text>
                </View>
             </TouchableOpacity>
           </AnimatedCard>

           {/* Wealth */}
           <AnimatedCard delay={300} style={{ flex: 1 }}>
             <TouchableOpacity 
               className="flex-1 bg-[#E0EBE2] dark:bg-[#2A332C] rounded-[24px] p-4 justify-between overflow-hidden"
               activeOpacity={0.9}
             >
                <AnimatedGlow 
                  color="wealth" 
                  size="small" 
                  position={{ top: -32, right: -32 }}
                />
                
                <View className="z-10">
                   <Text className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                     {translate('insight.wealth_tag')}
                   </Text>
                   <Text className="text-lg font-bold text-black dark:text-white leading-tight">
                     {translate('insight.wealth_title').replace('{nl}', '\n')}
                   </Text>
                </View>

                <View className="mt-auto z-10">
                   <Wealth color="#15803d" width={28} height={28} />
                   <Text className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                     {translate('insight.wealth_index')} ⭐⭐⭐
                   </Text>
                </View>
             </TouchableOpacity>
           </AnimatedCard>
        </View>

        {/* Daily Wisdom - Minimal footer */}
        <View className="items-center justify-center pt-3 pb-1">
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
