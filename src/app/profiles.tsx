import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';

import { Text, FocusAwareStatusBar } from '@/components/ui';
import { translate } from '@/lib';
import { useProfileManager } from '@/hooks/useProfileManager';
import { Profile } from '@/api/profiles';
import { ArrowRight, Edit, Trash, Star } from '@/components/ui/icons';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { CitySearchInput } from '@/components/city-search-input';
import { CityResult, preloadCitiesData } from '@/hooks/useCitySearch';
import { useProfileStore } from '@/stores/profile-store';

/**
 * 档案管理页面
 * - 默认显示已保存档案列表（My Profiles）
 * - 点击 Add New Profile 进入新增表单（New Profile）
 * - 点击 Edit Profile 进入编辑表单（Edit Profile）
 * 
 * 性能优化：城市数据延迟加载，只在进入表单时加载
 */
export default function ProfilesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  
  // 使用统一的 ProfileManager Hook
  const { profiles, isLoading, isMutating, addProfile, removeProfile, updateProfile, refresh } = useProfileManager();
  
  // 默认 profile 相关
  const { defaultProfileId, setDefaultProfile } = useProfileStore();
  
  // 对 profiles 排序：默认的排在最前面
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (a.id === defaultProfileId) return -1;
    if (b.id === defaultProfileId) return 1;
    return 0;
  });
  
  // 页面模式: 'list' | 'new' | 'edit'
  const [mode, setMode] = useState<'list' | 'new' | 'edit'>('list');
  // 当前编辑的档案 ID
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // 城市数据加载状态（用于显示 Loading 遮罩）
  const [isCityDataLoading, setIsCityDataLoading] = useState(false);
  
  // 删除确认弹窗状态
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // 表单状态
  const [label, setLabel] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  
  // 日期/时间选择器状态
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  // 页面加载时仅获取档案列表，不预加载城市数据（性能优化）
  useEffect(() => {
    refresh();
    // 移除城市数据预加载，改为按需加载
  }, []);

  /**
   * 加载城市数据（带 Loading 状态）
   * 返回 Promise，加载完成后 resolve
   */
  const loadCityDataWithLoading = useCallback(async () => {
    setIsCityDataLoading(true);
    try {
      // 等待城市数据加载完成
      await preloadCitiesData();
    } finally {
      setIsCityDataLoading(false);
    }
  }, []);

  // 重置表单并返回列表
  const backToList = () => {
    setLabel('');
    setBirthCity('');
    setSelectedDate(null);
    setSelectedTime(null);
    setGender('female');
    setEditingId(null);
    setMode('list');
  };

  // 点击添加新档案（先加载城市数据）
  const handleAddNew = async () => {
    // 先显示 Loading，加载城市数据
    await loadCityDataWithLoading();
    
    // 重置表单
    setLabel('');
    setBirthCity('');
    setSelectedDate(null);
    setSelectedTime(null);
    setGender('female');
    setEditingId(null);
    setMode('new');
  };

  // 点击编辑档案（先加载城市数据）
  const handleEdit = async (profile: Profile) => {
    // 先显示 Loading，加载城市数据
    await loadCityDataWithLoading();
    
    // 填充表单
    setEditingId(profile.id);
    setLabel(profile.label || '');
    setBirthCity(profile.city || '');
    setSelectedDate(new Date(profile.birthDate));
    // 处理 birthTime 可能为空的情况
    if (profile.birthTime) {
      if (profile.birthTime.includes(':')) {
        setSelectedTime(new Date(`2000-01-01T${profile.birthTime}`));
      } else {
        setSelectedTime(null);
      }
    } else {
      setSelectedTime(null);
    }
    setGender(profile.gender);
    setMode('edit');
  };

  // 处理城市选择
  const handleCitySelect = (city: CityResult) => {
    setBirthCity(city.displayName);
  };

  // 保存档案
  const handleSave = async () => {
    if (!selectedDate || !label || !selectedTime) {
      // TODO: Show toast error
      return;
    }
    
    const profileData = {
      label,
      birthDate: format(selectedDate, 'yyyy-MM-dd'),
      birthTime: format(selectedTime, 'HH:mm'),
      gender,
      city: birthCity || undefined,
    };
    
    try {
      if (mode === 'edit' && editingId) {
        // 更新已有档案
        await updateProfile(editingId, profileData);
      } else {
        // 添加新档案
        await addProfile(profileData);
      }
      backToList();
    } catch (error) {
      console.error('Save profile failed:', error);
      // 可以添加错误提示
    }
  };

  // 删除档案
  const handleDelete = async (id: string) => {
    try {
      await removeProfile(id);
    } catch (error) {
      console.error('Delete profile failed:', error);
    }
  };

  // 根据模式获取标题
  const getTitle = () => {
    switch (mode) {
      case 'new':
        return translate('profiles.new_profile');
      case 'edit':
        return translate('profiles.edit_profile');
      default:
        return translate('profiles.title');
    }
  };

  // 处理返回按钮
  const handleBack = () => {
    if (mode === 'list') {
      router.back();
    } else {
      backToList();
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View 
        style={{ paddingTop: insets.top }} 
        className="flex-1 bg-pattern-bg dark:bg-black"
      >
        <FocusAwareStatusBar />

        {/* 页面头部 */}
        <View className="flex-row items-center justify-between mt-2 mb-6 px-4">
          <TouchableOpacity onPress={handleBack}>
            <View 
              className="w-8 h-8 rounded-full bg-black dark:bg-neutral-800 justify-center items-center" 
              style={{ transform: [{ rotate: '180deg' }] }}
            >
              <ArrowRight color="white" width={16} height={16} />
            </View>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold text-black dark:text-white">
            {getTitle()}
          </Text>
          <View className="w-8" />
        </View>

        {/* 覆盖全屏的加载指示器 (API 操作或城市数据加载时) */}
        {(isLoading || isCityDataLoading) && (
          <View className="absolute inset-0 z-50 bg-black/10 dark:bg-white/10 justify-center items-center">
             <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} />
             {isCityDataLoading && (
               <Text className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm">
                 {translate('common.loading') || 'Loading...'}
               </Text>
             )}
          </View>
        )}

        <ScrollView className="flex-1 px-4">
          {/* ========== 列表模式 ========== */}
          {mode === 'list' && (
            <>
              {/* 添加新档案按钮 */}
              <TouchableOpacity 
                onPress={handleAddNew}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 items-center"
              >
                <Text className="text-black dark:text-white font-semibold">
                  + {translate('profiles.add_new')}
                </Text>
              </TouchableOpacity>

              {/* 已保存的档案列表（默认的排在前面） */}
              {sortedProfiles.map((profile: Profile) => {
                const isDefault = profile.id === defaultProfileId;
                return (
                <View 
                  key={profile.id}
                  className={`bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 ${isDefault ? 'border-2 border-amber-400' : ''}`}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-lg font-semibold text-black dark:text-white">
                          {profile.label || translate('profiles.unnamed')}
                        </Text>
                        {isDefault && (
                          <View className="bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                            <Text className="text-amber-600 dark:text-amber-400 text-xs">
                              {translate('profiles.default') || 'Default'}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                        {profile.birthDate}
                        {profile.birthTime && ` ${profile.birthTime}`}
                      </Text>
                      {profile.city && (
                        <Text className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
                          {profile.city}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row gap-1">
                       {/* 设为默认按钮 - 星标图标 */}
                      <TouchableOpacity 
                        onPress={() => setDefaultProfile(profile.id)}
                        className="p-2"
                        disabled={isMutating || isDefault}
                      >
                        <Star 
                          color={isDefault ? '#F59E0B' : (colorScheme === 'dark' ? '#9CA3AF' : '#6B7280')} 
                          filled={isDefault}
                          width={20} 
                          height={20} 
                        />
                      </TouchableOpacity>
                       {/* 编辑按钮 - 图标 */}
                      <TouchableOpacity 
                        onPress={() => handleEdit(profile)}
                        className="p-2"
                        disabled={isMutating || isCityDataLoading}
                      >
                        <Edit color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'} width={20} height={20} />
                      </TouchableOpacity>
                       {/* 删除按钮 - 图标，点击弹出确认 */}
                      <TouchableOpacity 
                        onPress={() => setDeleteConfirmId(profile.id)}
                        className="p-2"
                        disabled={isMutating}
                      >
                        <Trash color={colorScheme === 'dark' ? '#F87171' : '#EF4444'} width={20} height={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );})}

              {/* 空状态提示 */}
              {!isLoading && profiles.length === 0 && (
                <View className="items-center py-8">
                  <Text className="text-neutral-400 dark:text-neutral-500">
                    {translate('profiles.empty_hint')}
                  </Text>
                </View>
              )}
            </>
          )}

          {/* ========== 新增/编辑模式 ========== */}
          {(mode === 'new' || mode === 'edit') && (
            <View className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4">
              {/* 档案名称 */}
              <View className="mb-4">
                <Text className="mb-2 font-semibold text-black dark:text-white">
                  {translate('profiles.label')}
                </Text>
                <TextInput
                  className="border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-black dark:text-white bg-neutral-50 dark:bg-neutral-800"
                  value={label}
                  onChangeText={setLabel}
                  placeholder={translate('profiles.label_placeholder')}
                  placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
                />
              </View>

              {/* 出生日期 */}
              <View className="mb-4">
                <Text className="mb-2 font-semibold text-black dark:text-white">
                  {translate('profiles.birth_date')}
                </Text>
                <TouchableOpacity onPress={() => setOpenDate(true)} activeOpacity={0.8}>
                  <View className="border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 bg-neutral-50 dark:bg-neutral-800">
                    <Text className={selectedDate ? 'text-black dark:text-white' : 'text-neutral-400'}>
                      {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : translate('profiles.select_date')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={openDate}
                  date={selectedDate || new Date(2000, 0, 1)}
                  mode="date"
                  confirmText={translate('common.confirm')}
                  cancelText={translate('common.cancel')}
                  title={translate('profiles.select_birth_date')}
                  onConfirm={(date) => {
                    setOpenDate(false);
                    setSelectedDate(date);
                  }}
                  onCancel={() => setOpenDate(false)}
                />
              </View>

              {/* 出生时间 */}
              <View className="mb-4">
                <Text className="mb-2 font-semibold text-black dark:text-white">
                  {translate('profiles.birth_time')}
                </Text>
                <TouchableOpacity onPress={() => setOpenTime(true)} activeOpacity={0.8}>
                  <View className="border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 bg-neutral-50 dark:bg-neutral-800">
                    <Text className={selectedTime ? 'text-black dark:text-white' : 'text-neutral-400'}>
                      {selectedTime ? format(selectedTime, 'HH:mm') : translate('profiles.select_time')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  {translate('analysis.birth_time_hint') || '填入出生时间，准确度提升50%以上'}
                </Text>
                <DatePicker
                  modal
                  open={openTime}
                  date={selectedTime || new Date()}
                  mode="time"
                  locale="en-GB"
                  is24hourSource="locale"
                  confirmText={translate('common.confirm')}
                  cancelText={translate('common.cancel')}
                  title={translate('profiles.select_birth_time')}
                  onConfirm={(date) => {
                    setOpenTime(false);
                    setSelectedTime(date);
                  }}
                  onCancel={() => setOpenTime(false)}
                />
              </View>

              {/* 出生城市 */}
              <View className="mb-4">
                <Text className="mb-2 font-semibold text-black dark:text-white">
                  {translate('profiles.birth_city')}
                </Text>
                <CitySearchInput
                  value={birthCity}
                  onSelect={handleCitySelect}
                  placeholder={translate('profiles.search_city')}
                />
              </View>

              {/* 性别选择 */}
              <View className="mb-6">
                <Text className="mb-2 font-semibold text-black dark:text-white">
                  {translate('profiles.gender')}
                </Text>
                <View className="flex-row gap-4">
                  <TouchableOpacity 
                    onPress={() => setGender('female')}
                    className={`flex-1 py-3 rounded-full border items-center ${
                      gender === 'female' 
                        ? 'bg-black dark:bg-white border-black dark:border-white' 
                        : 'bg-transparent border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    <Text className={gender === 'female' ? 'text-white dark:text-black font-bold' : 'text-neutral-500'}>
                      {translate('profiles.female')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setGender('male')}
                    className={`flex-1 py-3 rounded-full border items-center ${
                      gender === 'male' 
                        ? 'bg-black dark:bg-white border-black dark:border-white' 
                        : 'bg-transparent border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    <Text className={gender === 'male' ? 'text-white dark:text-black font-bold' : 'text-neutral-500'}>
                      {translate('profiles.male')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 保存按钮（无 Cancel 按钮） */}
              <TouchableOpacity 
                onPress={handleSave}
                disabled={isMutating}
                className={`w-full py-3 rounded-full items-center ${isMutating ? 'bg-neutral-400' : 'bg-black dark:bg-white'}`}
              >
                {isMutating ? (
                   <ActivityIndicator color="white" />
                ) : (
                   <Text className="text-white dark:text-black font-bold">{translate('common.save')}</Text>
                )}
                
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* 删除确认弹窗 */}
      <ConfirmModal
        visible={!!deleteConfirmId}
        title={translate('profiles.delete_confirm_title')}
        message={translate('profiles.delete_confirm_message')}
        confirmText={translate('common.delete')}
        cancelText={translate('common.cancel')}
        onConfirm={() => {
          if (deleteConfirmId) {
            handleDelete(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </>
  );
}
