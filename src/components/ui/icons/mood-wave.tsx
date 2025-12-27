import * as React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

// Mood 图标 - 波纹/水波，象征情绪的流动与起伏
export const MoodWave = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2 8C4 5 8 5 12 8C16 11 20 11 22 8"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M2 12C4 9 8 9 12 12C16 15 20 15 22 12"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M2 16C4 13 8 13 12 16C16 19 20 19 22 16"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
