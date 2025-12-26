import { useEffect } from 'react';
import { useSupabase } from '@/hooks/use-supabase';
import { supabase } from '@/lib/supabase'; 
import { useHistoryStore } from '@/stores/history-store';
import { fetchHistoryIds, fetchReportDetail, syncHistoryReports } from '@/api/history';

export const useHistorySync = () => {
    const { session } = useSupabase();
    const { addReport, reports } = useHistoryStore();

    useEffect(() => {
        // 如果未登录，不需要做任何事情（或者应该清空？需求说未登录保存在本地，所以不清空）
        // 但是，如果从用户A切换到用户B，应该清空上一个用户的缓存吗？
        // 通常如果是本地优先，未登录时的数据在登录后会合并。
        // 但如果已有登录用户，我们需要确保数据是该用户的。
        // 简化起见：登录状态下，尝试拉取同步。
        
        if (!session?.user) return; // 未登录不调用接口

        const syncHistory = async () => {
            try {
                // Double check if we really have a valid session token for API calls
                // The hook session might be optimistic or "fake" in some contexts (as seen in logs)
                const { data } = await supabase.auth.getSession();
                
                // @ts-ignore
                const customToken = supabase.rest?.headers?.['Authorization'];

                if (!data.session?.access_token && !customToken) {
                    // 没有有效的 token，跳过同步
                    return;
                }

                // 1. 获取所有 ID
                const remoteItems = await fetchHistoryIds();
                const remoteIds = remoteItems.map(item => item.id);
                
                // 2. 找出本地缺失的 ID
                const localIds = Object.keys(reports);
                const missingIds = remoteIds.filter(id => !localIds.includes(id));

                if (missingIds.length > 0) { // Only log if needed
                     console.log(`[HistorySync] Found ${missingIds.length} missing reports. Downloading...`);
                }

                // 3. 并发下载缺失的报告
                // 限制并发数量，避免瞬间请求过多？ 只有 10 条的话还好。
                const fetchPromises = missingIds.map(async (id) => {
                    try {
                        const detail = await fetchReportDetail(id);
                        // 转换字段格式 (API snake_case -> Store camelCase)
                        addReport({
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
                
                // 4. 上行同步 (Sync Up): 把本地有但 Server 没有的推上去
                // 重新 check 一次 remote items (或者复用之前的逻辑，假设下载完后，本地多出来的就是需要上传的)
                // 简单逻辑：本地所有 ID - 远程原始 ID = 需要上传的
                
                const reportsToUpload = localIds
                    .filter(id => !remoteIds.includes(id)) // 不在远程列表里的
                    .map(id => reports[id]); // 获取完整数据

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
        // 实际上应该只在 session 变为有值时执行一次
    }, [session?.user?.id]); 
};
