import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { format } from 'date-fns';

import { Text } from '@/components/ui/text';
import { ArrowLeft, Trash } from '@/components/ui/icons'; 
import { translate } from '@/lib';
import { useHistoryStore, ReportData } from '@/stores/history-store';
import { deleteHistoryReport } from '@/api/history';
import { showErrorMessage } from '@/components/ui/utils'; 
import { ConfirmModal } from '@/components/ui/confirm-modal';


export default function HistoryListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { reports, removeReport } = useHistoryStore();
  
  // 删除确认弹窗状态
  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean;
    id: string | null;
  }>({ visible: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Convert map to array and sort by date descending
  const reportList = Object.values(reports).sort((a: ReportData, b: ReportData) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDelete = useCallback((id: string) => {
    setDeleteModal({ visible: true, id });
  }, []);

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    
    setIsDeleting(true);
    try {
      // 1. 本地删除 UI 立即更新
      removeReport(deleteModal.id);
      // 2. 远程删除
      await deleteHistoryReport(deleteModal.id);
      setDeleteModal({ visible: false, id: null });
    } catch (error) {
      console.error('Delete failed', error);
      showErrorMessage('Failed to delete report');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderItem = ({ item }: { item: ReportData }) => (
    <TouchableOpacity
      className="bg-white dark:bg-neutral-800 rounded-2xl p-4 mb-3 flex-row items-center justify-between shadow-sm"
      onPress={() => router.push(`/analysis/history/${item.id}`)}
      activeOpacity={0.7}
    >
      <View className="flex-1 mr-4">
        <View className="flex-row items-baseline mb-1">
          <Text className="text-lg font-bold text-black dark:text-white mr-2">
            Analysis
          </Text>
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">
             {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm')}
          </Text>
        </View>
        
        {/* 显示出生信息作为摘要 */}
        <Text className="text-sm text-neutral-600 dark:text-neutral-300" numberOfLines={1}>
           {item.birthDate} {item.birthTime} {item.gender === 'male' ? '♂' : '♀'}
        </Text>
        
        {item.summary && (
           <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-1" numberOfLines={2}>
             {item.summary}
           </Text>
        )}
      </View>

      <TouchableOpacity 
        className="p-2"
        onPress={(e) => {
            e.stopPropagation();
            handleDelete(item.id);
        }}
      >
         <Trash width={20} height={20} color={isDark ? '#ef4444' : '#ef4444'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top }} 
        className="px-6 pb-4 bg-[#F5F5F0] dark:bg-black z-10"
      >
        <View className="flex-row items-center justify-between h-12">
            <TouchableOpacity 
                onPress={() => router.back()}
                className="w-10 h-10 justify-center items-start"
            >
                <ArrowLeft width={28} height={28} color={isDark ? 'white' : 'black'} />
            </TouchableOpacity>
            
            <Text className="text-xl font-bold text-black dark:text-white">
                {translate('analysis.history_title')}
            </Text>
            
            <View className="w-10" />
        </View>
      </View>

      {/* List */}
      <View className="flex-1 px-4">
        <FlashList
          data={reportList}
          renderItem={renderItem}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-neutral-400 dark:text-neutral-600 text-base">
                {translate('analysis.no_history')}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        />
      </View>

      {/* 删除确认弹窗 */}
      <ConfirmModal
        visible={deleteModal.visible}
        title={translate('analysis.delete_confirm')}
        message={translate('analysis.delete_desc')}
        confirmText={translate('analysis.delete')}
        cancelText={translate('analysis.cancel')}
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteModal({ visible: false, id: null })}
      />
    </View>
  );
}
