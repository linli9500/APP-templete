import { Env } from '@env';
import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { LanguageItem } from '@/components/settings/language-item';
import { ThemeItem } from '@/components/settings/theme-item';
import { Text, FocusAwareStatusBar } from '@/components/ui';
import { Share, Support, Website, Rate, ArrowRight } from '@/components/ui/icons';
import { translate } from '@/lib';
import { useSupabase } from '@/hooks/use-supabase';

const BackIcon = () => (
    <View className="w-10 h-10 rounded-full bg-black dark:bg-neutral-800 justify-center items-center">
        <ArrowRight color="white" className="rotate-180" />
    </View>
);

export default function Options() {
  const { signOut, session } = useSupabase();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900 px-6" style={{ paddingTop: insets.top }}>
        <FocusAwareStatusBar />
        
        {/* Custom Header */}
        <View className="flex-row items-center justify-between mt-6 mb-8">
            <TouchableOpacity onPress={() => router.back()}>
                <View className="w-8 h-8 rounded-full bg-black dark:bg-neutral-800 justify-center items-center" style={{ transform: [{ rotate: '180deg' }] }}>
                    <ArrowRight color="white" width={16} height={16} />
                </View>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black dark:text-white flex-1 text-center pr-8">
                {translate('settings.title')}
            </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <ItemsContainer title="settings.account_preferences">
            <ThemeItem />
            <LanguageItem />
          </ItemsContainer>

          <ItemsContainer title="settings.generale">
            <Item text="settings.website" icon={<Website color={iconColor} />} />
            <Item text="settings.rate" icon={<Rate color={iconColor} />} />
            <Item text="settings.share" icon={<Share color={iconColor} />} />
          </ItemsContainer>
          
          <ItemsContainer title="settings.legal">
            <Item text="settings.privacy" onPress={() => {}} />
            <Item text="settings.terms" onPress={() => {}} />
          </ItemsContainer>

          <ItemsContainer title="settings.support">
            <Item text="settings.support" icon={<Support color={iconColor} />} />
          </ItemsContainer>


          {session && (
            <View className="mt-8 mb-4 items-center">
               <TouchableOpacity 
                  onPress={async () => {
                     await signOut();
                     // Force navigation to ensure immediate feedback
                     router.replace('/login');
                  }}
                  className="bg-black dark:bg-white rounded-full py-3 px-8 min-w-[150px] items-center"
               >
                  <Text className="text-white font-bold text-base">{translate('settings.logout')}</Text>
               </TouchableOpacity>
            </View>
          )}

          <View className="items-center mb-8">
            <Text className="text-sm text-gray-400 dark:text-neutral-500 font-medium">
              {Env.VERSION ?? '1.0.0'} (594)
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
