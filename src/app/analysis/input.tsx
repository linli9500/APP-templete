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
import { useAuth } from '@/lib/auth';
import { usePendingProfile } from '@/hooks/usePendingProfile';


const schema = z.object({
  birthDate: z.date({ required_error: "请选择出生日期" }),
  birthTime: z.date({ required_error: "请选择出生时间" }),
  gender: z.enum(['male', 'female', 'other'], { required_error: "请选择性别" }),
});

type FormData = z.infer<typeof schema>;

// ... (imports)

// ... (schema)

export default function AnalysisInputScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation(); 
  
  // 获取登录状态
  const token = useAuth.use.token();
  const isLoggedIn = !!token;
  
  // 本地档案存储 hook
  const { addProfile } = usePendingProfile();
  
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
    const birthDateStr = format(data.birthDate, 'yyyy-MM-dd');
    const birthTimeStr = format(data.birthTime, 'HH:mm');
    
    // 如果用户未登录，将数据保存到本地（等待注册后同步）
    if (!isLoggedIn) {
      addProfile({
        birthDate: birthDateStr,
        birthTime: birthTimeStr,
        gender: data.gender,
      });
      console.log('[Analysis] 用户未登录，已保存分析数据到本地');
    }
    
    // 无论是否登录都继续跳转到报告页面
    router.push({
      pathname: '/analysis/report',
      params: {
        birthDate: birthDateStr,
        birthTime: birthTimeStr,
        gender: data.gender,
        language: i18n.language,
        key: 'test_analysis', 
      }
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View 
         style={{ paddingTop: insets.top }} 
         className="flex-1 bg-pattern-bg dark:bg-black"
      >
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
          <Text className="text-3xl font-bold mb-2 text-black dark:text-white" tx="insight.title" />
          <Text className="text-neutral-500 dark:text-neutral-400 mb-8 text-base" tx="analysis.input_instruction" />

          {/* Birth Date Picker Trigger */}
          <View className="mb-6">
            <Text className="mb-2 font-semibold text-black dark:text-white" tx="analysis.birth_date_label" />
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { value } }) => (
                <TouchableOpacity onPress={() => setOpenDate(true)} activeOpacity={0.8}>
                   <View className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
                      <Text className={value ? "text-black dark:text-white" : "text-neutral-400"}>
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
              locale={i18n.language}
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
            <Text className="mb-2 font-semibold text-black dark:text-white" tx="analysis.birth_time_label" />
            <Controller
              control={control}
              name="birthTime"
              render={({ field: { value } }) => (
                <TouchableOpacity onPress={() => setOpenTime(true)} activeOpacity={0.8}>
                   <View className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
                      <Text className={value ? "text-black dark:text-white" : "text-neutral-400"}>
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
              locale="en-GB" // Force 24h format
              is24hourSource="locale"
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
            <Text className="mb-2 font-semibold text-black dark:text-white" tx="analysis.gender_label" />
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row gap-4">
                   <TouchableOpacity 
                      onPress={() => onChange('female')}
                      className={`flex-1 py-3 rounded-full border items-center ${value === 'female' ? 'bg-black dark:bg-white border-black dark:border-white' : 'bg-transparent border-neutral-300 dark:border-neutral-700'}`}
                   >
                      <Text className={value === 'female' ? 'text-white dark:text-black font-bold' : 'text-neutral-500'} tx="analysis.gender_female" />
                   </TouchableOpacity>

                   <TouchableOpacity 
                      onPress={() => onChange('male')}
                      className={`flex-1 py-3 rounded-full border items-center ${value === 'male' ? 'bg-black dark:bg-white border-black dark:border-white' : 'bg-transparent border-neutral-300 dark:border-neutral-700'}`}
                   >
                      <Text className={value === 'male' ? 'text-white dark:text-black font-bold' : 'text-neutral-500'} tx="analysis.gender_male" />
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
  content: {
    padding: 24,
    paddingTop: 10,
  },
});
