import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-native-date-picker';
import { format, parse } from 'date-fns';
import { useColorScheme } from 'nativewind';

import { Text, FocusAwareStatusBar } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from '@/components/ui/icons';
import { useTranslation } from 'react-i18next';
import { translate } from '@/lib';
import { useAuth } from '@/lib/auth';
import { usePendingProfile } from '@/hooks/usePendingProfile';
import { useProfileStore, ProfileData } from '@/stores/profile-store';

const schema = z.object({
  birthDate: z.date({ required_error: translate('analysis.select_birth_date_error') }),
  birthTime: z.date({ required_error: translate('analysis.select_birth_time_error') }),
  gender: z.enum(['male', 'female'], { required_error: translate('analysis.select_gender_error') }),
});

type FormData = z.infer<typeof schema>;

/**
 * 解析时间字符串 "HH:mm" 为 Date 对象
 */
const parseTimeString = (timeStr: string): Date | undefined => {
  if (!timeStr || !timeStr.includes(':')) return undefined;
  try {
    return parse(timeStr, 'HH:mm', new Date());
  } catch {
    return undefined;
  }
};

export default function AnalysisInputScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  
  // 获取登录状态
  const token = useAuth.use.token();
  const isLoggedIn = !!token;
  
  // Profile Store
  const { profiles, defaultProfileId, addProfile: addToStore } = useProfileStore();
  
  // 本地档案存储 hook（用于未登录用户）
  const { addProfile } = usePendingProfile();
  
  // Profile 选择弹窗状态
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  
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
  
  // 获取 profiles 列表
  const profileList = useMemo(() => Object.values(profiles), [profiles]);
  
  // 当前选中的 profile
  const currentProfile = useMemo(() => {
    const id = selectedProfileId || defaultProfileId;
    return id ? profiles[id] : null;
  }, [selectedProfileId, defaultProfileId, profiles]);

  // 页面加载时自动填充默认 profile
  useEffect(() => {
    if (defaultProfileId && profiles[defaultProfileId]) {
      const defaultProfile = profiles[defaultProfileId];
      setSelectedProfileId(defaultProfileId);
      fillFormWithProfile(defaultProfile);
    }
  }, []); // 仅在首次加载时执行

  // 使用 profile 数据填充表单
  const fillFormWithProfile = (profile: ProfileData) => {
    setValue('birthDate', new Date(profile.birthDate));
    if (profile.birthTime) {
      const time = parseTimeString(profile.birthTime);
      if (time) setValue('birthTime', time);
    }
    setValue('gender', profile.gender);
  };

  // 选择 profile
  const handleSelectProfile = (profile: ProfileData) => {
    setSelectedProfileId(profile.id);
    fillFormWithProfile(profile);
    setShowProfileModal(false);
  };

  const onSubmit = (data: FormData) => {
    const birthDateStr = format(data.birthDate, 'yyyy-MM-dd');
    const birthTimeStr = format(data.birthTime, 'HH:mm');
    
    // 检查是否已有相同数据的 profile（按 birthDate + gender 匹配）
    const exists = profileList.some(p => 
      p.birthDate === birthDateStr && p.gender === data.gender
    );
    
    // 如果数据不存在，自动保存为新 profile
    if (!exists && birthDateStr) {
      addToStore({
        birthDate: birthDateStr,
        birthTime: birthTimeStr || undefined,
        gender: data.gender,
        label: translate('analysis.auto_saved') || 'Auto Saved',
      });
      console.log('[Analysis] 自动保存新 profile');
    }
    
    // 如果用户未登录，也保存到 pending（用于后续同步）
    if (!isLoggedIn) {
      addProfile({
        birthDate: birthDateStr,
        birthTime: birthTimeStr,
        gender: data.gender,
      });
      console.log('[Analysis] 用户未登录，已保存分析数据到本地');
    }
    
    // 跳转到报告页面
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
          <Text className="text-neutral-500 dark:text-neutral-400 mb-4 text-base" tx="analysis.input_instruction" />

          {/* Profile 选择入口 */}
          {profileList.length > 0 && (
            <TouchableOpacity 
              onPress={() => setShowProfileModal(true)}
              className="bg-white dark:bg-neutral-900 rounded-xl p-4 mb-6 flex-row items-center justify-between border border-neutral-200 dark:border-neutral-700"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 items-center justify-center mr-3">
                  <Star color="#F59E0B" filled={!!currentProfile} width={20} height={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-neutral-400 dark:text-neutral-500">
                    {translate('analysis.using_profile') || 'Using'}
                  </Text>
                  <Text className="text-black dark:text-white font-semibold">
                    {currentProfile?.label || translate('analysis.select_profile') || 'Select Profile'}
                  </Text>
                </View>
              </View>
              <ArrowRight color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} width={16} height={16} />
            </TouchableOpacity>
          )}

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
                setSelectedProfileId(null); // 手动修改后清除 profile 选择
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
            <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              {translate('analysis.birth_time_hint') || '填入出生时间，准确度提升50%以上'}
            </Text>
            {errors.birthTime && (
               <Text className="text-red-500 text-sm mt-1">{translate('analysis.select_birth_time_error') || '请选择出生时间'}</Text>
            )}

            <DatePicker
              modal
              open={openTime}
              date={selectedTime || new Date()}
              mode="time"
              locale="en-GB"
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

      {/* Profile 选择弹窗 */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-neutral-900 rounded-t-3xl max-h-[70%]">
            {/* 弹窗头部 */}
            <View className="flex-row items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <Text className="text-lg font-bold text-black dark:text-white">
                {translate('analysis.select_profile') || 'Select Profile'}
              </Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Text className="text-blue-500">{translate('common.cancel')}</Text>
              </TouchableOpacity>
            </View>
            
            {/* Profile 列表 */}
            <ScrollView className="p-4">
              {profileList.map((profile) => {
                const isSelected = profile.id === selectedProfileId;
                const isDefault = profile.id === defaultProfileId;
                return (
                  <TouchableOpacity
                    key={profile.id}
                    onPress={() => handleSelectProfile(profile)}
                    className={`p-4 rounded-xl mb-3 flex-row items-center ${
                      isSelected 
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400' 
                        : 'bg-neutral-50 dark:bg-neutral-800'
                    }`}
                  >
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="font-semibold text-black dark:text-white">
                          {profile.label || translate('profiles.unnamed')}
                        </Text>
                        {isDefault && (
                          <View className="bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                            <Text className="text-amber-600 dark:text-amber-400 text-xs">
                              {translate('profiles.default')}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                        {profile.birthDate} {profile.birthTime && `· ${profile.birthTime}`}
                      </Text>
                    </View>
                    {isSelected && (
                      <View className="w-6 h-6 rounded-full bg-amber-400 items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingTop: 10,
  },
});
