import * as React from 'react';
import Svg, { Path, Rect, type SvgProps } from 'react-native-svg';

// 电池/能量图标 - 极简线条，用于「倦怠」情绪
export const Battery = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect
      x={2}
      y={7}
      width={18}
      height={10}
      rx={2}
      stroke={color}
      strokeWidth={1.5}
    />
    <Path
      d="M22 10V14"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M6 10V14"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M10 10V14"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
