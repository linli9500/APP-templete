import { useRouter, Link } from 'expo-router';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import type { LoginFormProps } from '@/components/login-form';
import { AppleSignInButton } from '@/components/auth/apple-sign-in';
import { GoogleSignInButton } from '@/components/auth/google-sign-in';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useSignIn } from '@/hooks/use-sign-in';

export default function Login() {
  const router = useRouter();
  const { signInWithPassword } = useSignIn();

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      router.replace('/');
    } catch (error: any) {
      showMessage({
        message: 'Login Failed',
        description: error.message,
        type: 'danger',
      });
    }
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
      <View className="items-center pb-4">
          <Link href="/signup" className="text-center text-primary-500">
            Don't have an account? Sign Up
          </Link>
      </View>

      <View className="px-4 pb-8 space-y-4">
        <View className="flex-row items-center">
          <View className="h-[1px] flex-1 bg-neutral-200 dark:bg-neutral-700" />
          <Text className="mx-4 text-xs text-neutral-400">OR CONTINUE WITH</Text>
          <View className="h-[1px] flex-1 bg-neutral-200 dark:bg-neutral-700" />
        </View>

        <AppleSignInButton />
        <View className="h-2" />
        <GoogleSignInButton />
      </View>
    </>
  );
}
