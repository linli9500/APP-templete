import { useRef, useState } from 'react';
import { Env } from '@env';
import { useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { fetchStream } from '@/lib/fetch-stream';
import { showErrorMessage } from '@/components/ui/utils';
import { translate } from '@/lib';
import { useHistoryStore } from '@/stores/history-store';
import { v4 as uuidv4 } from 'uuid';

interface StreamAnalysisParams {
  birthDate: string;
  birthTime: string;
  gender?: 'male' | 'female' | 'other';
  language: string;
  key: string;
}

export const useStreamAnalysis = () => {
  const router = useRouter(); 
  const { addReport } = useHistoryStore(); 

  const [displayContent, setDisplayContent] = useState('');
  const [isDecoding, setIsDecoding] = useState(false); // True during the initial 8s animation
  const [isLoading, setIsLoading] = useState(false); // True while request is active
  const [isEffectActive, setIsEffectActive] = useState(false); // True when typewriter effect is running
  
  // Refs to hold mutable state without triggering re-renders
  const fullContentRef = useRef('');
  const displayedLengthRef = useRef(0);
  const streamDoneRef = useRef(false);
  const intervalIdRef = useRef<any>(null);
  const abortControllerRef = useRef<(() => void) | null>(null);
  const minDelayTimeoutRef = useRef<any>(null);
  const hardTimeoutRef = useRef<any>(null);
  const minDelaySatisfiedRef = useRef(false);
  const isDecodingRef = useRef(false);

  const startAnalysis = async ({ birthDate, birthTime, gender, language, key }: StreamAnalysisParams) => {
    try {
      // Reset State
      setIsLoading(true);
      setIsDecoding(true);
      isDecodingRef.current = true;
      setDisplayContent('');
      fullContentRef.current = '';
      displayedLengthRef.current = 0;
      streamDoneRef.current = false;
      minDelaySatisfiedRef.current = false;
      setIsEffectActive(false);

      // Cleanup previous request and timers if any
      if (abortControllerRef.current) {
        abortControllerRef.current();
        abortControllerRef.current = null;
      }
      if (minDelayTimeoutRef.current) {
        clearTimeout(minDelayTimeoutRef.current);
        minDelayTimeoutRef.current = null;
      }
      if (hardTimeoutRef.current) {
        clearTimeout(hardTimeoutRef.current);
        hardTimeoutRef.current = null;
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Start the fetches
      const url = `${Env.EXPO_PUBLIC_API_URL}/api/app/analyze`;

      console.log('Starting XHR Stream Request to:', url);

      // 用于存储后端返回的 logId
      let serverLogId: string | null = null;

      // Use XHR Stream wrapper
      abortControllerRef.current = fetchStream(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ birthDate, birthTime, gender, language, key }),
        onLogId: (logId) => {
          // 后端在流开始时返回的 logId
          serverLogId = logId;
          console.log('[Stream] Received logId from server:', logId);
        },
        onNext: (chunk) => {
          // 累积内容（移除详细日志，只在开始和结束打印）
          fullContentRef.current += chunk;

          // If we have passed the minimum delay (8s) and are still in "decoding" mode,
          // we should start showing content now that we have some.
          if (minDelaySatisfiedRef.current && isDecodingRef.current) {
             startDisplayingContent();
          }
        },
        onError: (error) => {
          console.error('[Stream] XHR Stream Error:', error);
          cleanupTimers();
          
          setIsLoading(false);
          setIsDecoding(false);
          isDecodingRef.current = false;
          
          // Show error and Go Back
          showErrorMessage(translate('analysis.request_failed'));
          if (router.canGoBack()) {
            router.back();
          } else {
             router.replace('/analysis/input');
          }
        },
          onComplete: () => {
            console.log('[Stream] XHR Stream Completed. Total len:', fullContentRef.current.length);
            streamDoneRef.current = true;
            abortControllerRef.current = null;
            cleanupTimers(); // Clear hard timeout if we finish early
            
            // Save to History
            // 优先使用后端返回的 logId，确保客户端和服务端使用相同 ID
            // 如果后端没有返回（如未登录用户），则生成本地 UUID
            const reportId = serverLogId || uuidv4();
            addReport({
              id: reportId,
              createdAt: new Date().toISOString(),
              content: fullContentRef.current,
              birthDate,
              birthTime,
              gender,
              summary: fullContentRef.current.slice(0, 100) // Simple summary
            });
            console.log('[Stream] Report saved locally with id:', reportId, serverLogId ? '(from server)' : '(local UUID)');
          }
      });

      // 1. Minimum "Decoding" Animation Time (8s)
      minDelayTimeoutRef.current = setTimeout(() => {
        minDelaySatisfiedRef.current = true;
        // 最小延迟完成，准备显示内容
        
        // If we already have content, start showing it.
        // If not, we wait for onNext to trigger it.
        if (fullContentRef.current.length > 0) {
            startDisplayingContent();
        }
      }, 8000);

      // 2. Hard Timeout (30s) - If still no content or completion by 30s
      hardTimeoutRef.current = setTimeout(() => {
         if (fullContentRef.current.length === 0) {
            console.error('[Stream] Hard timeout (30s) reached with no content.');
            if (abortControllerRef.current) abortControllerRef.current();
            cleanupTimers();
            setIsLoading(false);
            setIsDecoding(false);
            isDecodingRef.current = false;
            showErrorMessage(translate('analysis.request_timeout'));
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/analysis/input');
            }
         }
      }, 30000);

    } catch (error) {
       console.error('Start Analysis Error:', error);
       cleanupTimers();
       setIsLoading(false);
       setIsDecoding(false);
       isDecodingRef.current = false;
       
       showErrorMessage(translate('analysis.start_failed'));
       if (router.canGoBack()) {
         router.back();
       } else {
         router.replace('/analysis/input');
       }
    }
  };

  const cleanupTimers = () => {
      if (minDelayTimeoutRef.current) clearTimeout(minDelayTimeoutRef.current);
      if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
  };

  const startDisplayingContent = () => {
    // 防止多次调用
    if (!isDecodingRef.current && isEffectActive) return;

    // 开始显示内容（清除硬超时）
    
    // Clear the hard timeout as we have successfully started
    if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);

    setIsDecoding(false);
    isDecodingRef.current = false;
    setIsEffectActive(true);
    
    // Immediately update display with what we have
    updateDisplay();

    // Start the interval updater
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    intervalIdRef.current = setInterval(() => {
      updateDisplay();
      
      // Stop if stream is done and we have displayed everything
      if (streamDoneRef.current && displayedLengthRef.current >= fullContentRef.current.length) {
         if (intervalIdRef.current) clearInterval(intervalIdRef.current);
         setIsEffectActive(false);
         setIsLoading(false);
      }
    }, 2000); // Pulse effect
  };


  const updateDisplay = () => {
    // Sync the display content with the accumulated buffer
    setDisplayContent(fullContentRef.current);
    displayedLengthRef.current = fullContentRef.current.length;
  };

  return {
    startAnalysis,
    displayContent,
    isDecoding,
    isLoading, // True until completely finished
    isEffectActive, // True while the "cursor" should be shown at the end
  };
};
