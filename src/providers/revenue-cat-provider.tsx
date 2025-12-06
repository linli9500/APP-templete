import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo } from 'react-native-purchases';

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || '',
  google: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || '',
};

interface RevenueCatContextType {
  customerInfo: CustomerInfo | null;
  isPro: boolean;
}

const RevenueCatContext = createContext<RevenueCatContextType | null>(null);

export const useRevenueCat = () => {
  const context = useContext(RevenueCatContext);
  if (!context) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }
  return context;
};

export const RevenueCatProvider = ({ children }: { children: React.ReactNode }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (Platform.OS === 'ios') {
          Purchases.configure({ apiKey: APIKeys.apple });
        } else if (Platform.OS === 'android') {
          Purchases.configure({ apiKey: APIKeys.google });
        }

        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
      } catch (e) {
        console.log('RevenueCat init error', e);
      }
    };

    init();
  }, []);

  const isPro = customerInfo?.entitlements.active['pro'] !== undefined;

  return (
    <RevenueCatContext.Provider value={{ customerInfo, isPro }}>
      {children}
    </RevenueCatContext.Provider>
  );
};
