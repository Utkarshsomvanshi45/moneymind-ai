import { useState, useCallback } from 'react';
import { API_BASE } from '@/config';

interface UseApiOptions {
  mockDelay?: number;
}

export function useApi<TInput, TOutput>(
  endpoint: string,
  mockData: TOutput,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<TOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (input: TInput) => {
    setLoading(true);
    setError(null);

    try {
      // Try real API first
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        setLoading(false);
        return result;
      }
      throw new Error('API not available');
    } catch {
      // Fall back to mock data with realistic delay
      await new Promise(resolve => setTimeout(resolve, options.mockDelay ?? 1500));
      setData(mockData);
      setLoading(false);
      return mockData;
    }
  }, [endpoint, mockData, options.mockDelay]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
