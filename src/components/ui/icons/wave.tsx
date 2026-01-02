import * as React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

// 水波图标 - 极简线条，用于「孤独」情绪
export const Wave = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2 6C4 4 6 4 8 6C10 8 12 8 14 6C16 4 18 4 20 6C22 8 22 8 22 8"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12C4 10 6 10 8 12C10 14 12 14 14 12C16 10 18 10 20 12C22 14 22 14 22 14"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 18C4 16 6 16 8 18C10 20 12 20 14 18C16 16 18 16 20 18C22 20 22 20 22 20"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
