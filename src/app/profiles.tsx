import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';

import { Text, FocusAwareStatusBar } from '@/components/ui';
import { translate } from '@/lib';
import { usePendingProfile, PendingProfile } from '@/hooks/usePendingProfile';
import { ArrowRight } from '@/components/ui/icons';
import { CitySearchInput } from '@/components/city-search-input';
import { CityResult, preloadCitiesData } from '@/hooks/useCitySearch';

/**
 * 档案管理页面
 * - 默认显示已保存档案列表（My Profiles）
 * - 点击 Add New Profile 进入新增表单（New Profile）
 * - 点击 Edit Profile 进入编辑表单（Edit Profile）
 */
export default function ProfilesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  
  const { addProfile, removeProfile, updateProfile, getProfiles } = usePendingProfile();
  
  // 档案列表状态
  const [profiles, setProfiles] = useState<PendingProfile[]>([]);
  
  // 页面模式: 'list' | 'new' | 'edit'
  const [mode, setMode] = useState<'list' | 'new' | 'edit'>('list');
  // 当前编辑的档案 ID
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // 表单状态
  const [label, setLabel] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  
  // 日期/时间选择器状态
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  // 页面加载时获取档案列表并预加载城市数据
  useEffect(() => {
    preloadCitiesData();
    refreshProfiles();
  }, []);

  // 刷新档案列表
  const refreshProfiles = () => {
    const latestProfiles = getProfiles();
    setProfiles(latestProfiles);
  };

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

  // 点击添加新档案
  const handleAddNew = () => {
    setLabel('');
    setBirthCity('');
    setSelectedDate(null);
    setSelectedTime(null);
    setGender('female');
    setEditingId(null);
    setMode('new');
  };

  // 点击编辑档案
  const handleEdit = (profile: PendingProfile) => {
    setEditingId(profile.id);
    setLabel(profile.label || '');
    setBirthCity(profile.city || '');
    setSelectedDate(new Date(profile.birthDate));
    setSelectedTime(profile.birthTime ? new Date(`2000-01-01T${profile.birthTime}`) : null);
    setGender(profile.gender);
    setMode('edit');
  };

  // 处理城市选择
  const handleCitySelect = (city: CityResult) => {
    setBirthCity(city.displayName);
  };

  // 保存档案
  const handleSave = () => {
    if (!selectedDate || !label) return;
    
    const profileData = {
      label,
      birthDate: format(selectedDate, 'yyyy-MM-dd'),
      birthTime: selectedTime ? format(selectedTime, 'HH:mm') : undefined,
      gender,
      city: birthCity || undefined,
    };
    
    if (mode === 'edit' && editingId) {
      // 更新已有档案
      updateProfile(editingId, profileData);
    } else {
      // 添加新档案
      addProfile(profileData);
    }
    
    refreshProfiles();
    backToList();
  };

  // 删除档案
  const handleDelete = (id: string) => {
    removeProfile(id);
    refreshProfiles();
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

              {/* 已保存的档案列表 */}
              {profiles.map((profile: PendingProfile) => (
                <View 
                  key={profile.id}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-black dark:text-white mb-1">
                        {profile.label || translate('profiles.unnamed')}
                      </Text>
                      <Text className="text-neutral-500 dark:text-neutral-400 text-sm">
                        {profile.birthDate}
                        {profile.birthTime && ` ${profile.birthTime}`}
                      </Text>
                      {profile.city && (
                        <Text className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
                          {profile.city}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity 
                        onPress={() => handleEdit(profile)}
                        className="p-2"
                      >
                        <Text className="text-blue-500 text-sm">{translate('profiles.edit')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleDelete(profile.id)}
                        className="p-2"
                      >
                        <Text className="text-red-500 text-sm">{translate('common.delete')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              {/* 空状态提示 */}
              {profiles.length === 0 && (
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
                className="w-full py-3 rounded-full bg-black dark:bg-white items-center"
              >
                <Text className="text-white dark:text-black font-bold">{translate('common.save')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
