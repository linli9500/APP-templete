import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface InstagramIconProps {
  width?: number;
  height?: number;
  color?: string;
}

/**
 * Instagram 图标
 * 支持单色和渐变两种模式
 */
export const Instagram = ({
  width = 24,
  height = 24,
  color,
}: InstagramIconProps) => {
  // 如果指定了颜色，使用单色模式
  if (color) {
    return (
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Rect
          x={2}
          y={2}
          width={20}
          height={20}
          rx={5}
          stroke={color}
          strokeWidth={2}
        />
        <Path
          d="M12 8a4 4 0 100 8 4 4 0 000-8z"
          stroke={color}
          strokeWidth={2}
        />
        <Path
          d="M17.5 6.5h.01"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  // 默认使用 Instagram 品牌渐变色
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FFDC80" />
          <Stop offset="25%" stopColor="#F77737" />
          <Stop offset="50%" stopColor="#E1306C" />
          <Stop offset="75%" stopColor="#C13584" />
          <Stop offset="100%" stopColor="#833AB4" />
        </LinearGradient>
      </Defs>
      <Rect
        x={2}
        y={2}
        width={20}
        height={20}
        rx={5}
        stroke="url(#instagram-gradient)"
        strokeWidth={2}
      />
      <Path
        d="M12 8a4 4 0 100 8 4 4 0 000-8z"
        stroke="url(#instagram-gradient)"
        strokeWidth={2}
      />
      <Path
        d="M17.5 6.5h.01"
        stroke="url(#instagram-gradient)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Instagram;
