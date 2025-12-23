import { useContext, useEffect, useState } from "react";

import { SupabaseClient, Session } from "@supabase/supabase-js";

import { SupabaseContext } from "@/context/supabase-context";

interface UseSupabaseProps {
  isLoaded: boolean;
  session: Session | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, string, any>;
  signOut: () => Promise<void>;
}

export const useSupabase = (): UseSupabaseProps => {
  const supabase = useContext(SupabaseContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) return;
    
    // Initial Session Check
    supabase.auth.getSession().then(({ data }) => {
      // Check for Custom Bridge Token (header injected manually)
      // @ts-ignore
      const customToken = supabase.rest?.headers?.['Authorization'];
      
      if (data.session) {
        setSession(data.session);
      } else if (customToken) {
        // Fallback: We have a custom token injected, so we are "logged in"
        console.log('✅ Custom Token found, hydrating fake session.');
        setSession({ 
          access_token: customToken, 
          user: { id: 'custom-bridge-user', email: 'bridge@user.com' } 
        } as Session);
      }
      setIsLoaded(true);
    });

    // Auth State Change Listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        // @ts-ignore
        const customToken = supabase.rest?.headers?.['Authorization'];

        if (newSession) {
          setSession(newSession);
        } else if (customToken) {
           // If Supabase says "no session" (e.g. setSession failed)
           // but we have a custom token, we trust the token.
           console.log('🔄 onAuthStateChange: null session but custom token found. Keeping fake session.');
           setSession({ 
            access_token: customToken, 
            user: { id: 'custom-bridge-user', email: 'bridge@user.com' } 
          } as Session);
        } else {
          setSession(null);
        }
      },
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    if (!supabase) return;
    
    // Clear custom token first
    try {
      const { clearGlobalAuthToken } = require('@/lib/supabase');
      clearGlobalAuthToken();
    } catch (e) {
      // Fallback if require fails or not found
      // @ts-ignore
      delete supabase.rest?.headers?.['Authorization'];
    }

    await supabase.auth.signOut();
    setSession(null);
  };

  if (!supabase) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }

  return { isLoaded, session, supabase, signOut };
};
