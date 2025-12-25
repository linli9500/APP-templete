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
      options.onNext(newChunk);
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
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
