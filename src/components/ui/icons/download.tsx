import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

import colors from '../colors';

// 下载图标组件
export const Download = ({ color = colors.neutral[500], ...props }: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
      fill={color}
    />
  </Svg>
);
