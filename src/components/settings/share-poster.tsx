import { Env } from '@env';
import React, { forwardRef } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Text } from '@/components/ui';
import { PatternLogo } from '@/components/ui/pattern-logo';
import { translate } from '@/lib';

export const SharePoster = forwardRef<View, { className?: string }>(
  ({ className }, ref) => {
    const websiteUrl = Env.WEBSITE_URL || 'https://vibefox.app';

    return (
      <View
        ref={ref}
        className={`bg-white dark:bg-neutral-900 items-center justify-center p-8 rounded-3xl ${className}`}
        style={{ width: 320, height: 480 }}
      >
        {/* Branding / Logo */}
        <View className="items-center mb-8">
            <View className="mb-6 shadow-sm">
                <PatternLogo width={80} height={80} color="black" /> 
                {/* Note: dynamic color handling might be needed if dark mode card export is desired,
                    but usually white card looks best for sharing. 
                    Let's stick to a specific clean style (e.g., White card) for consistency when sharing, 
                    or adapt. Let's force light mode for the card to ensure contrast if we want a classic look,
                    or adapt. 
                    Let's adapt: The outer View has dark:bg-neutral-900.
                */}
            </View>
            <Text className="text-3xl font-bold text-black dark:text-white mb-2 font-inter tracking-tight">
                {Env.APP_NAME || 'VibeFox'}
            </Text>
            <Text className="text-center text-neutral-500 dark:text-neutral-400 text-sm px-4">
                {translate('auth.fortune_subtitle')}
            </Text>
        </View>

        {/* QR Code Section */}
        <View className="items-center bg-white p-4 rounded-xl shadow-sm mb-4">
            <QRCode 
                value={websiteUrl} 
                size={140} 
                color="black" 
                backgroundColor="white" 
            />
        </View>

        {/* Website Link */}
        <View className="mt-2">
            <Text className="text-neutral-400 dark:text-neutral-500 text-xs font-medium tracking-wide">
                {websiteUrl.replace(/^https?:\/\//, '')}
            </Text>
        </View>
        
        {/* Footer/Decor */}
        <View className="absolute bottom-4">
            <Text className="text-[10px] text-neutral-300 dark:text-neutral-600 uppercase tracking-widest">
                Discover Your Truth
            </Text>
        </View>
      </View>
    );
  }
);
