import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Stack, useRouter } from 'expo-router';

import { Text, View, FocusAwareStatusBar } from '@/components/ui';
import { translate, type TxKeyPath } from '@/lib';
import { ArrowRight } from '@/components/ui/icons';

// 模拟订阅数据（静态展示用，后续对接 RevenueCat）
const MOCK_SUBSCRIPTION = {
  // 有订阅的状态
  hasSubscription: true,
  tier: 'pro', // 'free' | 'pro' | 'premium'
  status: 'active', // 'active' | 'expired' | 'trial' | 'grace_period'
  type: 'yearly', // 'monthly' | 'yearly' | 'lifetime'
  startDate: '2024-12-26',
  expiryDate: '2025-12-26',
  willRenew: true,
  nextBillingDate: '2025-12-26',
};

// 无订阅的模拟数据（用于测试）
// const MOCK_SUBSCRIPTION = {
//   hasSubscription: false,
//   tier: 'free',
//   status: 'expired',
//   type: null,
//   startDate: null,
//   expiryDate: null,
//   willRenew: false,
//   nextBillingDate: null,
// };

// 订阅等级配置
interface TierConfig {
  label: TxKeyPath;
  icon: string;
  bgColor: string;
  borderColor: string;
}

const getTierConfig = (tier: string): TierConfig => {
  switch (tier) {
    case 'pro':
      return {
        label: 'subscription.pro_tier' as TxKeyPath,
        icon: '👑',
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        borderColor: 'border-amber-300 dark:border-amber-700',
      };
    case 'premium':
      return {
        label: 'subscription.premium_tier' as TxKeyPath,
        icon: '💎',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        borderColor: 'border-purple-300 dark:border-purple-700',
      };
    default:
      return {
        label: 'subscription.free_tier' as TxKeyPath,
        icon: '✨',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        borderColor: 'border-gray-300 dark:border-gray-700',
      };
  }
};

// 订阅状态配置
interface StatusConfig {
  label: TxKeyPath;
  bgColor: string;
  textColor: string;
}

const getStatusConfig = (status: string): StatusConfig => {
  switch (status) {
    case 'active':
      return {
        label: 'subscription.active' as TxKeyPath,
        bgColor: 'bg-green-500',
        textColor: 'text-white',
      };
    case 'trial':
      return {
        label: 'subscription.trial' as TxKeyPath,
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
      };
    case 'grace_period':
      return {
        label: 'subscription.grace_period' as TxKeyPath,
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
      };
    default:
      return {
        label: 'subscription.expired' as TxKeyPath,
        bgColor: 'bg-red-500',
        textColor: 'text-white',
      };
  }
};

// 订阅类型配置
const getTypeLabel = (type: string | null): TxKeyPath | null => {
  switch (type) {
    case 'monthly':
      return 'subscription.monthly' as TxKeyPath;
    case 'yearly':
      return 'subscription.yearly' as TxKeyPath;
    case 'lifetime':
      return 'subscription.lifetime' as TxKeyPath;
    default:
      return null;
  }
};

// Pro 特权列表
const PRO_FEATURES: TxKeyPath[] = [
  'subscription.feature_unlimited' as TxKeyPath,
  'subscription.feature_history' as TxKeyPath,
  'subscription.feature_export' as TxKeyPath,
  'subscription.feature_priority' as TxKeyPath,
];

export default function SubscriptionPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [isRestoring, setIsRestoring] = useState(false);

  // 使用模拟数据（后续替换为 RevenueCat 数据）
  const subscription = MOCK_SUBSCRIPTION;
  const tierConfig = getTierConfig(subscription.tier);
  const statusConfig = getStatusConfig(subscription.status);

  // 恢复购买（静态演示，后续对接 RevenueCat）
  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    // 模拟延迟
    setTimeout(() => {
      setIsRestoring(false);
      // 后续替换为: await Purchases.restorePurchases();
    }, 1500);
  };

  // 管理订阅（跳转到 App Store / Google Play）
  const handleManageSubscription = () => {
    const url = Platform.select({
      ios: 'https://apps.apple.com/account/subscriptions',
      android: 'https://play.google.com/store/account/subscriptions',
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  // 联系客服
  const handleContactSupport = () => {
    // 后续可以跳转到客服页面或发送邮件
    Linking.openURL('mailto:support@example.com?subject=Subscription%20Issue');
  };

  // 前往升级/购买
  const handleUpgrade = () => {
    router.push('/paywall');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900 px-6" style={{ paddingTop: insets.top }}>
        <FocusAwareStatusBar />
        
        {/* 自定义头部导航栏 - 与 Settings 页面一致 */}
        <View className="flex-row items-center justify-between mt-6 mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="w-8 h-8 rounded-full bg-black dark:bg-neutral-800 justify-center items-center" style={{ transform: [{ rotate: '180deg' }] }}>
              <ArrowRight color="white" width={16} height={16} />
            </View>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black dark:text-white flex-1 text-center pr-8">
            {translate('subscription.title')}
          </Text>
        </View>

      <ScrollView 
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 订阅状态卡片 */}
        <View 
          className={`mt-6 p-6 rounded-3xl border-2 ${tierConfig.bgColor} ${tierConfig.borderColor}`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-4xl mr-3">{tierConfig.icon}</Text>
              <View>
                <Text className="text-2xl font-bold">
                  {translate(tierConfig.label)}
                </Text>
                <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {translate('subscription.current_plan')}
                </Text>
              </View>
            </View>
            
            {/* 状态徽章 */}
            {subscription.hasSubscription && (
              <View className={`px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}>
                <Text className={`text-xs font-bold ${statusConfig.textColor}`}>
                  {translate(statusConfig.label)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 订阅详情 */}
        {subscription.hasSubscription && (
          <View className="mt-6 bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden">
            {/* 订阅类型 */}
            <View className="flex-row justify-between items-center px-5 py-4 border-b border-neutral-100 dark:border-neutral-700">
              <Text className="text-neutral-500 dark:text-neutral-400">
                {translate('subscription.subscription_type')}
              </Text>
              <Text className="font-semibold">
                {getTypeLabel(subscription.type) ? translate(getTypeLabel(subscription.type)!) : '-'}
              </Text>
            </View>

            {/* 开始日期 */}
            <View className="flex-row justify-between items-center px-5 py-4 border-b border-neutral-100 dark:border-neutral-700">
              <Text className="text-neutral-500 dark:text-neutral-400">
                {translate('subscription.start_date')}
              </Text>
              <Text className="font-semibold">
                {subscription.startDate || '-'}
              </Text>
            </View>

            {/* 到期日期 */}
            <View className="flex-row justify-between items-center px-5 py-4 border-b border-neutral-100 dark:border-neutral-700">
              <Text className="text-neutral-500 dark:text-neutral-400">
                {translate('subscription.expiry_date')}
              </Text>
              <Text className="font-semibold">
                {subscription.expiryDate || '-'}
              </Text>
            </View>

            {/* 自动续费 */}
            <View className="flex-row justify-between items-center px-5 py-4 border-b border-neutral-100 dark:border-neutral-700">
              <Text className="text-neutral-500 dark:text-neutral-400">
                {translate('subscription.auto_renew')}
              </Text>
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${subscription.willRenew ? 'bg-green-500' : 'bg-red-500'}`} />
                <Text className="font-semibold">
                  {translate(subscription.willRenew ? 'subscription.auto_renew_on' : 'subscription.auto_renew_off')}
                </Text>
              </View>
            </View>

            {/* 下次扣款日 */}
            {subscription.willRenew && subscription.nextBillingDate && (
              <View className="flex-row justify-between items-center px-5 py-4">
                <Text className="text-neutral-500 dark:text-neutral-400">
                  {translate('subscription.next_billing')}
                </Text>
                <Text className="font-semibold">
                  {subscription.nextBillingDate}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* 无订阅状态 */}
        {!subscription.hasSubscription && (
          <View className="mt-6 bg-white dark:bg-neutral-800 rounded-2xl p-6 items-center">
            <Text className="text-5xl mb-4">🔒</Text>
            <Text className="text-lg font-bold text-center mb-2">
              {translate('subscription.no_subscription')}
            </Text>
            <Text className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-6">
              {translate('subscription.no_subscription_hint')}
            </Text>

            {/* Pro 特权列表 */}
            <View className="w-full mb-6">
              <Text className="text-sm font-bold mb-3 text-neutral-600 dark:text-neutral-300">
                {translate('subscription.features_title')}
              </Text>
              {PRO_FEATURES.map((feature, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <Text className="text-green-500 mr-2">✓</Text>
                  <Text className="text-sm text-neutral-600 dark:text-neutral-400">
                    {translate(feature)}
                  </Text>
                </View>
              ))}
            </View>

            {/* 立即订阅按钮 */}
            <TouchableOpacity 
              onPress={handleUpgrade}
              className="w-full bg-black dark:bg-white py-4 rounded-full"
            >
              <Text className="text-center text-white dark:text-black font-bold text-base">
                {translate('subscription.subscribe_now')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 操作区域 */}
        <View className="mt-6 bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden">
          {/* 恢复购买 */}
          <TouchableOpacity 
            onPress={handleRestorePurchases}
            disabled={isRestoring}
            className="flex-row items-center px-5 py-4 border-b border-neutral-100 dark:border-neutral-700"
          >
            <Text className="text-2xl mr-4">🔄</Text>
            <View className="flex-1">
              <Text className={`font-semibold ${isRestoring ? 'text-neutral-400' : ''}`}>
                {translate('subscription.restore_purchases')}
              </Text>
              <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {translate('subscription.restore_hint')}
              </Text>
            </View>
            {isRestoring && (
              <Text className="text-neutral-400">...</Text>
            )}
          </TouchableOpacity>

          {/* 管理订阅 */}
          <TouchableOpacity 
            onPress={handleManageSubscription}
            className="flex-row items-center px-5 py-4 border-b border-neutral-100 dark:border-neutral-700"
          >
            <Text className="text-2xl mr-4">📱</Text>
            <View className="flex-1">
              <Text className="font-semibold">
                {translate('subscription.manage_subscription')}
              </Text>
              <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {translate('subscription.manage_hint')}
              </Text>
            </View>
            <Text className="text-neutral-400">→</Text>
          </TouchableOpacity>

          {/* 联系客服 */}
          <TouchableOpacity 
            onPress={handleContactSupport}
            className="flex-row items-center px-5 py-4"
          >
            <Text className="text-2xl mr-4">💬</Text>
            <View className="flex-1">
              <Text className="font-semibold">
                {translate('subscription.contact_support')}
              </Text>
            </View>
            <Text className="text-neutral-400">→</Text>
          </TouchableOpacity>
        </View>

        {/* 升级按钮（仅对有订阅但非最高等级的用户显示） */}
        {subscription.hasSubscription && subscription.tier !== 'premium' && (
          <TouchableOpacity 
            onPress={handleUpgrade}
            className="mt-6 bg-black dark:bg-white py-4 rounded-full"
          >
            <Text className="text-center text-white dark:text-black font-bold text-base">
              {translate('subscription.upgrade_plan')}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      </View>
    </>
  );
}
