import * as React from 'react';
import Svg, { Path, Circle, type SvgProps } from 'react-native-svg';

// Insight 图标 - 抽象眼睛，象征内在洞察与自我解码
export const Insight = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2 12C2 12 6 5 12 5C18 5 22 12 22 12C22 12 18 19 12 19C6 19 2 12 2 12Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx={12}
      cy={12}
      r={3}
      stroke={color}
      strokeWidth={1.5}
    />
  </Svg>
);
