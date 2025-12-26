import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useHistoryStore } from '@/stores/history-store';
import { StreamReport } from '@/components/analysis/StreamReport';
import { fetchReportDetail } from '@/api/history';
import { showErrorMessage } from '@/components/ui/utils';
import { translate } from '@/lib';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { reports, addReport } = useHistoryStore();
  
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    loadReport();
  }, [id]);

  const loadReport = async () => {
    setLoading(true);
    // 1. Try Local
    const localReport = reports[id];
    if (localReport) {
      setContent(localReport.content);
      setLoading(false);
      return;
    }

    // 2. Try Remote (Fallback)
    try {
      const detail = await fetchReportDetail(id);
      setContent(detail.content);
      // Save for next time
      addReport({
        id: detail.id,
        createdAt: detail.created_at,
        content: detail.content,
        birthDate: detail.birth_date,
        birthTime: detail.birth_time,
        gender: detail.gender,
        summary: detail.summary
      });
    } catch (error) {
      console.error('Failed to load report detail', error);
      showErrorMessage(translate('analysis.request_failed'));
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-pattern-bg dark:bg-black justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-pattern-bg dark:bg-black">
         <StreamReport 
            content={content} 
            isEffectActive={false} // Disable typing effect for history
         />
      </SafeAreaView>
    </>
  );
}
