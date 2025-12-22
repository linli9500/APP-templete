import analytics from '@react-native-firebase/analytics';

export const Analytics = {
  logEvent: async (name: string, params?: Record<string, any>) => {
    if (__DEV__) {
      console.log(`[Analytics] Log Event: ${name}`, params);
      return;
    }
    try {
      await analytics().logEvent(name, params);
    } catch (error) {
      console.error('[Analytics] Failed to log event:', error);
    }
  },

  setUserProperty: async (name: string, value: string) => {
    if (__DEV__) {
      console.log(`[Analytics] Set User Property: ${name} = ${value}`);
      return;
    }
    try {
      await analytics().setUserProperty(name, value);
    } catch (error) {
      console.error('[Analytics] Failed to set user property:', error);
    }
  },

  setUserId: async (id: string | null) => {
    if (__DEV__) {
      console.log(`[Analytics] Set User ID: ${id}`);
      return;
    }
    try {
      await analytics().setUserId(id);
    } catch (error) {
      console.error('[Analytics] Failed to set user ID:', error);
    }
  },
};
