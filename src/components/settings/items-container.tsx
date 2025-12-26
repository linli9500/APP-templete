import React from 'react';

import { Text, View } from '@/components/ui';
import type { TxKeyPath } from '@/lib';

type Props = {
  children: React.ReactNode;
  title?: TxKeyPath;
};

export const ItemsContainer = ({ children, title }: Props) => {
  return (
    <View className="mb-6">
      {title && (
        <Text 
          className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 ml-1" 
          tx={title} 
        />
      )}
      <View className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        {children}
      </View>
    </View>
  );
};
