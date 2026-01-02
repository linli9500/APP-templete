import React, { useEffect } from 'react';
import { ViewStyle, StyleProp, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

// 预定义的光晕颜色方案（与五行/情绪对应）
export const GlowColors = {
  // 火/愤怒 - 红橙色
  fire: 'rgba(248, 113, 113, 0.25)',
  // 水/孤独 - 蓝色
  water: 'rgba(147, 197, 253, 0.25)',
  // 风/焦虑 - 青色
  wind: 'rgba(94, 234, 212, 0.25)',
  // 土/停滞 - 紫色
  earth: 'rgba(192, 132, 252, 0.25)',
  // 金/倦怠 - 石色
  metal: 'rgba(168, 162, 158, 0.25)',
  // 爱情/关系 - 玫瑰色
  love: 'rgba(251, 182, 206, 0.25)',
  // 财富 - 绿色
  wealth: 'rgba(134, 239, 172, 0.25)',
  // 友谊 - 黄色
  friend: 'rgba(253, 224, 71, 0.25)',
  // 工作 - 蓝灰色
  work: 'rgba(148, 163, 184, 0.25)',
  // 能量/核心 - 紫黄渐变模拟
  energy: 'rgba(250, 204, 21, 0.25)',
} as const;

export type GlowColorKey = keyof typeof GlowColors;

interface AnimatedGlowProps {
  /** 光晕颜色（可使用预定义颜色键或自定义rgba） */
  color?: GlowColorKey | string;
  /** 光晕尺寸：small/medium/large */
  size?: 'small' | 'medium' | 'large';
  /** 呼吸动画周期（毫秒） */
  breathDuration?: number;
  /** 位置（absolute定位） */
  position?: {
    top?: DimensionValue;
    right?: DimensionValue;
    bottom?: DimensionValue;
    left?: DimensionValue;
  };
  /** 额外样式 */
  style?: StyleProp<ViewStyle>;
  /** 类名（NativeWind） */
  className?: string;
}

// 尺寸映射
const sizeMap = {
  small: { width: 80, height: 80 },
  medium: { width: 128, height: 128 },
  large: { width: 192, height: 192 },
};

/**
 * 动画光晕组件
 * 提供缓慢的呼吸脉动效果，统一的光晕样式
 */
export const AnimatedGlow: React.FC<AnimatedGlowProps> = ({
  color = 'energy',
  size = 'medium',
  breathDuration = 4000,
  position,
  style,
  className,
}) => {
  // 透明度呼吸动画
  const opacity = useSharedValue(0.6);
  // 缩放呼吸动画
  const scale = useSharedValue(1);

  useEffect(() => {
    // 透明度呼吸：0.6 -> 1 -> 0.6
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: breathDuration / 2,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0.6, {
          duration: breathDuration / 2,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1, // 无限循环
      false
    );

    // 缩放呼吸：1 -> 1.1 -> 1
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, {
          duration: breathDuration / 2,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(1, {
          duration: breathDuration / 2,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      false
    );
  }, [breathDuration, opacity, scale]);

  // 动画样式
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // 解析颜色
  const backgroundColor = color in GlowColors 
    ? GlowColors[color as GlowColorKey] 
    : color;

  // 尺寸
  const dimensions = sizeMap[size];

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          ...dimensions,
          borderRadius: dimensions.width / 2,
          backgroundColor,
          // 使用 shadowRadius 模拟 blur 效果（React Native 不支持 blur）
          // 实际模糊效果通过组件本身的透明色和重叠实现
          ...position,
        },
        animatedStyle,
        style,
      ]}
      className={className}
      // 禁用触摸事件
      pointerEvents="none"
    />
  );
};
