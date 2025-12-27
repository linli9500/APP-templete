import { useEffect } from 'react';
import { useSupabase } from '@/hooks/use-supabase';
import { supabase } from '@/lib/supabase'; 
import { useHistoryStore } from '@/stores/history-store';
import { fetchHistoryIds, fetchReportDetail, syncHistoryReports } from '@/api/history';

/**
 * History 双向同步 Hook
 * 修复：使用 getState() 避免 React 闭包问题
 */
export const useHistorySync = () => {
    const { session } = useSupabase();

    useEffect(() => {
        // 如果未登录，不需要做任何事情
        if (!session?.user) return;

        const syncHistory = async () => {
            try {
                // Double check if we really have a valid session token for API calls
                const { data } = await supabase.auth.getSession();
                
                // @ts-ignore
                const customToken = supabase.rest?.headers?.['Authorization'];

                if (!data.session?.access_token && !customToken) {
                    // 没有有效的 token，跳过同步
                    return;
                }

                // 【重要】在同步开始时获取本地数据快照，避免闭包问题
                const currentReports = useHistoryStore.getState().reports;
                const localIdsBeforeSync = Object.keys(currentReports);

                // 1. 获取远程所有 ID
                const remoteItems = await fetchHistoryIds();
                const remoteIds = remoteItems.map(item => item.id);
                
                // 2. 找出本地缺失的 ID（需要下载的）
                const missingIds = remoteIds.filter(id => !localIdsBeforeSync.includes(id));

                if (missingIds.length > 0) {
                     console.log(`[HistorySync] Found ${missingIds.length} missing reports. Downloading...`);
                }

                // 3. 并发下载缺失的报告
                const fetchPromises = missingIds.map(async (id) => {
                    try {
                        const detail = await fetchReportDetail(id);
                        // 使用 getState() 获取最新的 addReport 方法
                        useHistoryStore.getState().addReport({
                            id: detail.id,
                            createdAt: detail.created_at,
                            content: detail.content,
                            birthDate: detail.birth_date,
                            birthTime: detail.birth_time,
                            gender: detail.gender,
                            summary: detail.summary
                        });
                    } catch (err) {
                        console.error(`Failed to sync report ${id}:`, err);
                    }
                });

                await Promise.all(fetchPromises);
                
                // 4. 上行同步: 把同步前本地有但 Server 没有的推上去
                // 【关键】使用同步开始前的快照，而非下载后的数据
                const reportsToUpload = localIdsBeforeSync
                    .filter(id => !remoteIds.includes(id)) // 不在远程列表里的
                    .map(id => currentReports[id]) // 从快照获取完整数据
                    .filter(Boolean); // 过滤掉可能的 undefined

                if (reportsToUpload.length > 0) {
                    console.log(`[HistorySync] Found ${reportsToUpload.length} local reports to upload. Syncing...`);
                    await syncHistoryReports(reportsToUpload);
                    console.log('[HistorySync] Upload completed.');
                } else if (missingIds.length > 0) {
                     console.log('[HistorySync] Download completed.');
                }
                
            } catch (error) {
                // Silent fail for 401 to avoid spamming logs, let interceptor handle it
                // @ts-ignore
                if (error?.response?.status !== 401) {
                    console.error('[HistorySync] Sync failed:', error);
                }
            }
        };

        syncHistory();

        // 依赖项：仅在 session 变化（登录/登出）时执行
    }, [session?.user?.id]); 
};
