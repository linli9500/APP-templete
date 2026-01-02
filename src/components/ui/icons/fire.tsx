import * as React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

// 火焰图标 - 极简线条，用于「愤怒/怨气」情绪
export const Fire = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 22C8.13 22 5 18.87 5 15C5 11.74 7.21 8.42 9 6.5C9 8.5 10 10.5 12 11C12 8 14 5 16 3C16.5 6 19 9 19 13C19 18 15.87 22 12 22Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 22C10.34 22 9 20.21 9 18C9 16.5 10 15 11 14C11.5 15.5 12 16 13 16C13 14 14 12.5 15 11.5C15.5 13 16 14.5 16 16C16 19.5 14 22 12 22Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
