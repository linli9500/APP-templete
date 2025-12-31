import React, { forwardRef } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

import { Text } from '@/components/ui/text';
import { Env } from '@/lib/env';

// Logo 组件 - 基于 logo-fortune.svg
const AppLogo = ({ size = 40 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 核心形状 - 偏心有机实体 */}
    <Path
      d="M48 28C38 30 32 38 34 48C36 58 44 64 54 62C64 60 70 52 68 42"
      fill="#000000"
      opacity={0.9}
    />
    {/* 内部波纹 - 细有机线条 */}
    <Path
      d="M28 22C18 30 14 45 18 60C22 75 35 84 50 84C65 84 78 75 82 60"
      stroke="#000000"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    {/* 外部场 - 扩展意识 */}
    <Path
      d="M60 18C75 18 85 25 90 35M20 18C10 25 5 40 5 55"
      stroke="#000000"
      strokeWidth={0.8}
      strokeLinecap="round"
      opacity={0.8}
    />
    {/* 抽象数据点 - 精确度 */}
    <Circle cx={72} cy={38} r={2} fill="#000000" />
  </Svg>
);

interface ShareCardProps {
  title: string;
  keywords: string[];
  highlight: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * 分享卡片组件
 * 设计规格：9:16 竖版（360 x 640 逻辑像素）
 * 风格：暖米色背景、Swiss Design 大字体、极简布局
 */
export const ShareCard = forwardRef<View, ShareCardProps>(
  ({ title, keywords, highlight, style }, ref) => {
    // 从环境变量获取 APP 名称，默认为 Fortune
    const appName = Env.APP_NAME || 'Fortune';

    return (
      <View ref={ref} style={[styles.container, style]}>
        {/* 背景渐变效果通过多层 View 模拟 */}
        <View style={styles.backgroundGradient} />
        
        {/* 头部装饰 */}
        <View style={styles.headerDecor}>
          <View style={styles.decorLine} />
        </View>

        {/* 标题区域 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* 关键词标签 */}
        <View style={styles.keywordsSection}>
          {keywords.map((keyword, index) => (
            <View key={index} style={styles.keywordTag}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
        </View>

        {/* 简介文字 */}
        <View style={styles.highlightSection}>
          <Text style={styles.highlightText}>{highlight}</Text>
        </View>



        {/* 底部 APP 信息 */}
        <View style={styles.footer}>
          <AppLogo size={36} />
          <Text style={styles.appName}>{appName}</Text>
        </View>
      </View>
    );
  }
);

ShareCard.displayName = 'ShareCard';

const styles = StyleSheet.create({
  container: {
    width: 360,
    height: 640,
    backgroundColor: '#F5F5F0',
    borderRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 32,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F2EEE9',
    opacity: 0.5,
  },
  headerDecor: {
    alignItems: 'center',
    marginBottom: 24,
  },
  decorLine: {
    width: 60,
    height: 3,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 40,
  },
  keywordsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  keywordTag: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  keywordText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  highlightSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  highlightText: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#00000020',
    marginVertical: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  appName: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
});
