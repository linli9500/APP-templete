import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export const checkAppUpdate = async (isManual = false) => {
  if (__DEV__) {
    if (isManual) {
      Alert.alert('Developer Mode', 'EAS Updates are skipped in development.');
    } else {
      console.log('[Updates] Skipped in DEV mode');
    }
    return;
  }

  try {
    const update = await Updates.checkForUpdateAsync();
    
    if (update.isAvailable) {
      // 1. Download the update
      await Updates.fetchUpdateAsync();
      
      // 2. Prompt user
      Alert.alert(
        'Update Available',
        'A new version of the app is ready. Restart now to apply?',
        [
          { text: 'Later', style: 'cancel' },
          { 
            text: 'Restart', 
            onPress: async () => {
              await Updates.reloadAsync();
            } 
          }
        ]
      );
    } else {
      if (isManual) {
        Alert.alert('Up to date', 'You are running the latest version of the app.');
      }
    }
  } catch (error) {
    console.log('[Updates] check failed:', error);
    if (isManual) {
      Alert.alert('Error', 'Failed to check for updates. Please check your internet connection.');
    }
  }
};
