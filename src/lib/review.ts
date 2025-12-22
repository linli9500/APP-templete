import * as StoreReview from 'expo-store-review';
import { Linking, Platform } from 'react-native';

export const review = {
  /**
   * Request an in-app review.
   * This will present the native review dialog if available and appropriate.
   * It is best to call this after a positive user interaction.
   */
  requestReview: async () => {
    try {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
      } else {
        console.log('[Review] Store review not available on this device/OS version.');
      }
    } catch (error) {
      console.error('[Review] Error requesting review:', error);
    }
  },

  /**
   * Open the store page for writing a review.
   * Use this as a fallback or for a dedicated "Rate Us" button.
   */
  openStoreReview: (storeUrl: string) => {
    Linking.openURL(storeUrl).catch((err) =>
      console.error('[Review] Failed to open store URL:', err)
    );
  },
};
