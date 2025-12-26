import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const ArrowLeft = ({ color = 'black', ...props }: SvgProps) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
