import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, FocusAwareStatusBar } from '@/components/ui';
import { translate } from '@/lib';
import { PatternLogo } from '@/components/ui/pattern-logo';
import { Link, useRouter } from 'expo-router';
import { Settings as SettingsIcon } from '@/components/ui/icons';

// Placeholder icons for Bookmark and Target
const BookmarkIcon = ({ color }: { color: string }) => (
  <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
     <View style={{ width: 10, height: 12, backgroundColor: color }} /> 
  </View>
);

const TargetIcon = ({ color }: { color: string }) => (
  <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
     <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} /> 
  </View>
);

export default function YouPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 100 }}
      >
        {/* Header Section */}
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-row items-center space-x-3">
            <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 justify-center items-center">
               <PatternLogo width={48} height={48} color="black" />
            </View>
            {/* <Text className="text-lg font-medium text-black dark:text-white">@user.name</Text> */}
          </View>
          <View className="flex-row space-x-4">
            <Link href="/options" asChild>
              <TouchableOpacity className="p-2 bg-white dark:bg-neutral-800 rounded-full shadow-sm">
                 <SettingsIcon color="black" width={20} height={20} /> 
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Title */}
        <Text className="text-4xl font-bold text-black dark:text-white font-inter tracking-tight mb-2">
          {translate('you.title')}
        </Text>
        <Text className="text-base text-gray-500 dark:text-neutral-400 font-inter mb-6">
          {translate('you.subtitle')}
        </Text>

        {/* Action Pills */}
        <View className="flex-row flex-wrap gap-2 mb-8">
          <TouchableOpacity className="bg-black dark:bg-white rounded-full px-5 py-2.5">
            <Text className="text-white dark:text-black font-medium text-sm">{translate('you.view_friends')}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-black dark:bg-white rounded-full px-5 py-2.5">
            <Text className="text-white dark:text-black font-medium text-sm">{translate('you.run_bond')}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-black dark:bg-white rounded-full px-5 py-2.5">
            <Text className="text-white dark:text-black font-medium text-sm">{translate('you.add_custom_friend')}</Text>
          </TouchableOpacity>
        </View>

        {/* Feature Card */}
        <View className="bg-[#93C5FD] dark:bg-blue-900 rounded-[20px] p-6 mb-4 relative overflow-hidden">
          <View className="flex-row justify-between items-start mb-4">
             <View className="bg-black dark:bg-white px-3 py-1 rounded-lg flex-row items-center space-x-1">
                <Text className="text-white dark:text-black text-xs font-bold">★ {translate('you.new_tag')}</Text>
             </View>
             <TouchableOpacity>
               <Text className="text-xl text-black dark:text-white">✕</Text>
             </TouchableOpacity>
          </View>
          
          <Text className="text-sm font-medium text-black/70 dark:text-white/70 mb-1">{translate('you.wound_subtitle')}</Text>
          <Text className="text-3xl font-bold text-black dark:text-white mb-4 leading-tight">{translate('you.wound_title')}</Text>
          <Text className="text-base text-black/80 dark:text-white/80 leading-relaxed mb-6">
            {translate('you.wound_desc')}
          </Text>

          <TouchableOpacity className="bg-black dark:bg-white self-start px-6 py-3 rounded-full">
            <Text className="text-white dark:text-black font-bold text-sm">{translate('you.listen_now')}</Text>
          </TouchableOpacity>
        </View>

        {/* Grid Cards */}
        <View className="flex-row justify-between space-x-4 mb-8">
           <View className="flex-1 bg-[#F0EBE6] dark:bg-neutral-800 rounded-[20px] p-5 aspect-square justify-center">
              <Text className="text-2xl font-bold text-black dark:text-white leading-tight">
                {translate('you.your_pattern')}
              </Text>
           </View>
           <View className="flex-1 bg-[#AECBC9] dark:bg-teal-900 rounded-[20px] p-5 aspect-square justify-center">
              <Text className="text-2xl font-bold text-black dark:text-white leading-tight">
                {translate('you.impacting_you')}
              </Text>
           </View>
        </View>

      </ScrollView>
    </View>
  );
}
