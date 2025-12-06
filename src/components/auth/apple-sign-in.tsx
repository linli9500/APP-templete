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
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'apple',
              token: credential.identityToken,
            });
            if (error) {
               console.error('Apple Sign-In Error:', error);
               // You might want to show a flash message here
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
