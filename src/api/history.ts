import { client } from '@/api/common/client';
import { Env } from '@env';

const HISTORY_API_URL = `${Env.EXPO_PUBLIC_API_URL}/api/app/history`;

interface HistoryItem {
  id: string; // 只返回 ID
}

interface ReportDetail {
  id: string;
  created_at: string;
  content: string;
  birth_date: string;
  birth_time?: string;
  gender?: string;
  summary?: string;
}

export const fetchHistoryIds = async (): Promise<HistoryItem[]> => {
  try {
    const response = await client.get(HISTORY_API_URL);
    return response.data;
  } catch (error: any) {
    console.error('Fetch history IDs failed:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchReportDetail = async (id: string): Promise<ReportDetail> => {
  try {
    const response = await client.get(`${HISTORY_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Fetch report detail ${id} failed:`, error);
    throw error;
  }
};

export const deleteHistoryReport = async (id: string): Promise<void> => {
  try {
    await client.delete(`${HISTORY_API_URL}/${id}`);
  } catch (error) {
    console.error(`Delete report ${id} failed:`, error);
    throw error;
  }
};

// Need to import ReportData or define it. 
// Ideally we import, but to avoid circular deps if any (store usually depends on API?), 
// let's defining a strictly compatible interface for the API payload.
// Or just import from store which is likely fine.
import type { ReportData } from '@/stores/history-store';

export const syncHistoryReports = async (reports: ReportData[]): Promise<{ synced: number }> => {
  try {
    const response = await client.post(HISTORY_API_URL, { reports });
    return response.data;
  } catch (error) {
    console.error('Sync history reports failed:', error);
    throw error;
  }
};
