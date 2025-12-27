import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  runOnJS, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  FadeInDown 
} from 'react-native-reanimated';

import { Text } from '@/components/ui/text';

interface AppSplashProps {
  onFinish: () => void;
  shouldHide: boolean;
}

import { translate } from '@/lib/i18n';

// ...

// ...

export function AppSplash({ onFinish, shouldHide }: AppSplashProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (shouldHide) {
      // 当收到隐藏信号时，执行淡出动画
      opacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      });
    }
  }, [shouldHide]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const logoSource = require('../../assets/logo.png');

  // 标签配置

  const tags = [
    { label: translate('splash.tag_1'), color: '#6366F1', bg: '#EEF2FF' }, // Indigo (智慧/深度)
    { label: translate('splash.tag_2'), color: '#EC4899', bg: '#FDF2F8' }, // Pink (情感/连接)
    { label: translate('splash.tag_3'), color: '#14B8A6', bg: '#F0FDFA' }, // Teal (治愈/平衡)
  ];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.centerContent}>
        <Image
          source={logoSource}
          style={styles.logo}
          contentFit="contain"
        />
        <View style={styles.sloganContainer}>
          <Text className="text-center text-xl font-bold text-black leading-8 tracking-wide">
            {translate('splash.slogan_1')}
          </Text>
          <Text className="mt-1 text-center text-xl font-bold text-black leading-8 tracking-wide">
            {translate('splash.slogan_2')}
          </Text>
        </View>

        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <Animated.View 
              key={index}
              entering={FadeInDown.delay(300 + index * 100).springify()}
              style={[styles.tagPill, { backgroundColor: tag.color }]} 
            >
              <Text style={styles.tagText}>{tag.label}</Text>
            </Animated.View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5F5F0',
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  sloganContainer: {
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12, // 标签之间的间距
    marginTop: 32, // 距离 Slogan 的距离
  },
  tagPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999, // 胶囊形状
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android 阴影
  },
  tagText: {
    color: '#F5F5F0', // 白色字体
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
