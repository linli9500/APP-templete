import * as React from 'react';
import { useColorScheme } from 'nativewind';

import { Pressable, Text, View } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';
import type { TxKeyPath } from '@/lib';

type ItemProps = {
  text: TxKeyPath;
  value?: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  textColor?: string;
};

export const Item = ({ text, value, icon, onPress, textColor }: ItemProps) => {
  const isPressable = onPress !== undefined;
  const { colorScheme } = useColorScheme();
  const arrowColor = colorScheme === 'dark' ? '#A3A3A3' : '#737373';

  return (
    <Pressable
      onPress={onPress}
      pointerEvents={isPressable ? 'auto' : 'none'}
      className="flex-1 flex-row items-center justify-between px-4 py-3.5"
    >
      <View className="flex-row items-center flex-1">
        {icon && (
          <View className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 items-center justify-center mr-3">
            {icon}
          </View>
        )}
        <Text 
          tx={text} 
          className={textColor || 'text-neutral-800 dark:text-neutral-100'}
        />
      </View>
      <View className="flex-row items-center">
        {value && (
          <Text className="text-neutral-500 dark:text-neutral-400 text-sm mr-2">
            {value}
          </Text>
        )}
        {isPressable && (
          <ArrowRight color={arrowColor} width={16} height={16} />
        )}
      </View>
    </Pressable>
  );
};
