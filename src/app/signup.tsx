import { useRouter, Link } from 'expo-router';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import { translate } from '@/lib';

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
        message: translate('auth.account_created'),
        description: translate('auth.verify_email'),
        type: 'success',
      });
      // Optionally redirect to login or wait for verification
      router.replace('/login');
    } catch (error: any) {
      showMessage({
        message: translate('auth.registration_failed'),
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
          <Link href="/login" className="text-center text-sm font-medium text-neutral-800 tracking-wider uppercase">
            {translate('auth.already_have_account')}
          </Link>
      </View>
    </>
  );
}
