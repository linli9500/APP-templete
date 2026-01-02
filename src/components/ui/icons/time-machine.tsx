import * as React from 'react';
import Svg, { Path, Circle, type SvgProps } from 'react-native-svg';

// 时光机图标 - 极简线条，象征时间穿越
export const TimeMachine = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle
      cx={12}
      cy={12}
      r={9}
      stroke={color}
      strokeWidth={1.5}
    />
    <Path
      d="M12 6V12L16 14"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 12H1M23 12H21M12 3V1M12 23V21"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
