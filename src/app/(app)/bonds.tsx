import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, FocusAwareStatusBar } from '@/components/ui';
import { translate } from '@/lib';
import { Link } from 'expo-router';

export default function Bonds() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900">
      <FocusAwareStatusBar />
      
      <ScrollView 
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-4xl font-bold text-black dark:text-white tracking-tight">
            {translate('bonds.title')}
          </Text>
          <Text className="text-base text-neutral-500 dark:text-neutral-400 mt-1">
            {translate('bonds.subtitle')}
          </Text>
        </View>

        {/* 1. Hero: Partner / Soulmate - Pre-test State */}
        <TouchableOpacity 
          className="w-full h-80 bg-[#F5E6E0] dark:bg-[#3D2C29] rounded-[32px] p-6 justify-between shadow-sm mb-6 relative overflow-hidden active:opacity-95"
          activeOpacity={0.9}
        >
           {/* Abstract Energy Visual - Subtler for pre-test */}
           <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-200 dark:bg-rose-800/30 rounded-full blur-[80px] opacity-40" />
           
           <View>
              <View className="flex-row items-center space-x-2 mb-4">
                 <View className="px-3 py-1 bg-white/60 dark:bg-black/20 rounded-full backdrop-blur-md">
                   <Text className="text-xs font-bold text-rose-950 dark:text-rose-100 uppercase tracking-wider">
                     {translate('bonds.partner_title')}
                   </Text>
                 </View>
              </View>
              {/* Large CTA Text */}
              <Text className="text-4xl font-bold text-black dark:text-white leading-tight mb-2">
                 {translate('bonds.compatibility_score')}
              </Text>
              <Text className="text-sm text-neutral-600 dark:text-neutral-300 font-medium opacity-80 decoration-neutral-400">
                 {translate('bonds.compatibility_label')}
              </Text>
           </View>

           {/* Empty State Visual / Dashboard connector */}
           <View className="flex-row items-center justify-between mt-auto">
              <View className="flex-row items-center space-x-4">
                 <View className="w-14 h-14 rounded-full bg-white/80 dark:bg-white/10 border border-white/50 dark:border-white/5 flex items-center justify-center">
                    <Text className="text-2xl">?</Text>
                 </View>
                 <Text className="text-2xl text-neutral-300 dark:text-neutral-600 font-light">+</Text>
                 <View className="w-14 h-14 rounded-full bg-neutral-900 dark:bg-white border-4 border-white/20 dark:border-black/20 flex items-center justify-center">
                    <Text className="text-2xl text-white dark:text-black">You</Text>
                 </View>
              </View>
              
              <View className="w-10 h-10 rounded-full bg-black dark:bg-white justify-center items-center">
                  <Text className="text-white dark:text-black">↗</Text>
              </View>
           </View>
        </TouchableOpacity>

        {/* 2. Grid: Interaction & Intimacy (Moved up) */}
        <View className="flex-row gap-3 w-full mb-3">
            {/* Card: Interaction */}
            <TouchableOpacity className="flex-1 bg-[#E0EBE2] dark:bg-[#2A332C] rounded-[24px] p-4 min-h-[140px] justify-between shadow-sm active:opacity-95 relative overflow-hidden">
                <View>
                <Text className="text-[10px] font-bold text-green-800 dark:text-green-200 uppercase tracking-wider mb-2">
                    {translate('bonds.interaction_title')}
                </Text>
                </View>
                
                <View className="flex-row items-center space-x-1 mb-2 opacity-50">
                <View className="w-6 h-6 rounded-full border-2 border-green-800/20" />
                <View className="w-6 h-6 rounded-full border-2 border-green-800/20 -ml-3" />
                </View>

                <Text className="text-sm font-medium text-green-900/70 dark:text-green-100/70 leading-tight">
                {translate('bonds.interaction_desc')}
                </Text>
            </TouchableOpacity>

            {/* Card: Intimacy & Sex */}
            <TouchableOpacity className="flex-1 bg-[#4A2C38] dark:bg-[#583849] rounded-[24px] p-4 min-h-[140px] justify-between shadow-sm active:opacity-95 relative overflow-hidden">
                {/* Decorative Gradient */}
                <View className="absolute top-0 right-0 w-20 h-20 bg-rose-500/20 rounded-full blur-xl" />
                
                <View>
                <Text className="text-[10px] font-bold text-rose-100/70 uppercase tracking-wider mb-1">
                    {translate('bonds.intimacy_title')}
                </Text>
                </View>
                <View>
                <Text className="text-xl mb-1 text-rose-100">🔒</Text>
                <Text className="text-xs text-rose-100/60 leading-tight">
                    {translate('bonds.intimacy_desc')}
                </Text>
                </View>
            </TouchableOpacity>
        </View>

        {/* 3. Card: Friend (Full Width) */}
        <TouchableOpacity className="w-full bg-[#FFFBEB] dark:bg-[#423C26] rounded-[24px] p-5 shadow-sm active:opacity-95 relative overflow-hidden flex-row justify-between items-center mb-3">
            <View className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/30 rounded-full blur-3xl -mr-10 -mt-10" />
            
            <View className="flex-[3] mr-4">
            <Text className="text-xs font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider mb-2">
                {translate('bonds.friend_normal')}
            </Text>
            <Text className="text-base font-serif italic text-yellow-950/80 dark:text-yellow-100/80 leading-relaxed">
                "{translate('bonds.friend_normal_desc')}"
            </Text>
            </View>

            <View className="flex-1 items-end">
            <View className="w-10 h-10 rounded-full bg-yellow-900/10 dark:bg-white/10 flex items-center justify-center">
                <Text className="text-yellow-800 dark:text-yellow-100 text-lg">🤝</Text>
            </View>
            </View>
        </TouchableOpacity>

        {/* 4. Grid: Bestie & Work */}
        <View className="flex-row gap-3 w-full mb-8">
            {/* Card: Bestie (Pink/Warm) */}
            <TouchableOpacity className="flex-1 bg-[#FFF0F5] dark:bg-[#4A2633] rounded-[24px] p-4 min-h-[140px] justify-between shadow-sm active:opacity-95 relative overflow-hidden">
                <View className="absolute -left-4 -bottom-4 w-20 h-20 bg-pink-200/40 rounded-full blur-xl" />
                <View>
                <Text className="text-[10px] font-bold text-pink-800 dark:text-pink-200 uppercase tracking-wider mb-2">
                    {translate('bonds.friend_bestie')}
                </Text>
                </View>
                
                <Text className="text-sm font-medium text-pink-950/80 dark:text-pink-100/80 leading-tight">
                {translate('bonds.friend_bestie_desc')}
                </Text>

                <View className="flex-row justify-end mt-2">
                    <View className="w-6 h-6 rounded-full bg-pink-300/30 flex items-center justify-center">
                    <Text className="text-[10px] text-pink-800 dark:text-pink-200">👯‍♀️</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Card: Work (Blue/Cool) */}
            <TouchableOpacity className="flex-1 bg-[#E6F0F5] dark:bg-[#1E293B] rounded-[24px] p-4 min-h-[140px] justify-between shadow-sm active:opacity-95 relative overflow-hidden">
                <View className="absolute -right-4 -top-4 w-20 h-20 bg-blue-200/40 rounded-full blur-xl" />
                <View>
                <Text className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {translate('bonds.friend_work')}
                </Text>
                </View>
                
                <Text className="text-sm font-medium text-slate-800/80 dark:text-slate-200/80 leading-tight">
                {translate('bonds.friend_work_desc')}
                </Text>

                <View className="flex-row justify-end mt-2">
                    <View className="w-6 h-6 rounded-full bg-slate-300/30 flex items-center justify-center">
                    <Text className="text-[10px] text-slate-800 dark:text-slate-200">💼</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
