import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { client } from '@/api/common/client';
import { getLanguage } from '@/lib/i18n/utils';

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  } as Notifications.NotificationBehavior),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    // Get the Expo Push Token (Project ID needed for Expo 49+)
    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('📱 Expo Push Token:', token);
      
      await saveTokenToBackend(token);
      
    } catch (e) {
      console.log('Error fetching push token:', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

async function saveTokenToBackend(token: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // 获取当前用户语言设置
    const locale = getLanguage() || 'en';

    await client.post('/app/device', {
      token,
      platform: Platform.OS,
      locale, // 上报用户语言偏好
    });
    console.log('✅ Push token saved to backend with locale:', locale);
  } catch (error) {
    console.error('❌ Error saving push token:', error);
  }
}

/**
 * 设置推送通知监听器
 * 处理用户点击通知后的导航跳转
 * @param navigate 导航函数，如 router.push
 */
export function setupNotificationListeners(navigate: (path: string) => void) {
  // 监听用户点击通知（App 在后台或已关闭时）
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;
      console.log('📱 通知被点击, data:', data);

      // 根据 data.screen 导航到对应页面
      if (data?.screen) {
        // 支持带参数的路由，如 "history/123"
        const screen = String(data.screen);
        navigate(`/${screen}`);
      }
      // 或者直接使用 url
      if (data?.url) {
        navigate(String(data.url));
      }
    }
  );

  // 监听前台收到通知（可选：记录日志或显示自定义 UI）
  const notificationSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('📬 收到前台通知:', notification.request.content);
    }
  );

  // 返回清理函数
  return () => {
    responseSubscription.remove();
    notificationSubscription.remove();
  };
}

