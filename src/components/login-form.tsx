import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';
import { translate } from '@/lib';

import { Button, ControlledInput, Text, View, PatternLogo } from '@/components/ui';

const schema = z.object({
  name: z.string().optional(),
  email: z
    .string({
      required_error: translate('auth.required_email'),
    })
    .email(translate('auth.invalid_email')),
  password: z
    .string({
      required_error: translate('auth.required_password'),
    })
    .min(6, translate('auth.min_length_password')),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-8 text-center text-2xl font-bold uppercase tracking-[6px]"
          >
            <View className="items-center justify-center pb-4">
               <PatternLogo width={80} height={80} color="#000000" />
            </View>
            FORTUNE
          </Text>

          <Text className="mb-8 max-w-xs text-center text-xs uppercase tracking-widest text-neutral-500">
            {translate('auth.fortune_subtitle')}
          </Text>
        </View>

        <ControlledInput
          testID="name"
          control={control}
          name="name"
          label={translate('auth.name')}
        />

        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
          label={translate('auth.email')}
        />
        <ControlledInput
          testID="password-input"
          control={control}
          name="password"
          label={translate('auth.password')}
          placeholder="***"
          secureTextEntry={true}
        />
        <Button
          testID="login-button"
          label={translate('auth.login')}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
