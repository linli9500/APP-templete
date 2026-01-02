import * as React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

// 风图标 - 极简线条，用于「焦虑」情绪
export const Wind = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9.59 4.59A2 2 0 1 1 11 8H2"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.59 19.41A2 2 0 1 0 14 16H2"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
