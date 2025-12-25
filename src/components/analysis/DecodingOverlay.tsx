import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, withRepeat, withSequence, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import { BlurView } from 'expo-blur';

export const DecodingOverlay = () => {
  const [step, setStep] = useState(0);
  
  const KEYWORDS = [
    'INITIALIZING_CORE...',
    'SYNCING_SUB-CONSCIOUS_DATA...',
    'DECRYPTING_BIO-RHYTHMS...',
    'ANALYZING_ARCHETYPES...',
    'GENERATING_PSYCH_PROFILE...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % KEYWORDS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(100, { duration: 8000 });
  }, []);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  const blinkStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(withSequence(withTiming(0, { duration: 500 }), withTiming(1, { duration: 500 })), -1, true),
    };
  });

  return (
    <View style={styles.container}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut}>
            <Text className="text-3xl font-bold text-white tracking-widest text-center mb-8 uppercase">
               Decoding
            </Text>
        </Animated.View>
        
        <View style={styles.terminalContainer}>
           <Animated.Text 
             key={step} 
             entering={FadeIn.duration(300)} 
             exiting={FadeOut.duration(300)}
             style={styles.terminalText}
           >
             {`> ${KEYWORDS[step]}`}
           </Animated.Text>
           <Animated.View style={[styles.cursor, blinkStyle]} />
        </View>

        <View style={styles.progressBarContainer}>
           <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
        
        <Text className="text-neutral-400 text-xs mt-2 font-mono">
           ESTIMATED TIME: 8.0s
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  terminalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 40,
  },
  terminalText: {
    fontFamily: 'Courier', 
    fontSize: 14,
    color: 'white',
  },
  cursor: {
    width: 8,
    height: 16,
    backgroundColor: 'white',
    marginLeft: 4,
  },
  progressBarContainer: {
    width: '100%',
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
  },
});
