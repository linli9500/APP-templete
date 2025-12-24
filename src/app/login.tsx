import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FocusAwareStatusBar, Text, PatternLogo } from '@/components/ui';
import { translate } from '@/lib';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useSupabase } from '@/hooks/use-supabase';
import { useColorScheme } from 'nativewind';
import { Svg, Path } from 'react-native-svg';

// --- SVG Icons ---

const GoogleIcon = () => (
  <View className="bg-white rounded-full w-5 h-5 items-center justify-center overflow-hidden">
    <Svg width={18} height={18} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </Svg>
  </View>
);

const AppleIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 384 512" fill={color}>
    <Path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
  </Svg>
);

const EmailIcon = ({ color }: { color: string }) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <Path d="M22 6l-10 7L2 6" />
    </Svg>
);

export default function LoginSelection() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { supabase } = useSupabase();

  const isDark = colorScheme === 'dark';
  const logoColor = isDark ? '#FFFFFF' : '#000000';
  const buttonBg = isDark ? '#FFFFFF' : '#000000';
  const buttonText = isDark ? '#000000' : '#FFFFFF';

  const [isAgreed, setIsAgreed] = React.useState(true);

  const checkAgreement = () => {
    if (!isAgreed) {
        // Shake or show toast
        const { showMessage } = require('react-native-flash-message');
        showMessage({
            message: translate('auth.agree_required'),
            type: "warning",
        });
        return false;
    }
    return true;
  };

  // --- Auth Handlers ---

  React.useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/userinfo.email'],
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.data?.idToken) {
        // Call Bridge API
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

        // Set Session
        const { error } = await supabase.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.access_token, // Usually bridge returns access_token as refresh_token too or specific one
        });
        
        if (error) {
             console.error('Supabase Session Error:', error);
        } else {
             router.replace('/');
        }
      }
    } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // cancelled
        } else {
            console.error('Google Sign-In Error:', error);
        }
    }
  };

  const handleAppleLogin = async () => {
     try {
        const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        });
        if (credential.identityToken) {
            // Call Bridge API
            const response = await fetch(`${process.env.EXPO_PUBLIC_WEB_API_URL || 'https://mfexai-v2.workers.dev'}/api/app/social-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                provider: 'apple',
                idToken: credential.identityToken,
                userInfo: { name: credential.fullName }
                }),
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Apple Login Bridge Failed');

            const { error } = await supabase.auth.setSession({
                access_token: data.access_token,
                refresh_token: data.access_token,
            });

            if (error) {
                console.error('Supabase Session Error:', error);
            } else {
                router.replace('/');
            }
        }
    } catch (e: any) {
        if (e.code !== 'ERR_REQUEST_CANCELED') {
        console.error('Apple Sign-In Error:', e);
        }
    }
  };

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900 justify-center px-8 relative">
      <FocusAwareStatusBar />
      
      {/* Back Button (Optional, usually not needed on root login screen) */}
      
      {/* Logo Section */}
      <View className="items-center mb-20">
        <PatternLogo width={120} height={120} color={logoColor} />
        <Text className="text-2xl font-bold tracking-[8px] mt-8 text-black dark:text-white uppercase">
            FORTUNE
        </Text>
      </View>

      {/* Buttons Section */}
      <View className="space-y-4 w-full px-6 gap-4">
        
        {/* Email Login */}
        <TouchableOpacity 
            onPress={() => {
                if (checkAgreement()) router.push('/email-login');
            }}
            className={`flex-row items-center justify-center py-4 rounded-full relative ${isAgreed ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-800'}`}
        >
            <View style={{ position: 'absolute', left: 24 }}>
                <EmailIcon color={isAgreed ? buttonText : '#999'} />
            </View>
            <Text className={`font-medium text-base ${isAgreed ? 'text-white dark:text-black' : 'text-neutral-500'}`}>
                {translate('auth.continue_with_email')}
            </Text>
        </TouchableOpacity>

        {/* Apple Login (iOS & Web) */}
        {(Platform.OS === 'ios' || Platform.OS === 'web') && (
            <TouchableOpacity 
                onPress={() => {
                    if (checkAgreement()) handleAppleLogin();
                }}
                className={`flex-row items-center justify-center py-4 rounded-full relative ${isAgreed ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-800'}`}
            >
                <View style={{ position: 'absolute', left: 24 }}>
                     <AppleIcon color={isAgreed ? buttonText : '#999'} />
                </View>
                <Text className={`font-medium text-base ${isAgreed ? 'text-white dark:text-black' : 'text-neutral-500'}`}>
                    {translate('auth.continue_with_apple')}
                </Text>
            </TouchableOpacity>
        )}

        {/* Google Login */}
        <TouchableOpacity 
            onPress={() => {
                if (checkAgreement()) handleGoogleLogin();
            }}
            className={`flex-row items-center justify-center py-4 rounded-full relative ${isAgreed ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-800'}`}
        >
             <View style={{ position: 'absolute', left: 24 }}>
                <GoogleIcon />
            </View>
            <Text className={`font-medium text-base ${isAgreed ? 'text-white dark:text-black' : 'text-neutral-500'}`}>
                {translate('auth.continue_with_google')}
            </Text>
        </TouchableOpacity>

      </View>

       {/* Footer / ToS */}
       <TouchableOpacity 
          activeOpacity={1}
          onPress={() => setIsAgreed(!isAgreed)}
          className="absolute bottom-10 left-0 right-0 flex-row items-center justify-center px-6"
       >
          <View className={`w-4 h-4 rounded border mr-2 items-center justify-center ${isAgreed ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-neutral-400'}`}>
              {isAgreed && (
                  <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={isDark ? "black" : "white"} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M20 6L9 17l-5-5" />
                  </Svg>
              )}
          </View>
          <View className="flex-row flex-wrap justify-center">
            <Text className="text-xs text-neutral-400 dark:text-neutral-500">
                {translate('auth.agree_to')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/webview?url=https://example.com/terms&title=Terms')}>
                <Text className="text-xs font-bold text-black dark:text-white mx-1">
                    {translate('settings.terms')}
                </Text>
            </TouchableOpacity>
            <Text className="text-xs text-neutral-400 dark:text-neutral-500">
                &
            </Text>
            <TouchableOpacity onPress={() => router.push('/webview?url=https://example.com/privacy&title=Privacy')}>
                <Text className="text-xs font-bold text-black dark:text-white ml-1">
                    {translate('settings.privacy')}
                </Text>
            </TouchableOpacity>
          </View>
       </TouchableOpacity>

    </View>
  );
}
