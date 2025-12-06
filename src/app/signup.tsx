import { useRouter, Link } from 'expo-router';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar, View, Text } from '@/components/ui';
import { useSignUp } from '@/hooks/use-sign-up';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useSignUp();

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    try {
      await signUp({ email: data.email, password: data.password, name: data.name });
      showMessage({
        message: 'Account Created',
        description: 'Please check your email to verify your account.',
        type: 'success',
      });
      // Optionally redirect to login or wait for verification
      router.replace('/login');
    } catch (error: any) {
      showMessage({
        message: 'Registration Failed',
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
          <Link href="/login" className="text-center text-primary-500">
            Already have an account? Log In
          </Link>
      </View>
    </>
  );
}
