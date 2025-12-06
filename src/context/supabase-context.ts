import { createContext } from 'react';

import { SupabaseClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SupabaseContext = createContext<SupabaseClient<any, string, any> | undefined>(
  undefined,
);
