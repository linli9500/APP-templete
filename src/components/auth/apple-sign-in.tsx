import * as AppleAuthentication from 'expo-apple-authentication';
import React from 'react';
import { Platform } from 'react-native';

import { useSupabase } from '@/hooks/use-supabase';

export function AppleSignInButton() {
  const { supabase } = useSupabase();

  if (Platform.OS !== 'ios') return null;

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: '100%', height: 44 }}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          // Sign in via Supabase Auth.
          if (credential.identityToken) {
            // 1. Call Web Bridge API
            const response = await fetch(`${process.env.EXPO_PUBLIC_WEB_API_URL || 'https://mfexai-v2.workers.dev'}/api/app/social-login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                provider: 'apple',
                idToken: credential.identityToken,
                userInfo: {
                    name: credential.fullName // Apple only sends this on first login!
                }
              }),
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Apple Login Bridge Failed');

            // 2. Set Session
            const { error } = await supabase.auth.setSession({
              access_token: data.access_token,
              refresh_token: data.access_token, // Usually bridge returns access_token as refresh_token too or specific one
            });
            
            if (error) {
               console.error('Supabase Session Error:', error);
            }
          }
        } catch (e: any) {
          if (e.code === 'ERR_REQUEST_CANCELED') {
            // handle that the user canceled the sign-in flow
          } else {
            console.error('Apple Sign-In Error:', e);
          }
        }
      }}
    />
  );
}
