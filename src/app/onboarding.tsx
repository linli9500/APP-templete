import { useRouter } from 'expo-router';
import React from 'react';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
  PatternLogo,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center justify-center bg-pattern-bg px-6">
      <FocusAwareStatusBar />
      <View className="flex-1 w-full justify-center items-center">
        <View className="mb-12 scale-150">
           <PatternLogo width={120} height={120} color="#000000" />
        </View>
        <Text className="my-4 text-center text-4xl font-bold uppercase tracking-[4px] text-black">
          Fortune
        </Text>
        <Text className="mb-8 text-center text-base uppercase tracking-widest text-neutral-500 font-medium">
          Your Personal Manual for Life
        </Text>

        <View className="space-y-6 w-full px-4">
            <View className="flex-row items-center space-x-4">
                <Text className="text-xl">✨</Text>
                <Text className="text-lg font-medium text-neutral-800">Explore your personality traits</Text>
            </View>
             <View className="flex-row items-center space-x-4">
                <Text className="text-xl">🪐</Text>
                <Text className="text-lg font-medium text-neutral-800">Understand your relationships</Text>
            </View>
             <View className="flex-row items-center space-x-4">
                <Text className="text-xl">⏳</Text>
                <Text className="text-lg font-medium text-neutral-800">Navigate key life timings</Text>
            </View>
        </View>
      </View>
      <SafeAreaView className="mt-6 w-full max-w-sm">
        <Button
          label="BEGIN YOUR JOURNEY"
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
          textClassName="uppercase tracking-widest text-sm font-bold"
        />
      </SafeAreaView>
    </View>
  );
}
