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
          birthTime: (localParams.birthTime as string) || '12:00',
          gender: (localParams.gender as 'male' | 'female' | 'other') || 'male',
          language: (localParams.language as string) || 'zh-CN',
          key: (localParams.key as string) || 'test_analysis'
       });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONLY on mount/initial params load

  const handleStart = () => {
    startAnalysis({
      birthDate: (localParams.birthDate as string) || '1990-01-01',
      birthTime: (localParams.birthTime as string) || '12:00',
      gender: (localParams.gender as 'male' | 'female' | 'other') || 'male',
      language: (localParams.language as string) || 'zh-CN',
      key: (localParams.key as string) || 'test_analysis'
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-pattern-bg dark:bg-black">
        
        {/* State 1: Decoding Animation */}
        {isDecoding && <DecodingOverlay />}

        {/* State 3: Content Display */}
        {(!isDecoding && displayContent) && (
           <StreamReport 
              content={displayContent} 
              isEffectActive={isEffectActive || isLoading}
           />
        )}
      </SafeAreaView>
    </>
  );
}
