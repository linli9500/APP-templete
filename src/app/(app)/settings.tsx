import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Text, FocusAwareStatusBar } from '@/components/ui';
import { translate } from '@/lib';
import { PatternLogo } from '@/components/ui/pattern-logo';
import { Link, useRouter } from 'expo-router';
import { Settings as SettingsIcon, Profiles as ProfilesIcon, Heart, Wealth, Energy } from '@/components/ui/icons';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AnimatedGlow } from '@/components/ui/AnimatedGlow';
import { useSupabase } from '@/hooks/use-supabase';

export default function YouPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { session } = useSupabase();

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <ScrollView 
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-row items-center space-x-3">
            <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 justify-center items-center">
               <PatternLogo width={48} height={48} color="black" />
            </View>
            {session?.user?.email ? (
              <Text 
                className="text-sm text-neutral-600 dark:text-neutral-400 ml-2"
                numberOfLines={1}
                style={{ maxWidth: 150 }}
              >
                {session.user.email.split('@')[0].slice(0, 20)}
              </Text>
            ) : (
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
                    {translate('auth.not_logged_in') || '未登录'}
                  </Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
          <Link href="/options" asChild>
            <TouchableOpacity className="p-2 bg-white dark:bg-neutral-800 rounded-full shadow-sm">
               <SettingsIcon color={colorScheme === 'dark' ? 'white' : 'black'} width={20} height={20} /> 
            </TouchableOpacity>
          </Link>
        </View>

        {/* Subtitle */}
        <Text className="text-base text-gray-500 dark:text-neutral-400 font-inter mb-3 -mt-2">
          {translate('you.subtitle')}
        </Text>

        {/* Action Pills: History Reports & My Profiles */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity 
            className="bg-black dark:bg-white rounded-full px-5 py-2.5"
            onPress={() => router.push('/analysis/history')}
          >
            <Text className="text-white dark:text-black font-medium text-sm">{translate('you.history_reports')}</Text>
          </TouchableOpacity>
          <Link href="/profiles" asChild>
            <TouchableOpacity className="bg-black dark:bg-white rounded-full px-5 py-2.5">
              <Text className="text-white dark:text-black font-medium text-sm">{translate('you.my_profiles')}</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* 1. Hero Card: 每日运势 */}
        <AnimatedCard delay={0} style={{ marginBottom: 16 }}>
          <TouchableOpacity 
            className="w-full h-48 bg-[#FFF8E1] dark:bg-[#4A3B2A] rounded-[28px] p-5 justify-between overflow-hidden"
            activeOpacity={0.9}
          >
            <AnimatedGlow 
              color="energy" 
              size="large" 
              position={{ top: -60, right: -60 }}
            />
            
            <View className="z-10">
              <View className="flex-row items-center space-x-2 mb-2">
                <View className="px-3 py-1 bg-amber-900/10 dark:bg-white/10 rounded-full">
                  <Text className="text-xs font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wider">
                    {translate('you.daily_fortune_tag')}
                  </Text>
                </View>
              </View>
              <Text className="text-2xl font-bold text-black dark:text-white leading-tight">
                {translate('you.daily_fortune_title')}
              </Text>
              <Text className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                {translate('you.daily_fortune_desc')}
              </Text>
            </View>

            <View className="flex-row justify-between items-end z-10">
              <Text className="text-3xl">☀️</Text>
              <View className="w-10 h-10 rounded-full bg-black dark:bg-white justify-center items-center">
                <Text className="text-white dark:text-black">↗</Text>
              </View>
            </View>
          </TouchableOpacity>
        </AnimatedCard>

        {/* 2. Grid: 交友模式 & 隐藏性格 */}
        <View className="flex-row gap-3 mb-4">
          {/* 交友模式 */}
          <AnimatedCard delay={100} style={{ flex: 1 }}>
            <TouchableOpacity 
              className="h-40 bg-[#E0EBE2] dark:bg-[#2A332C] rounded-[24px] p-4 justify-between overflow-hidden"
              activeOpacity={0.9}
            >
              <AnimatedGlow 
                color="wealth" 
                size="small" 
                position={{ top: -20, right: -20 }}
              />
              
              <View className="z-10">
                <Text className="text-[10px] font-bold text-green-800 dark:text-green-200 uppercase tracking-wider mb-1">
                  {translate('you.social_pattern_tag')}
                </Text>
                <Text className="text-base font-bold text-black dark:text-white leading-tight">
                  {translate('you.social_pattern_title')}
                </Text>
              </View>

              <View className="z-10">
                <Text className="text-2xl">🤝</Text>
              </View>
            </TouchableOpacity>
          </AnimatedCard>

          {/* 隐藏性格 */}
          <AnimatedCard delay={150} style={{ flex: 1 }}>
            <TouchableOpacity 
              className="h-40 bg-[#E8E4F0] dark:bg-[#2D2640] rounded-[24px] p-4 justify-between overflow-hidden"
              activeOpacity={0.9}
            >
              <AnimatedGlow 
                color="earth" 
                size="small" 
                position={{ top: -20, right: -20 }}
              />
              
              <View className="z-10">
                <Text className="text-[10px] font-bold text-purple-800 dark:text-purple-200 uppercase tracking-wider mb-1">
                  {translate('you.hidden_self_tag')}
                </Text>
                <Text className="text-base font-bold text-black dark:text-white leading-tight">
                  {translate('you.hidden_self_title')}
                </Text>
              </View>

              <View className="z-10">
                <Text className="text-2xl">🎭</Text>
              </View>
            </TouchableOpacity>
          </AnimatedCard>
        </View>

        {/* 3. Grid: 恋爱观 & 情绪点 */}
        <View className="flex-row gap-3 mb-4">
          {/* 恋爱观 */}
          <AnimatedCard delay={200} style={{ flex: 1 }}>
            <TouchableOpacity 
              className="h-40 bg-[#F5E6E0] dark:bg-[#3D2C29] rounded-[24px] p-4 justify-between overflow-hidden"
              activeOpacity={0.9}
            >
              <AnimatedGlow 
                color="love" 
                size="small" 
                position={{ top: -20, right: -20 }}
              />
              
              <View className="z-10">
                <Text className="text-[10px] font-bold text-rose-800 dark:text-rose-200 uppercase tracking-wider mb-1">
                  {translate('you.love_view_tag')}
                </Text>
                <Text className="text-base font-bold text-black dark:text-white leading-tight">
                  {translate('you.love_view_title')}
                </Text>
              </View>

              <View className="z-10">
                <Heart color="#be123c" width={28} height={28} />
              </View>
            </TouchableOpacity>
          </AnimatedCard>

          {/* 情绪点 */}
          <AnimatedCard delay={250} style={{ flex: 1 }}>
            <TouchableOpacity 
              className="h-40 bg-[#F0F7FF] dark:bg-[#1E293B] rounded-[24px] p-4 justify-between overflow-hidden"
              activeOpacity={0.9}
            >
              <AnimatedGlow 
                color="water" 
                size="small" 
                position={{ top: -20, right: -20 }}
              />
              
              <View className="z-10">
                <Text className="text-[10px] font-bold text-blue-800 dark:text-blue-200 uppercase tracking-wider mb-1">
                  {translate('you.emotion_point_tag')}
                </Text>
                <Text className="text-base font-bold text-black dark:text-white leading-tight">
                  {translate('you.emotion_point_title')}
                </Text>
              </View>

              <View className="z-10">
                <Text className="text-2xl">💫</Text>
              </View>
            </TouchableOpacity>
          </AnimatedCard>
        </View>

        {/* 4. Full Width: 财富层级 */}
        <AnimatedCard delay={300}>
          <TouchableOpacity 
            className="w-full bg-[#1C1917] dark:bg-white rounded-[24px] p-5 overflow-hidden"
            activeOpacity={0.9}
          >
            <AnimatedGlow 
              color="wealth" 
              size="medium" 
              position={{ top: -40, right: -40 }}
            />
            
            <View className="flex-row justify-between items-center z-10">
              <View className="flex-1 mr-4">
                <Text className="text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mb-1">
                  {translate('you.wealth_level_tag')}
                </Text>
                <Text className="text-xl font-bold text-white dark:text-black mb-1">
                  {translate('you.wealth_level_title')}
                </Text>
                <Text className="text-xs text-neutral-400 dark:text-neutral-600">
                  {translate('you.wealth_level_desc')}
                </Text>
              </View>
              <Wealth color={colorScheme === 'dark' ? '#15803d' : '#86efac'} width={40} height={40} />
            </View>
          </TouchableOpacity>
        </AnimatedCard>

      </ScrollView>
    </View>
  );
}
