import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface StarProps extends SvgProps {
  filled?: boolean;
}

/**
 * 星标图标 - Ultra-thin 风格
 * filled: true 表示填充（已设为默认），false 表示空心
 */
export const Star = ({ color = 'black', filled = false, ...props }: StarProps) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : 'none'}
    />
  </Svg>
);
