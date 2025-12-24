import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React from 'react';
import { AppState } from 'react-native';

import { useSupabase } from '@/hooks/use-supabase';

export function GoogleSignInButton() {
  const { supabase } = useSupabase();

  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/userinfo.email'],
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
           if (userInfo.data?.idToken) {
            // 1. Call Web Bridge API
            const response = await fetch(`${process.env.EXPO_PUBLIC_WEB_API_URL || 'https://mfexai-v2.workers.dev'}/api/app/social-login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                provider: 'google',
                idToken: userInfo.data.idToken,
                userInfo: userInfo.data.user,
              }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Google Login Bridge Failed');

            // 2. Set Session
            const { error } = await supabase.auth.setSession({
              access_token: data.access_token,
              refresh_token: data.access_token,
            });

             if (error) {
               console.error('Supabase Session Error:', error);
             }
          } else {
            throw new Error('no ID token present!');
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
             console.error('Play Services not available');
          } else {
             console.error('Google Sign-In Error:', error);
          }
        }
      }}
    />
  );
}
