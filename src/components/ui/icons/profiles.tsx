import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path, Circle } from 'react-native-svg';

import colors from '../colors';

// 用户档案管理图标（多人图标）
export const Profiles = ({ color = colors.neutral[500], ...props }: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
     {/* 主用户 */}
    <Circle cx={9} cy={7} r={4} stroke={color} strokeWidth={1.5} />
    <Path
      d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    {/* 副用户（小） */}
    <Circle cx={17} cy={7} r={2.5} stroke={color} strokeWidth={1.5} />
    <Path
      d="M21 21v-1a3 3 0 0 0-3-3h-1"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
