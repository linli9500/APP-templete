import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Markdown from 'react-native-markdown-display';

import { Text, View, FocusAwareStatusBar } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';
import { translate } from '@/lib';

// About Us 的 Markdown 内容
// 您可以直接在这里修改内容
const ABOUT_CONTENT = `
# 关于我们

## 我们的使命

我们致力于帮助每个人了解最真实的自己，成为您口袋里的能量补充站。

## 产品介绍

基于底层八字的能量分析，使用 APP 来分析您最底层的人生密码，帮助您解决所有遇到的情绪类问题。

### 核心功能

- 🔮 **深度自我探索** - 了解最真实的自己
- 💆 **情绪解决方案** - 拖延、焦虑、自我否定、不自信等
- 🌟 **能量补充站** - 情感治愈与心理支持
- 📊 **专业分析报告** - 基于科学的心理学分析

## 联系我们

如果您有任何问题或建议，欢迎通过以下方式联系我们：

- 📧 邮箱：support@example.com
- 🌐 官网：https://example.com

---

*感谢您选择我们的产品！*
`;

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

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
              {ABOUT_CONTENT}
            </Markdown>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
