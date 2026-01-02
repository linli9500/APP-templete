import * as React from 'react';
import Svg, { Path, Rect, Circle, type SvgProps } from 'react-native-svg';

// 锁图标 - 极简线条，用于 Bonds 亲密关系卡片
export const Lock = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect
      x={5}
      y={11}
      width={14}
      height={10}
      rx={2}
      stroke={color}
      strokeWidth={1.5}
    />
    <Path
      d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Circle
      cx={12}
      cy={16}
      r={1.5}
      stroke={color}
      strokeWidth={1.5}
    />
  </Svg>
);
