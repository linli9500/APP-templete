import React, { useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button'; // Assuming this exists or similar
import { Text } from '@/components/ui/text';
import { useStreamAnalysis } from '@/hooks/useStreamAnalysis';
import { DecodingOverlay } from '@/components/analysis/DecodingOverlay';
import { StreamReport } from '@/components/analysis/StreamReport';

export default function AnalysisReportScreen() {
  const { startAnalysis, displayContent, isDecoding, isLoading, isEffectActive } = useStreamAnalysis();
  
  const localParams = useLocalSearchParams();
  
  useEffect(() => {
    // Only auto-start once if parameters are present and we haven't started yet
    if (localParams.birthDate && !isDecoding && !displayContent && !isLoading) {
       // Optional: Add a check if we already failed? 
       // For now, let's keep auto-start but ensure it doesn't loop on error.
       // The issue is likely that error state resets isLoading, which triggers this again.
       // We should rely on a "mounted" flag or similar.
       startAnalysis({
          birthDate: localParams.birthDate as string,
          gender: (localParams.gender as 'male' | 'female' | 'other') || 'male',
          key: (localParams.key as string) || 'test_analysis'
       });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONLY on mount/initial params load

  const handleStart = () => {
    startAnalysis({
      birthDate: (localParams.birthDate as string) || '1990-01-01',
      gender: (localParams.gender as 'male' | 'female' | 'other') || 'male',
      key: (localParams.key as string) || 'test_analysis'
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F0' }}>
        
        {/* State 1: Decoding Animation */}
        {isDecoding && <DecodingOverlay />}

        {/* State 2: Report Display (or Empty Start State) */}
        {!isDecoding && !displayContent && !isLoading && (
           <View className="flex-1 justify-center items-center p-4">
              <Text className="text-xl mb-4 text-center">心理画像解码测试</Text>
              <Button 
                label="开始深度解码" 
                onPress={handleStart}
              />
              <Text className="mt-4 text-xs text-neutral-400">
                 请确保数据库中存在 key 为 'test_analysis' 的 prompt 配置
              </Text>
           </View>
        )}

        {/* State 3: Content Display */}
        {(!isDecoding && (displayContent || isLoading)) && (
           <StreamReport 
              content={displayContent} 
              isEffectActive={isEffectActive || isLoading}
              isLoading={isLoading}
           />
        )}
      </SafeAreaView>
    </>
  );
}
