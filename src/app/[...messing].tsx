import { Link, Stack, useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

import { Text, FocusAwareStatusBar } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';
import { translate } from '@/lib';

export default function NotFoundScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

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
            Oops!
          </Text>
        </View>

        {/* 内容区 */}
        <View className="flex-1 items-center justify-center px-6">
          {/* 图标 */}
          <View className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-800 items-center justify-center mb-6">
            <Text className="text-5xl">🔍</Text>
          </View>
          
          <Text className="text-2xl font-bold text-black dark:text-white text-center mb-3">
            {translate('common.page_not_found') || '页面不存在'}
          </Text>
          
          <Text className="text-base text-neutral-500 dark:text-neutral-400 text-center mb-8">
            {translate('common.page_not_found_desc') || '您访问的页面可能已被移除或暂时不可用'}
          </Text>

          {/* 返回首页按钮 */}
          <Link href="/" asChild>
            <TouchableOpacity 
              className="bg-black dark:bg-white px-8 py-4 rounded-full"
              activeOpacity={0.8}
            >
              <Text className="text-white dark:text-black font-bold text-base">
                {translate('common.go_home') || '返回首页'}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
}
