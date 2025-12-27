import * as React from 'react';
import Svg, { Circle, type SvgProps } from 'react-native-svg';

// Connections 图标 - 双环交叠，象征人与人的连结
export const Connections = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle
      cx={9}
      cy={12}
      r={6}
      stroke={color}
      strokeWidth={1.5}
    />
    <Circle
      cx={15}
      cy={12}
      r={6}
      stroke={color}
      strokeWidth={1.5}
    />
  </Svg>
);
