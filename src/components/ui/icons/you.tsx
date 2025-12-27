import * as React from 'react';
import Svg, { Path, Circle, type SvgProps } from 'react-native-svg';

// You 图标 - 极简抽象人形，圆形头部 + 抽象身体曲线
export const You = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle
      cx={12}
      cy={8}
      r={4}
      stroke={color}
      strokeWidth={1.5}
    />
    <Path
      d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
