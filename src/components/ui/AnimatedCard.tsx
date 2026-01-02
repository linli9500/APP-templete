import React, { useEffect } from 'react';
import { ViewProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface AnimatedCardProps extends ViewProps {
  /** 动画延迟时间（毫秒），用于实现错落进入效果 */
  delay?: number;
  /** 动画持续时间（毫秒） */
  duration?: number;
  /** 初始Y轴偏移量 */
  translateY?: number;
  /** 子元素 */
  children: React.ReactNode;
  /** 样式 */
  style?: StyleProp<ViewStyle>;
  /** 类名（NativeWind） */
  className?: string;
}

/**
 * 卡片进入动画组件
 * 提供淡入 + 上滑动画效果，支持延迟以实现错落进入
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  delay = 0,
  duration = 600,
  translateY = 30,
  children,
  style,
  className,
  ...props
}) => {
  // 透明度动画值
  const opacity = useSharedValue(0);
  // Y轴位移动画值
  const yOffset = useSharedValue(translateY);

  useEffect(() => {
    // 启动动画（带延迟）
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
    yOffset.value = withDelay(
      delay,
      withTiming(0, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [delay, duration, opacity, yOffset]);

  // 动画样式
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: yOffset.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={className} {...props}>
      {children}
    </Animated.View>
  );
};
