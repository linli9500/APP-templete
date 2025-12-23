import { Env } from '@env';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { LanguageItem } from '@/components/settings/language-item';
import { ThemeItem } from '@/components/settings/theme-item';
import { FocusAwareStatusBar, Text } from '@/components/ui';
import { Share, Support, Website, Rate } from '@/components/ui/icons';
import { translate } from '@/lib';
import { useSupabase } from '@/hooks/use-supabase';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Settings() {
  const { signOut } = useSupabase();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900 px-4" style={{ paddingTop: insets.top }}>
      <FocusAwareStatusBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="text-3xl font-bold text-black dark:text-white mb-6 pl-2 pt-4">
          {translate('settings.title')}
        </Text>
        
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

        <View className="mt-6 mb-4">
          <ItemsContainer>
            <Item text="settings.logout" onPress={signOut} />
          </ItemsContainer>
        </View>

        <View className="my-8 items-center">
          <Text className="text-sm text-gray-400 dark:text-neutral-500">
            v{Env.VERSION ?? '1.0.0'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
