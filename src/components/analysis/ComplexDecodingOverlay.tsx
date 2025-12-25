import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing, 
  withSequence,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Text } from '@/components/ui/text';

const { width, height } = Dimensions.get('window');
const COLUMN_Count = 15;
const COLUMN_WIDTH = width / COLUMN_Count;

// Random characters for the "Matrix" effect
const CHARS = 'WTCHXQZ8491010010101アイウエオカキクケコサシスセソタチツテトナニヌネノ';

const FallingColumn = ({ delay, duration, x }: { delay: number, duration: number, x: number }) => {
  const translateY = useSharedValue(-height);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(height, { duration, easing: Easing.linear }),
        withTiming(-height, { duration: 0 }) // Instant reset
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: 0.3,
  }));

  // Generate random string for this column
  const text = useMemo(() => {
    return Array.from({ length: 20 }).map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('\n');
  }, []);

  return (
    <Animated.View style={[styles.column, style, { left: x }]}>
      <Text style={styles.matrixText}>{text}</Text>
    </Animated.View>
  );
};

export const ComplexDecodingOverlay = () => {
    const [progress, setProgress] = useState(0);
    
    // Simulate progress
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Non-linear progress simulation
                const jump = Math.random() * 5;
                return Math.min(p + jump, 100);
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
      <View style={styles.container}>
        {/* Dark Background */}
        <View style={StyleSheet.absoluteFill} className="bg-black" />

        {/* Matrix Rain Effect */}
        <View style={StyleSheet.absoluteFill}>
           {Array.from({ length: COLUMN_Count }).map((_, i) => (
             <FallingColumn 
               key={i} 
               x={i * COLUMN_WIDTH} 
               delay={Math.random() * 2000}
               duration={2000 + Math.random() * 3000} 
             />
           ))}
        </View>

        {/* Blur overlay for focus */}
        <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />

        {/* Central HUD */}
        <View style={styles.centerContainer}>
            <View style={styles.circleContainer}>
                <Animated.View style={[styles.circleRing, { transform: [{ rotate: '45deg'}] }]} />
            </View>

            <Text className="text-white text-4xl font-black mb-2 tracking-widest">
                {Math.round(progress)}%
            </Text>
            <Text className="text-neutral-400 text-xs font-mono tracking-widest uppercase">
                Systems Synchronizing...
            </Text>
            
            {/* Progress Bar Line */}
            <View className="w-48 h-1 bg-neutral-800 mt-6 rounded-full overflow-hidden">
                <View className="h-full bg-white" style={{ width: `${progress}%` }} />
            </View>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  column: {
    position: 'absolute',
    top: 0,
    width: COLUMN_WIDTH,
  },
  matrixText: {
    color: '#0F0', // Classic Matrix Green or define White for modern look
    fontSize: 14,
    fontFamily: 'System', // Use mono if available
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
      position: 'absolute',
      width: 200,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.2
  },
  circleRing: {
      width: 180,
      height: 180,
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 90,
      borderStyle: 'dashed'
  }
});
