import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface FeedbackIconProps {
  color?: string;
  width?: number;
  height?: number;
}

/**
 * 反馈图标 - Ultra-thin 风格
 * 消息气泡带笔的设计，表示用户反馈
 */
export const Feedback = ({ 
  color = 'currentColor', 
  width = 24, 
  height = 24 
}: FeedbackIconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    {/* 消息气泡 */}
    <Path
      d="M21 11.5C21 16.1944 16.9706 20 12 20C10.8053 20 9.66406 19.7962 8.61362 19.4232L3 21L4.65614 16.5557C3.61188 15.1182 3 13.3772 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* 铅笔/笔 */}
    <Path
      d="M9 11.5H15"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M12 8.5V14.5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

export default Feedback;
