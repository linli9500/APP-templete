import React, { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAppConfig } from '@/lib/use-app-config';

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Compare two version strings.
 * Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal.
 */
const compareVersions = (v1: string, v2: string) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
};

const SNOOZE_KEY = 'update_snooze_version';

export const UpdateChecker = () => {
  const { version, isLoading } = useAppConfig();

  useEffect(() => {
    const check = async () => {
        if (isLoading || !version) return;

        const localVersion = Constants.expoConfig?.version || '0.0.0';
        const remoteVersion = version.latest_version;
        const forceUpdate = version.force_update;
        
        // Select URL based on platform
        const downloadUrl = Platform.select({
            ios: version.ios_url || version.download_url,
            android: version.android_url || version.download_url,
            default: version.download_url
        });

        console.log('[UpdateChecker] Local:', localVersion, 'Remote:', remoteVersion, 'Force:', forceUpdate, 'URL:', downloadUrl);

        // If remote is newer than local
        if (compareVersions(remoteVersion, localVersion) > 0) {
            
            // If soft update, check snooze logic first
            if (!forceUpdate) {
                const snoozeVersion = await AsyncStorage.getItem(SNOOZE_KEY);
                if (snoozeVersion === remoteVersion) {
                    console.log('[UpdateChecker] Update snoozed for version', remoteVersion);
                    return;
                }
            }

            const title = 'Update Available';
            const message = forceUpdate 
                ? `A new version (${remoteVersion}) is available. You must update to continue.`
                : `A new version (${remoteVersion}) is available. Would you like to update?`;

            // Helper to open store
            const openStore = () => {
                if (downloadUrl) {
                    Linking.openURL(downloadUrl);
                } else {
                    console.warn('[UpdateChecker] No download URL provided for', Platform.OS);
                    if (!forceUpdate) Alert.alert('Error', 'Store URL not configured.');
                }
            };
            
            const snooze = () => {
                 AsyncStorage.setItem(SNOOZE_KEY, remoteVersion);
            };

            // Recursive function to keep showing alert if forced
            const showUpgradeAlert = () => {
                if (forceUpdate) {
                    // FORCE UPDATE
                    Alert.alert(
                        title,
                        message,
                        [
                            { 
                            text: 'Update Now', 
                            onPress: () => {
                                openStore();
                                // Re-trigger alert to block access
                                // Using a slight delay to allow the app to switch context, but ensure it's there on return
                                setTimeout(() => {
                                    showUpgradeAlert();
                                }, 500); 
                            } 
                            }
                        ],
                        { cancelable: false }
                    );
                } else {
                    // SOFT UPDATE
                    Alert.alert(
                        title,
                        message,
                        [
                            { text: 'Later', style: 'cancel', onPress: snooze },
                            { text: 'Update', onPress: openStore }
                        ]
                    );
                }
            };

            // Trigger the first alert
            showUpgradeAlert();
        }
    };
    
    check();
  }, [version, isLoading, version?.latest_version, version?.force_update]);

  return null; // Headless component
};
