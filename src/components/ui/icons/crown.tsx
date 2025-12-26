import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const Crown = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2 17h20l-2-8-5 4-3-6-3 6-5-4-2 8zm0 3h20v2H2v-2z"
      fill={color}
    />
  </Svg>
);
