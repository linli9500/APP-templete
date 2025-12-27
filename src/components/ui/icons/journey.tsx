import * as React from 'react';
import Svg, { Path, Circle, type SvgProps } from 'react-native-svg';

// Journey 图标 - 流动曲线路径，象征人生旅途的起伏
export const Journey = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M3 17C6 17 6 7 12 7C18 7 18 17 21 17"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Circle cx={3} cy={17} r={1.5} fill={color} />
    <Circle cx={21} cy={17} r={1.5} fill={color} />
  </Svg>
);
