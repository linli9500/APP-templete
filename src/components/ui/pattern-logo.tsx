import * as React from 'react';
import Svg, { Path, Circle, SvgProps } from 'react-native-svg';

export const PatternLogo = ({ width = 100, height = 100, color = '#000000', ...props }: SvgProps & { color?: string }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" fill="none" {...props}>
    {/* Core Essence - Off-center organic solid */}
    <Path
      d="M48 28C38 30 32 38 34 48C36 58 44 64 54 62C64 60 70 52 68 42"
      fill={color}
      opacity={0.9}
    />
    
    {/* Inner Ripple - Thin organic line */}
    <Path
      d="M28 22C18 30 14 45 18 60C22 75 35 84 50 84C65 84 78 75 82 60"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Outer Field - Expanding consciousness */}
    <Path
      d="M60 18C75 18 85 25 90 35M20 18C10 25 5 40 5 55"
      stroke={color}
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity={0.8}
    />

     {/* Abstract Data Point - Precision */}
     <Circle cx="72" cy="38" r="2" fill={color} />
  </Svg>
);
