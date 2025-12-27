import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useMutation } from '@tanstack/react-query';

import { Text, FocusAwareStatusBar } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';
import { translate } from '@/lib';
import { client } from '@/api/common/client';
import { InfoModal } from '@/components/ui/confirm-modal';

/**
 * 提交反馈到后端
 */
const submitFeedback = async (data: {
  content: string;
  rating?: number;
  contact?: string;
}) => {
  const response = await client.post('/app/feedback', {
    ...data,
    source: 'app', // 标识来源为 app
  });
  return response.data;
};

/**
 * 星级评分组件
 */
const StarRating = ({ 
  rating, 
  onRatingChange 
}: { 
  rating: number; 
  onRatingChange: (rating: number) => void;
}) => {
  const { colorScheme } = useColorScheme();
  
  return (
    <View className="flex-row space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          className="p-1"
        >
          <Text 
            className={`text-2xl ${
              star <= rating 
                ? 'text-yellow-500' 
                : colorScheme === 'dark' 
                  ? 'text-neutral-600' 
                  : 'text-neutral-300'
            }`}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function FeedbackPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  
  // 表单状态
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [contact, setContact] = useState('');
  
  // 结果弹窗状态
  const [resultModal, setResultModal] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ visible: false, type: 'success', title: '', message: '' });

  // 提交反馈 mutation
  const feedbackMutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      setResultModal({
        visible: true,
        type: 'success',
        title: translate('feedback.success_title'),
        message: translate('feedback.success_message'),
      });
      // 清空表单
      setContent('');
      setRating(0);
      setContact('');
    },
    onError: () => {
      setResultModal({
        visible: true,
        type: 'error',
        title: translate('common.error'),
        message: translate('feedback.error_message'),
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      setResultModal({
        visible: true,
        type: 'error',
        title: translate('common.error'),
        message: translate('feedback.content_required'),
      });
      return;
    }

    feedbackMutation.mutate({
      content: content.trim(),
      rating: rating > 0 ? rating : undefined,
      contact: contact.trim() || undefined,
    });
  };

  const handleModalClose = () => {
    setResultModal({ ...resultModal, visible: false });
    // 成功后返回上一页
    if (resultModal.type === 'success') {
      router.back();
    }
  };

  const inputBgColor = colorScheme === 'dark' ? 'bg-neutral-800' : 'bg-white';
  const inputTextColor = colorScheme === 'dark' ? 'text-white' : 'text-black';
  const placeholderColor = colorScheme === 'dark' ? '#A3A3A3' : '#9CA3AF';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View 
          className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900 px-6" 
          style={{ paddingTop: insets.top }}
        >
          <FocusAwareStatusBar />
          
          {/* 自定义导航栏 */}
          <View className="flex-row items-center justify-between mt-6 mb-6">
            <TouchableOpacity onPress={() => router.back()}>
              <View 
                className="w-8 h-8 rounded-full bg-black dark:bg-neutral-800 justify-center items-center" 
                style={{ transform: [{ rotate: '180deg' }] }}
              >
                <ArrowRight color="white" width={16} height={16} />
              </View>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black dark:text-white flex-1 text-center pr-8">
              {translate('feedback.title')}
            </Text>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* 反馈内容输入 */}
            <View className="mb-6">
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder={translate('feedback.content_placeholder')}
                placeholderTextColor={placeholderColor}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className={`${inputBgColor} ${inputTextColor} rounded-2xl p-4 min-h-[160px] text-base`}
                style={{ 
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                }}
              />
            </View>

            {/* 评分 */}
            <View className="mb-6">
              <Text className="text-base font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                {translate('feedback.rating_label')}
              </Text>
              <StarRating rating={rating} onRatingChange={setRating} />
            </View>

            {/* 联系方式（可选） */}
            <View className="mb-8">
              <Text className="text-base font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                {translate('feedback.contact_label')}
              </Text>
              <TextInput
                value={contact}
                onChangeText={setContact}
                placeholder={translate('feedback.contact_placeholder')}
                placeholderTextColor={placeholderColor}
                keyboardType="email-address"
                autoCapitalize="none"
                className={`${inputBgColor} ${inputTextColor} rounded-2xl px-4 py-3.5 text-base`}
                style={{ 
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                }}
              />
            </View>

            {/* 提交按钮 */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={feedbackMutation.isPending}
              className={`bg-black dark:bg-white rounded-full py-4 items-center ${
                feedbackMutation.isPending ? 'opacity-60' : ''
              }`}
            >
              {feedbackMutation.isPending ? (
                <View className="flex-row items-center space-x-2">
                  <ActivityIndicator 
                    size="small" 
                    color={colorScheme === 'dark' ? 'black' : 'white'} 
                  />
                  <Text className="text-white dark:text-black font-bold text-base ml-2">
                    {translate('feedback.submitting')}
                  </Text>
                </View>
              ) : (
                <Text className="text-white dark:text-black font-bold text-base">
                  {translate('feedback.submit')}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* 结果弹窗 */}
      <InfoModal
        visible={resultModal.visible}
        title={resultModal.title}
        message={resultModal.message}
        type={resultModal.type}
        onClose={handleModalClose}
      />
    </>
  );
}
