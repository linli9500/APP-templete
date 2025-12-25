import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence, useAnimatedProps } from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import Markdown from 'react-native-markdown-display';

interface StreamReportProps {
  content: string;
  isEffectActive: boolean;
  isLoading: boolean;
}

export const StreamReport = ({ content, isEffectActive }: StreamReportProps) => {
  const spin = useSharedValue(0);

  useEffect(() => {
    if (isEffectActive) {
      spin.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [isEffectActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${spin.value}deg` }],
      opacity: isEffectActive ? 1 : 0,
    };
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
       {/* Use Markdown renderer if possible, or simple Text for starters */}
       <Markdown style={markdownStyles}>
          {content}
       </Markdown>

       {isEffectActive && (
         <View style={styles.loadingFooter}>
            <View style={styles.cursorBlock} />
            <Animated.View style={[styles.spinner, animatedStyle]}>
               <View style={styles.spinnerLine} />
            </Animated.View>
            <Text className="text-neutral-500 text-xs ml-2">
               更多深度分析正在解码中...
            </Text>
         </View>
       )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0', // Beige background as per design rules
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E0',
  },
  cursorBlock: {
    width: 10,
    height: 18,
    backgroundColor: 'black',
    marginRight: 8,
  },
  spinner: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerLine: {
    width: 2,
    height: 12,
    backgroundColor: 'black', 
  }
});

const markdownStyles = {
  body: {
    color: 'black',
    fontSize: 16,
    lineHeight: 28,
    fontFamily: 'System', 
  },
  heading1: {
      fontSize: 28,
      marginBottom: 16,
      color: 'black',
      fontWeight: 'bold',
  },
  heading2: {
      fontSize: 22,
      marginBottom: 12,
      marginTop: 24,
      color: 'black', 
      fontWeight: '600',
  },
  paragraph: {
      marginBottom: 16,
  }
};
