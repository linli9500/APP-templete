import { useRouter, Link } from 'expo-router';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar, View } from '@/components/ui';
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
    </>
  );
}
