/**
 * AdMob 广告工具库
 * 用于初始化和管理 Google Mobile Ads
 */
import mobileAds, { 
  AppOpenAd, 
  TestIds, 
  AdEventType 
} from 'react-native-google-mobile-ads';

// 广告加载状态
let appOpenAdLoaded = false;
let appOpenAd: AppOpenAd | null = null;

/**
 * 初始化 AdMob SDK
 */
export async function initializeAdMob(): Promise<void> {
  try {
    await mobileAds().initialize();
  } catch (error) {
    // 静默处理初始化错误
  }
}

/**
 * 预加载开屏广告
 * @param adUnitId 可选的自定义广告单元 ID，留空使用测试 ID
 * @returns Promise，广告加载完成后 resolve
 */
export function preloadAppOpenAd(adUnitId?: string): Promise<boolean> {
  const unitId = adUnitId || TestIds.APP_OPEN;
  
  return new Promise((resolve) => {
    try {
      appOpenAd = AppOpenAd.createForAdRequest(unitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      // 监听广告事件
      appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
        appOpenAdLoaded = true;
        resolve(true);
      });

      appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
        appOpenAdLoaded = false;
        resolve(false);
      });

      appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
        appOpenAdLoaded = false;
        // 重新预加载下一次的广告（不等待）
        preloadAppOpenAd(adUnitId);
      });

      // 开始加载
      appOpenAd.load();
      
      // 设置超时，10秒后如果还没加载完成就放弃
      setTimeout(() => {
        if (!appOpenAdLoaded) {
          resolve(false);
        }
      }, 10000);
    } catch (error) {
      resolve(false);
    }
  });
}

/**
 * 显示开屏广告
 * @returns 是否成功显示
 */
export async function showAppOpenAd(): Promise<boolean> {
  if (!appOpenAd || !appOpenAdLoaded) {
    return false;
  }

  try {
    await appOpenAd.show();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 检查开屏广告是否加载完成
 */
export function isAppOpenAdLoaded(): boolean {
  return appOpenAdLoaded;
}
