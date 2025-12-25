import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';

import { Text, FocusAwareStatusBar } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { useTranslation } from 'react-i18next';
import { translate } from '@/lib';


const schema = z.object({
  birthDate: z.date({ required_error: "请选择出生日期" }),
  birthTime: z.date({ required_error: "请选择出生时间" }),
  gender: z.enum(['male', 'female', 'other'], { required_error: "请选择性别" }),
});

type FormData = z.infer<typeof schema>;

export default function AnalysisInputScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation(); // Note: This might be 'translate' from '@/lib' or 'useTranslation' from react-i18next. 
  // checking imports: import { useTranslation } from 'react-i18next'; is present. 
  // BUT the project uses `translate` helper usually.
  // user request said: "translate('key') or tx attribute".
  // The file imports `useTranslation` on line 14. 
  // And `import { Text } from '@/components/ui';` which usually supports `tx`.
  // Let's check `Text` component usage. If it supports `tx`, use it.
  // Previous view showed `import { translate } from '@/lib';` was NOT in input.tsx options.tsx had it.
  // input.tsx line 14: import { useTranslation } from 'react-i18next';
  // I should probably use `translate` from `@/lib` for consistency if that's the project pattern, OR `t` from `useTranslation`.
  // The user rule says: "必须使用 `translate('key')` 或 `tx` 属性".
  // I will use `translate` from `@/lib` as it appears to be the project standard helper (options.tsx uses it).
  // AND `tx` for Text components.

  // Wait, I need to add import { translate } from '@/lib';
  
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: 'female',
    }
  });

  const selectedDate = watch('birthDate');
  const selectedTime = watch('birthTime');

  const onSubmit = (data: FormData) => {
    router.push({
      pathname: '/analysis/report',
      params: {
        birthDate: format(data.birthDate, 'yyyy-MM-dd'),
        birthTime: format(data.birthTime, 'HH:mm'),
        gender: data.gender,
        key: 'test_analysis', 
      }
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <FocusAwareStatusBar />

        {/* Custom Header */}
        <View className="flex-row items-center justify-between mt-2 mb-6 px-4">
             <TouchableOpacity onPress={() => router.back()}>
                <View className="w-8 h-8 rounded-full bg-black dark:bg-neutral-800 justify-center items-center" style={{ transform: [{ rotate: '180deg' }] }}>
                    <ArrowRight color="white" width={16} height={16} />
                </View>
            </TouchableOpacity>
             <View className="flex-1" />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text className="text-3xl font-bold mb-2 text-black" tx="insight.title" />
          <Text className="text-neutral-500 mb-8 text-base" tx="analysis.input_instruction" />

          {/* Birth Date Picker Trigger */}
          <View className="mb-6">
            <Text className="mb-2 font-semibold text-black" tx="analysis.birth_date_label" />
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { value } }) => (
                <TouchableOpacity onPress={() => setOpenDate(true)} activeOpacity={0.8}>
                   <View className="border border-neutral-200 rounded-xl p-4 bg-white">
                      <Text className={value ? "text-black" : "text-neutral-400"}>
                        {value ? format(value, 'yyyy-MM-dd') : translate('analysis.select_date_placeholder')}
                      </Text>
                   </View>
                </TouchableOpacity>
              )}
            />
            {errors.birthDate && (
               <Text className="text-red-500 text-sm mt-1">{translate('analysis.select_birth_date_error')}</Text>
            )}
            
            <DatePicker
              modal
              open={openDate}
              date={selectedDate || new Date(2000, 0, 1)}
              mode="date"
              locale="zh-CN"
              confirmText={translate('common.confirm')}
              cancelText={translate('common.cancel')}
              title={translate('analysis.select_birth_date_title')}
              onConfirm={(date) => {
                setOpenDate(false);
                setValue('birthDate', date);
              }}
              onCancel={() => {
                setOpenDate(false);
              }}
            />
          </View>

          {/* Birth Time Picker Trigger */}
          <View className="mb-6">
            <Text className="mb-2 font-semibold text-black" tx="analysis.birth_time_label" />
            <Controller
              control={control}
              name="birthTime"
              render={({ field: { value } }) => (
                <TouchableOpacity onPress={() => setOpenTime(true)} activeOpacity={0.8}>
                   <View className="border border-neutral-200 rounded-xl p-4 bg-white">
                      <Text className={value ? "text-black" : "text-neutral-400"}>
                        {value ? format(value, 'HH:mm') : translate('analysis.select_time_placeholder')}
                      </Text>
                   </View>
                </TouchableOpacity>
              )}
            />
             {errors.birthTime && (
               <Text className="text-red-500 text-sm mt-1">{translate('analysis.select_birth_time_error')}</Text>
            )}

            <DatePicker
              modal
              open={openTime}
              date={selectedTime || new Date()}
              mode="time"
              locale="zh-CN"
              confirmText={translate('common.confirm')}
              cancelText={translate('common.cancel')}
              title={translate('analysis.select_birth_time_title')}
              onConfirm={(date) => {
                setOpenTime(false);
                setValue('birthTime', date);
              }}
              onCancel={() => {
                setOpenTime(false);
              }}
            />
          </View>

          {/* Gender Selection */}
          <View className="mb-8">
            <Text className="mb-2 font-semibold text-black" tx="analysis.gender_label" />
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row gap-4">
                   <TouchableOpacity 
                      onPress={() => onChange('female')}
                      className={`flex-1 py-3 rounded-full border items-center ${value === 'female' ? 'bg-black border-black' : 'bg-transparent border-neutral-300'}`}
                   >
                      <Text className={value === 'female' ? 'text-white font-bold' : 'text-neutral-500'} tx="analysis.gender_female" />
                   </TouchableOpacity>

                   <TouchableOpacity 
                      onPress={() => onChange('male')}
                      className={`flex-1 py-3 rounded-full border items-center ${value === 'male' ? 'bg-black border-black' : 'bg-transparent border-neutral-300'}`}
                   >
                      <Text className={value === 'male' ? 'text-white font-bold' : 'text-neutral-500'} tx="analysis.gender_male" />
                   </TouchableOpacity>
                </View>
              )}
            />
             {errors.gender && (
               <Text className="text-red-500 text-sm mt-1">{translate('analysis.select_gender_error')}</Text>
            )}
          </View>

          <Button 
            label={translate('analysis.start_analysis')}
            onPress={handleSubmit(onSubmit)} 
            size="lg"
            className="rounded-full"
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  content: {
    padding: 24,
    paddingTop: 10,
  },
});
