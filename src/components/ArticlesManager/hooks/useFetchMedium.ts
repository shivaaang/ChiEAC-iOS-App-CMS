import { useState, useCallback } from 'react';
import { fetchMediumNow, type FetchMediumResponse } from '../../../utils/mediumIngestService';

export interface UseFetchMediumReturn {
  loading: boolean;
  error: string | null;
  lastResult: FetchMediumResponse | null;
  fetchNow: () => Promise<void>;
  clearError: () => void;
  clearResult: () => void;
}

/**
 * Hook for managing Medium RSS fetch operations
 */
export function useFetchMedium(): UseFetchMediumReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<FetchMediumResponse | null>(null);

  const fetchNow = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMediumNow();
      setLastResult(result);
      
      if (!result.success) {
        setError(result.message || 'Fetch failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLastResult({
        success: false,
        message: errorMessage,
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResult = useCallback(() => {
    setLastResult(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    lastResult,
    fetchNow,
    clearError,
    clearResult
  };
}
