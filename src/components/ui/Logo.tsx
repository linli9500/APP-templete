import * as React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, SvgProps } from 'react-native-svg';
import { View } from 'react-native';

export const Logo = ({ width = 100, height = 100, color = 'black', ...props }: SvgProps & { color?: string }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      {...props}
    >
      {/* 
        Design Concept: "The Digital Eye of Wisdom" (Athena + AI)
        - Outer shape: A subtle hexagon/shield suggestion (Protection/OS)
        - Inner shape: An abstract "A" formed by connecting lines (Neural Network/Connection)
        - Center: A spark/eye (Insight/Intelligence)
      */}
      
      {/* Outer Ring / Orbit - Broken line for tech feel */}
      <Path
        d="M50 5 
           A 45 45 0 0 1 95 50 
           A 45 45 0 0 1 50 95 
           A 45 45 0 0 1 5 50 
           A 45 45 0 0 1 50 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="10 10"
        opacity={0.5}
      />

      {/* The "A" / Pyramid Structure - Base Stability */}
      <Path
        d="M50 20 L80 80 H20 L50 20Z"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Internal Circuitry / The "Eye" Crossbar */}
      <Path 
        d="M35 50 L65 50" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      
      {/* Central "Pupil" / Data Point - The Core Insight */}
      <Circle 
        cx="50" 
        cy="42" 
        r="4" 
        fill={color} 
      />

      {/* Connecting Node - Bottom Center */}
      <Path 
        d="M50 80 V90" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
       <Circle 
        cx="50" 
        cy="92" 
        r="2" 
        fill={color} 
      />

    </Svg>
  );
};
