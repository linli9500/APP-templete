import * as React from 'react';
import Svg, { Path, Rect, type SvgProps } from 'react-native-svg';

// 公文包图标 - 极简线条，用于 Bonds 工作关系卡片
export const Briefcase = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect
      x={2}
      y={7}
      width={20}
      height={14}
      rx={2}
      stroke={color}
      strokeWidth={1.5}
    />
    <Path
      d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M12 12V14"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M2 12H22"
      stroke={color}
      strokeWidth={1.5}
    />
  </Svg>
);
