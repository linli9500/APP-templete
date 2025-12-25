import { useRouter, Link } from 'expo-router';
import React from 'react';
import { showErrorMessage, showSuccessMessage } from '@/components/ui';
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
      showSuccessMessage(`${translate('auth.account_created')}: ${translate('auth.verify_email')}`);
      // Optionally redirect to login or wait for verification
      router.replace('/login');
    } catch (error: any) {
      showErrorMessage(`${translate('auth.registration_failed')}: ${error.message}`);
    }
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
      <View className="items-center pb-4">
          <Link href="/email-login" className="text-center text-sm font-medium text-neutral-800 dark:text-neutral-200 tracking-wider uppercase">
            {translate('auth.already_have_account')}
          </Link>
      </View>
    </>
  );
}
