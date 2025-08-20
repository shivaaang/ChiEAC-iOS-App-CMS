import React, { useState, useEffect } from 'react';
import { useFetchMedium } from '../hooks/useFetchMedium';

interface FetchNowButtonProps {
  onRefreshNeeded?: () => void;
  className?: string;
}

const FetchNowButton: React.FC<FetchNowButtonProps> = ({ 
  onRefreshNeeded,
  className = ""
}) => {
  const { loading, error, lastResult, fetchNow, clearError, clearResult } = useFetchMedium();
  const [showResult, setShowResult] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFetch = async () => {
    clearResult();
    await fetchNow();
    setShowResult(true);
  };

  // Watch for successful fetch results and trigger refresh
  useEffect(() => {
    if (lastResult?.success && !lastResult.skipped && onRefreshNeeded) {
      setIsRefreshing(true);
      // Wait a moment for Firebase to process, then refresh
      const timeoutId = setTimeout(() => {
        onRefreshNeeded();
        setIsRefreshing(false);
      }, 2000);
      
      return () => {
        clearTimeout(timeoutId);
        setIsRefreshing(false);
      };
    }
  }, [lastResult, onRefreshNeeded]);

  const handleDismissResult = () => {
    setShowResult(false);
    clearResult();
  };

  return (
    <div className={`flex flex-col items-end ${className}`}>
      {/* Fetch Now Button */}
      <button
        onClick={handleFetch}
        disabled={loading}
        className={`
          inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${loading 
            ? 'bg-orange-600/50 text-orange-200 cursor-not-allowed' 
            : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40'
          }
        `}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-orange-200/30 border-t-orange-200 rounded-full animate-spin mr-2"></div>
            Fetching...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Fetch Now
          </>
        )}
      </button>

      {/* Automatic Fetch Info */}
      <p className="mt-2 text-sm text-slate-400 flex items-center">
        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Articles are fetched automatically every hour
      </p>

      {/* Refreshing Indicator */}
      {isRefreshing && (
        <p className="mt-2 text-sm text-blue-400 flex items-center">
          <div className="w-3 h-3 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin mr-1.5"></div>
          Refreshing articles list...
        </p>
      )}

      {/* Result/Error Display */}
      {showResult && lastResult && (
        <div className={`
          mt-3 p-4 rounded-lg border
          ${lastResult.success 
            ? 'bg-green-600/10 border-green-500/30 text-green-300' 
            : 'bg-red-600/10 border-red-500/30 text-red-300'
          }
        `}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                {lastResult.success ? (
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="font-medium">
                  {lastResult.success ? 'Fetch Completed' : 'Fetch Failed'}
                </span>
              </div>
              
              <p className="text-sm mb-2">{lastResult.message}</p>
              
              {lastResult.success && lastResult.data && !lastResult.skipped && (
                <div className="text-xs opacity-80">
                  Created: {lastResult.data.firestore_created} • 
                  Updated: {lastResult.data.firestore_updated} • 
                  Total Processed: {lastResult.data.total}
                </div>
              )}
              
              {lastResult.skipped && (
                <div className="text-xs opacity-80 text-yellow-400">
                  Fetch was skipped (likely already running or recently completed)
                </div>
              )}
            </div>
            
            <button
              onClick={handleDismissResult}
              className="ml-3 text-current opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Standalone Error Display (if error without result) */}
      {error && !lastResult && (
        <div className="mt-3 p-4 rounded-lg border bg-red-600/10 border-red-500/30 text-red-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="ml-3 text-current opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchNowButton;
