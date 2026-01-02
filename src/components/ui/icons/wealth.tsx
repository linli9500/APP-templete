import * as React from 'react';
import Svg, { Path, Circle, type SvgProps } from 'react-native-svg';

// 财富图标 - 极简线条，用于 Insight 财富模块
export const Wealth = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle
      cx={12}
      cy={12}
      r={9}
      stroke={color}
      strokeWidth={1.5}
    />
    <Path
      d="M12 6V18"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M15 9.5C15 8.11929 13.6569 7 12 7C10.3431 7 9 8.11929 9 9.5C9 10.8807 10.3431 12 12 12C13.6569 12 15 13.1193 15 14.5C15 15.8807 13.6569 17 12 17C10.3431 17 9 15.8807 9 14.5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
