import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, FocusAwareStatusBar } from '@/components/ui';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AnimatedGlow } from '@/components/ui/AnimatedGlow';
import { TimeMachine, Wealth, Heart, Career, Energy } from '@/components/ui/icons';
import { translate } from '@/lib';

export default function Journey() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900">
      <FocusAwareStatusBar />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-2">
          <Text className="text-4xl font-bold text-black dark:text-white tracking-tight">
            {translate('journey.title')}
          </Text>
          <Text className="text-base text-neutral-500 dark:text-neutral-400 mt-1">
            {translate('journey.subtitle')}
          </Text>
        </View>

        {/* Slogan */}
        <View className="mb-6 px-1">
          <Text className="text-xs font-serif font-bold italic text-neutral-800 dark:text-neutral-200">
            "{translate('journey.slogan')}"
          </Text>
        </View>

        {/* 1. Hero Card: 人生时光机 */}
        <AnimatedCard delay={0} style={{ marginBottom: 16 }}>
          <TouchableOpacity 
            className="w-full h-56 bg-gradient-to-br bg-[#E8E4F0] dark:bg-[#2D2640] rounded-[32px] p-6 justify-between overflow-hidden"
            activeOpacity={0.9}
          >
            <AnimatedGlow 
              color="earth" 
              size="large" 
              position={{ top: -60, right: -60 }}
            />
            <AnimatedGlow 
              color="energy" 
              size="medium" 
              breathDuration={5000}
              position={{ bottom: -40, left: -20 }}
            />

            <View className="z-10">
              <View className="flex-row items-center space-x-2 mb-2">
                <View className="px-3 py-1 bg-white/60 dark:bg-black/20 rounded-full">
                  <Text className="text-xs font-bold text-purple-900 dark:text-purple-100 uppercase tracking-wider">
                    {translate('journey.life_tag')}
                  </Text>
                </View>
              </View>
              <Text className="text-3xl font-bold text-black dark:text-white leading-tight mb-2">
                {translate('journey.life_title')}
              </Text>
              <Text className="text-sm text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">
                {translate('journey.life_desc')}
              </Text>
            </View>

            <View className="flex-row justify-between items-end z-10">
              <View className="flex-row items-center space-x-2">
                <TimeMachine color="#581c87" width={32} height={32} />
                <Text className="text-xs text-purple-800 dark:text-purple-200 font-medium">
                  {translate('journey.life_label')}
                </Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-black dark:bg-white justify-center items-center">
                <Text className="text-white dark:text-black">↗</Text>
              </View>
            </View>
          </TouchableOpacity>
        </AnimatedCard>

        {/* 2. Grid: 财富时光机 & 爱情时光机 */}
        <View className="flex-row gap-3 mb-4">
          {/* 财富时光机 */}
          <AnimatedCard delay={100} style={{ flex: 1 }}>
            <TouchableOpacity 
              className="h-44 bg-[#E0EBE2] dark:bg-[#2A332C] rounded-[24px] p-4 justify-between overflow-hidden"
              activeOpacity={0.9}
            >
              <AnimatedGlow 
                color="wealth" 
                size="small" 
                position={{ top: -20, right: -20 }}
              />
              
              <View className="z-10">
                <Text className="text-[10px] font-bold text-green-800 dark:text-green-200 uppercase tracking-wider mb-1">
                  {translate('journey.wealth_tag')}
                </Text>
                <Text className="text-lg font-bold text-black dark:text-white leading-tight">
                  {translate('journey.wealth_title')}
                </Text>
              </View>

              <View className="z-10">
                <Wealth color="#15803d" width={28} height={28} />
                <Text className="text-[10px] text-green-900/70 dark:text-green-100/70 mt-1">
                  {translate('journey.wealth_desc')}
                </Text>
              </View>
            </TouchableOpacity>
          </AnimatedCard>

          {/* 爱情时光机 */}
          <AnimatedCard delay={150} style={{ flex: 1 }}>
            <TouchableOpacity 
              className="h-44 bg-[#F5E6E0] dark:bg-[#3D2C29] rounded-[24px] p-4 justify-between overflow-hidden"
              activeOpacity={0.9}
            >
              <AnimatedGlow 
                color="love" 
                size="small" 
                position={{ top: -20, right: -20 }}
              />
              
              <View className="z-10">
                <Text className="text-[10px] font-bold text-rose-800 dark:text-rose-200 uppercase tracking-wider mb-1">
                  {translate('journey.love_tag')}
                </Text>
                <Text className="text-lg font-bold text-black dark:text-white leading-tight">
                  {translate('journey.love_title')}
                </Text>
              </View>

              <View className="z-10">
                <Heart color="#be123c" width={28} height={28} />
                <Text className="text-[10px] text-rose-900/70 dark:text-rose-100/70 mt-1">
                  {translate('journey.love_desc')}
                </Text>
              </View>
            </TouchableOpacity>
          </AnimatedCard>
        </View>

        {/* 3. Grid: 职业发展时光机 & 能量时光机 */}
        <View className="flex-row gap-3 mb-4">
          {/* 职业发展时光机 */}
          <AnimatedCard delay={200} style={{ flex: 1 }}>
            <TouchableOpacity 
              className="h-44 bg-[#E6F0F5] dark:bg-[#1E293B] rounded-[24px] p-4 justify-between overflow-hidden"
              activeOpacity={0.9}
            >
              <AnimatedGlow 
                color="work" 
                size="small" 
                position={{ top: -20, right: -20 }}
              />
              
              <View className="z-10">
                <Text className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {translate('journey.career_tag')}
                </Text>
                <Text className="text-lg font-bold text-black dark:text-white leading-tight">
                  {translate('journey.career_title')}
                </Text>
              </View>

              <View className="z-10">
                <Career color="#334155" width={28} height={28} />
                <Text className="text-[10px] text-slate-800/70 dark:text-slate-200/70 mt-1">
                  {translate('journey.career_desc')}
                </Text>
              </View>
            </TouchableOpacity>
          </AnimatedCard>

          {/* 能量时光机 */}
          <AnimatedCard delay={250} style={{ flex: 1 }}>
            <TouchableOpacity 
              className="h-44 bg-[#FFF8E1] dark:bg-[#4A3B2A] rounded-[24px] p-4 justify-between overflow-hidden"
              activeOpacity={0.9}
            >
              <AnimatedGlow 
                color="energy" 
                size="small" 
                position={{ top: -20, right: -20 }}
              />
              
              <View className="z-10">
                <Text className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider mb-1">
                  {translate('journey.energy_tag')}
                </Text>
                <Text className="text-lg font-bold text-black dark:text-white leading-tight">
                  {translate('journey.energy_title')}
                </Text>
              </View>

              <View className="z-10">
                <Energy color="#92400e" width={28} height={28} />
                <Text className="text-[10px] text-amber-900/70 dark:text-amber-100/70 mt-1">
                  {translate('journey.energy_desc')}
                </Text>
              </View>
            </TouchableOpacity>
          </AnimatedCard>
        </View>

        {/* 4. Banner: 定制分析 */}
        <AnimatedCard delay={300}>
          <TouchableOpacity 
            className="w-full bg-[#1C1917] dark:bg-white rounded-[24px] p-5 overflow-hidden"
            activeOpacity={0.9}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <Text className="text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mb-1">
                  {translate('journey.custom_tag')}
                </Text>
                <Text className="text-xl font-bold text-white dark:text-black mb-1">
                  {translate('journey.custom_title')}
                </Text>
                <Text className="text-xs text-neutral-400 dark:text-neutral-600">
                  {translate('journey.custom_desc')}
                </Text>
              </View>
              <View className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/10 justify-center items-center">
                <Text className="text-2xl">🚀</Text>
              </View>
            </View>
          </TouchableOpacity>
        </AnimatedCard>

        {/* Footer Quote */}
        <View className="items-center justify-center pt-6">
          <Text className="text-[10px] text-neutral-400 uppercase tracking-widest text-center mb-0.5">
            {translate('journey.footer_title')}
          </Text>
          <Text 
            className="text-center font-serif italic text-neutral-600 dark:text-neutral-500 px-4 text-xs"
            numberOfLines={2}
          >
            "{translate('journey.footer_quote')}"
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
