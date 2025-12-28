import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Markdown from 'react-native-markdown-display';

import { Text, View, FocusAwareStatusBar } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';
import { translate } from '@/lib';

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // 使用翻译动态生成 Markdown 内容
  const aboutContent = `
# ${translate('about.title')}

## ${translate('about.mission_title')}

${translate('about.mission_content')}

## ${translate('about.product_title')}

${translate('about.product_content')}

### ${translate('about.features_title')}

- 🔮 **${translate('about.feature_1_title')}** - ${translate('about.feature_1_desc')}
- 💆 **${translate('about.feature_2_title')}** - ${translate('about.feature_2_desc')}
- 🌟 **${translate('about.feature_3_title')}** - ${translate('about.feature_3_desc')}
- 📊 **${translate('about.feature_4_title')}** - ${translate('about.feature_4_desc')}

## ${translate('about.contact_title')}

${translate('about.contact_content')}

- 📧 ${translate('about.email_label')}：support@example.com
- 🌐 ${translate('about.website_label')}：https://example.com

---

*${translate('about.thanks')}*
`;

  // Markdown 样式
  const markdownStyles = {
    body: {
      color: isDark ? '#E5E5E5' : '#262626',
      fontSize: 16,
      lineHeight: 26,
    },
    heading1: {
      color: isDark ? '#FFFFFF' : '#000000',
      fontSize: 28,
      fontWeight: '700' as const,
      marginBottom: 16,
      marginTop: 24,
    },
    heading2: {
      color: isDark ? '#FFFFFF' : '#000000',
      fontSize: 22,
      fontWeight: '600' as const,
      marginBottom: 12,
      marginTop: 20,
    },
    heading3: {
      color: isDark ? '#FFFFFF' : '#000000',
      fontSize: 18,
      fontWeight: '600' as const,
      marginBottom: 8,
      marginTop: 16,
    },
    paragraph: {
      marginBottom: 12,
    },
    bullet_list: {
      marginBottom: 12,
    },
    bullet_list_icon: {
      color: isDark ? '#A3A3A3' : '#737373',
      marginRight: 8,
    },
    list_item: {
      marginBottom: 8,
    },
    strong: {
      fontWeight: '600' as const,
      color: isDark ? '#FFFFFF' : '#000000',
    },
    em: {
      fontStyle: 'italic' as const,
      color: isDark ? '#A3A3A3' : '#737373',
    },
    hr: {
      backgroundColor: isDark ? '#404040' : '#D4D4D4',
      height: 1,
      marginVertical: 20,
    },
    link: {
      color: '#3B82F6',
    },
    code_inline: {
      backgroundColor: isDark ? '#262626' : '#F5F5F5',
      color: isDark ? '#E5E5E5' : '#262626',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900" style={{ paddingTop: insets.top }}>
        <FocusAwareStatusBar />
        
        {/* 自定义导航栏 */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-8 h-8 rounded-full bg-black dark:bg-neutral-800 justify-center items-center"
            style={{ transform: [{ rotate: '180deg' }] }}
          >
            <ArrowRight color="white" width={16} height={16} />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-black dark:text-white flex-1 text-center pr-8">
            {translate('settings.about')}
          </Text>
        </View>

        {/* 内容区 */}
        <ScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm">
            <Markdown style={markdownStyles}>
              {aboutContent}
            </Markdown>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
