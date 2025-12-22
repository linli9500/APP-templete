/* eslint-disable react/react-in-jsx-scope */
import { Env } from '@env';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { LanguageItem } from '@/components/settings/language-item';
import { ThemeItem } from '@/components/settings/theme-item';
import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { Github, Rate, Share, Support, Website } from '@/components/ui/icons';
import { translate } from '@/lib';
import { useSupabase } from '@/hooks/use-supabase';
import { checkAppUpdate } from '@/lib/updates';
import { review } from '@/lib/review';

export default function Settings() {
  const router = useRouter();
  const { signOut } = useSupabase();
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];
  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-16 ">
          <Text className="text-xl font-bold">
            {translate('settings.title')}
          </Text>
          <ItemsContainer title="settings.generale">
            <LanguageItem />
            <ThemeItem />
          </ItemsContainer>

          <ItemsContainer title="settings.about">
            <Item text="settings.app_name" value={Env.NAME} />
            <Item text="settings.version" value={Env.VERSION} />
            <Item 
              text="settings.check_updates" 
              icon={<Share color={iconColor} />} 
              onPress={() => checkAppUpdate(true)} 
            />
          </ItemsContainer>

          <ItemsContainer title="settings.support_us">
            <Item
              text="settings.share"
              icon={<Share color={iconColor} />}
              onPress={() => {}}
            />
            <Item
              text="settings.rate"
              icon={<Rate color={iconColor} />}
              onPress={() => review.requestReview()}
            />
          </ItemsContainer>

          <ItemsContainer title="settings.links">
            <Item 
              text="settings.privacy" 
              // @ts-ignore
              onPress={() => router.push({ pathname: '/webview', params: { url: 'https://google.com', title: 'Privacy Policy' } })} 
            />
            <Item 
              text="settings.terms" 
              // @ts-ignore
              onPress={() => router.push({ pathname: '/webview', params: { url: 'https://google.com', title: 'Terms of Service' } })} 
            />
            <Item
              text="settings.github"
              icon={<Github color={iconColor} />}
              onPress={() => {}}
            />
            <Item
              text="settings.website"
              icon={<Website color={iconColor} />}
              onPress={() => {}}
            />
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item text="settings.logout" onPress={signOut} />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
