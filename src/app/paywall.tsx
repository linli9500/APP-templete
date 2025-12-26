import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';

import { FocusAwareStatusBar, Text, View, Button } from '@/components/ui';
import { InfoModal } from '@/components/ui/confirm-modal';
import { translate } from '@/lib';

export default function Paywall() {
  const router = useRouter();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // 弹窗状态
  const [infoModal, setInfoModal] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    onClose?: () => void;
  }>({ visible: false, type: 'info', title: '', message: '' });

  // 显示弹窗的辅助函数
  const showModal = (
    type: 'success' | 'error' | 'info', 
    title: string, 
    message: string,
    onClose?: () => void
  ) => {
    setInfoModal({ visible: true, type, title, message, onClose });
  };

  const handleCloseModal = () => {
    const callback = infoModal.onClose;
    setInfoModal({ ...infoModal, visible: false });
    if (callback) callback();
  };

  useEffect(() => {
    const getOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e: any) {
        showModal('error', translate('common.error'), e.message);
      }
    };

    getOfferings();
  }, []);

  const onPurchase = async (pack: PurchasesPackage) => {
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pack);
      if (typeof customerInfo.entitlements.active['pro'] !== 'undefined') {
        showModal('success', translate('subscription.restore_success'), translate('subscription.restore_success'), () => {
          router.back();
        });
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        showModal('error', translate('common.error'), e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const onRestore = async () => {
    setIsPurchasing(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (typeof customerInfo.entitlements.active['pro'] !== 'undefined') {
        showModal('success', translate('subscription.restore_success'), translate('subscription.restore_success'), () => {
          router.back();
        });
      } else {
        showModal('info', translate('common.error'), translate('subscription.restore_failed'));
      }
    } catch (e: any) {
      showModal('error', translate('common.error'), e.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <FocusAwareStatusBar />
      <View className="mt-8 mb-8 items-center">
         <Text className="text-3xl font-bold mb-2 text-center text-primary-500">Premium Access</Text>
         <Text className="text-center text-gray-500 dark:text-gray-400">
           Unlock all features with our Pro plan.
         </Text>
      </View>

      <ScrollView className="space-y-4">
        {packages.map((pack) => (
          <TouchableOpacity
            key={pack.identifier}
            onPress={() => onPurchase(pack)}
            disabled={isPurchasing}
            className={`p-6 rounded-xl border-2 ${
              isPurchasing ? 'border-gray-200' : 'border-primary-500'
            } bg-gray-50 dark:bg-gray-900`}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-xl font-bold">{pack.product.title}</Text>
                <Text className="text-gray-500">{pack.product.description}</Text>
              </View>
              <Text className="text-xl font-bold text-primary-500">
                {pack.product.priceString}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="mt-auto items-center space-y-4 pb-8">
        <TouchableOpacity onPress={onRestore} disabled={isPurchasing}>
          <Text className="text-gray-400">Restore Purchases</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.back()} disabled={isPurchasing} className="py-2">
           <Text className="text-red-400">Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* 信息弹窗 */}
      <InfoModal
        visible={infoModal.visible}
        title={infoModal.title}
        message={infoModal.message}
        type={infoModal.type}
        onClose={handleCloseModal}
      />
    </View>
  );
}
