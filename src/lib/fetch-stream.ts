/**
 * A wrapper around XMLHttpRequest to handle streaming responses in React Native.
 * RN's fetch does not support ReadableStream, but XHR supports onprogress.
 */
export function fetchStream(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT';
    headers?: Record<string, string>;
    body?: string;
    onNext: (chunk: string) => void;
    onError: (error: Error) => void;
    onComplete: () => void;
    onLogId?: (logId: string) => void; // 新增：接收 logId 的回调
  }
) {
  const xhr = new XMLHttpRequest();
  xhr.open(options.method || 'GET', url);

  // Set headers
  if (options.headers) {
    Object.keys(options.headers).forEach((key) => {
      xhr.setRequestHeader(key, options.headers![key]);
    });
  }

  // Tracking processed length to manually slice new data
  let processedLength = 0;
  let logIdExtracted = false; // 标记是否已提取 logId
  let pendingBuffer = ''; // 缓冲区，用于等待完整的 logId 行

  xhr.onprogress = () => {
    // Check status first. If it's an error (e.g. 500), don't stream the body as content.
    // Wait for onload to handle the error parsing.
    if (xhr.status !== 200 && xhr.status !== 0) { // 0 for local/sometimes initial
       return;
    }

    // xhr.responseText contains the FULL response accumulated so far
    const response = xhr.responseText || '';
    const newChunk = response.substring(processedLength);
    processedLength = response.length;

    if (newChunk.length > 0) {
      // 如果还没提取 logId，先检查是否包含 logId 前缀
      if (!logIdExtracted) {
        pendingBuffer += newChunk;
        
        // 检查是否有完整的 logId 行 (格式: [LOG_ID:xxx]\n)
        const logIdMatch = pendingBuffer.match(/^\[LOG_ID:([^\]]+)\]\n/);
        
        if (logIdMatch) {
          const logId = logIdMatch[1];
          logIdExtracted = true;
          
          // 触发 logId 回调
          if (options.onLogId) {
            options.onLogId(logId);
            console.log('[fetchStream] Extracted logId:', logId);
          }
          
          // 移除 logId 前缀，只保留剩余内容
          const remainingContent = pendingBuffer.substring(logIdMatch[0].length);
          pendingBuffer = '';
          
          if (remainingContent.length > 0) {
            options.onNext(remainingContent);
          }
        } else if (pendingBuffer.length > 100) {
          // 如果缓冲区太长还没有找到 logId，可能没有 logId，直接发送
          logIdExtracted = true;
          options.onNext(pendingBuffer);
          pendingBuffer = '';
        }
        // 否则继续缓冲
      } else {
        options.onNext(newChunk);
      }
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      // 处理未发送的缓冲区
      if (pendingBuffer.length > 0) {
        options.onNext(pendingBuffer);
        pendingBuffer = '';
      }
      options.onComplete();
    } else {
      options.onError(new Error(`Request failed with status ${xhr.status}: ${xhr.responseText}`));
    }
  };

  xhr.onerror = () => {
    options.onError(new Error('Network request failed'));
  };

  xhr.ontimeout = () => {
    options.onError(new Error('Request timed out'));
  };

  if (options.body) {
    xhr.send(options.body);
  } else {
    xhr.send();
  }

  // Return abort function
  return () => {
    xhr.abort();
  };
}
