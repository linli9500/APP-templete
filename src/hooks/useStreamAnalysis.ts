import { useRef, useState } from 'react';
import { Env } from '@env';
import { useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { fetchStream } from '@/lib/fetch-stream';
import { showErrorMessage } from '@/components/ui/utils';
import { translate } from '@/lib';

interface StreamAnalysisParams {
  birthDate: string;
  birthTime: string;
  gender?: 'male' | 'female' | 'other';
  language: string;
  key: string;
}

export const useStreamAnalysis = () => {
  const router = useRouter(); 

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

  const startAnalysis = async ({ birthDate, birthTime, gender, language, key }: StreamAnalysisParams) => {
    try {
      // Reset State
      setIsLoading(true);
      setIsDecoding(true);
      setDisplayContent('');
      fullContentRef.current = '';
      displayedLengthRef.current = 0;
      streamDoneRef.current = false;
      setIsEffectActive(false);

      // Cleanup previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current();
        abortControllerRef.current = null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Start the fetches
      const url = `${Env.API_URL.replace(/\/api$/, '')}/api/app/analyze`; // Ensure no double /api

      console.log('Starting XHR Stream Request to:', url);

      // Use XHR Stream wrapper
      abortControllerRef.current = fetchStream(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ birthDate, birthTime, gender, language, key }),
        onNext: (chunk) => {
          // Just append content, don't update state yet (waiting for 8s animation)
          fullContentRef.current += chunk;
        },
        onError: (error) => {
          console.error('XHR Stream Error:', error);
          setIsLoading(false);
          setIsDecoding(false);
          
          // Show error and Go Back
          showErrorMessage(translate('analysis.request_failed'));
          router.back();
        },
        onComplete: () => {
          console.log('XHR Stream Completed');
          streamDoneRef.current = true;
          abortControllerRef.current = null;
        }
      });

      // Start the 8s countdown for the "Decoding" animation
      setTimeout(() => {
        finishDecodingPhase();
      }, 8000);

    } catch (error) {
       console.error('Start Analysis Error:', error);
       setIsLoading(false);
       setIsDecoding(false);
       
       showErrorMessage(translate('analysis.start_failed'));
       router.back();
    }
  };

  const finishDecodingPhase = () => {
    setIsDecoding(false);
    setIsEffectActive(true);
    
    // Immediately update display with what we have
    updateDisplay();

    // Start the 2-second interval updater to mimic "bursts" of thought or periodic updates
    // Clear existing if any
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    intervalIdRef.current = setInterval(() => {
      updateDisplay();
      
      // Stop if stream is done and we have displayed everything
      if (streamDoneRef.current && displayedLengthRef.current >= fullContentRef.current.length) {
         if (intervalIdRef.current) clearInterval(intervalIdRef.current);
         setIsEffectActive(false);
         setIsLoading(false);
      }
    }, 2000); // Update every 2 seconds
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
