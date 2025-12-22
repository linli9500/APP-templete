// import { delay } from '@/lib'; // Removed missing import
import { client } from './common/client'; // Supabase client

export type AppBootstrapData = {
  version: {
    latest_version: string;
    force_update: boolean;
    download_url: string;
  };
  features: {
    enable_new_year_theme: boolean;
    show_home_banner: boolean;
  };
  ui: {
    theme_color: string;
  };
};

// Mock data suitable for initial development
const MOCK_BOOTSTRAP_DATA: AppBootstrapData = {
  version: {
    latest_version: '1.0.1',
    force_update: false,
    download_url: 'https://example.com/update',
  },
  features: {
    enable_new_year_theme: false,
    show_home_banner: true,
  },
  ui: {
    theme_color: '#system',
  },
};

/**
 * Fetches aggregated configuration for the app startup.
 * In a real scenario, this might call a Supabase Edge Function or RPC.
 */
export const getBootstrapData = async (): Promise<AppBootstrapData> => {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // TODO: Replace with real Supabase call when backend is ready
    // const { data, error } = await client.rpc('get_app_bootstrap_data');
    // if (error) throw error;
    // return data;

    console.log('📱 Bootstrap data fetched successfully (MOCK)');
    return MOCK_BOOTSTRAP_DATA;
  } catch (error) {
    console.error('Failed to fetch bootstrap data:', error);
    // Return safe defaults in case of error
    return MOCK_BOOTSTRAP_DATA;
  }
};
