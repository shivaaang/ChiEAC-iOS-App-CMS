/**
 * Service for calling Medium RSS ingest Firebase Functions
 */

export interface FetchMediumResponse {
  success: boolean;
  message: string;
  data?: {
    added: number;
    updated: number;
    total: number;
    firestore_created: number;
    firestore_updated: number;
  };
  skipped?: boolean;
  error?: string;
}

export interface FetchMediumOptions {
  apiKey?: string;
  baseUrl?: string;
}

/**
 * Call the Firebase Function to fetch Medium articles immediately
 */
export async function fetchMediumNow(options: FetchMediumOptions = {}): Promise<FetchMediumResponse> {
  const { apiKey, baseUrl } = options;
  
  // You'll need to replace this with your actual Firebase Function URL
  // Format: https://{region}-{project-id}.cloudfunctions.net/fetchMediumNow
  const functionUrl = baseUrl || import.meta.env.VITE_FETCH_MEDIUM_URL || 'YOUR_FIREBASE_FUNCTION_URL';
  
  if (functionUrl === 'YOUR_FIREBASE_FUNCTION_URL') {
    throw new Error('Please set VITE_FETCH_MEDIUM_URL environment variable with your Firebase Function URL');
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add API key if provided
  if (apiKey || import.meta.env.VITE_MEDIUM_INGEST_API_KEY) {
    headers['x-api-key'] = apiKey || import.meta.env.VITE_MEDIUM_INGEST_API_KEY!;
  }
  
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers,
      // You can add a body if your function expects specific parameters
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        source: 'cms_manual_trigger'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: FetchMediumResponse = await response.json();
    return data;
    
  } catch (error) {
    console.error('Failed to fetch Medium articles:', error);
    
    // Return a standardized error response
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get the status of the ingest system
 */
export async function getIngestStatus(options: FetchMediumOptions = {}): Promise<any> {
  const { apiKey, baseUrl } = options;
  
  // Replace with your actual status function URL
  const statusUrl = baseUrl?.replace('fetchMediumNow', 'getIngestStatus') || 
                   import.meta.env.VITE_INGEST_STATUS_URL || 
                   'YOUR_FIREBASE_STATUS_URL';
  
  if (statusUrl === 'YOUR_FIREBASE_STATUS_URL') {
    throw new Error('Please set VITE_INGEST_STATUS_URL environment variable');
  }
  
  const headers: Record<string, string> = {};
  
  if (apiKey || import.meta.env.VITE_MEDIUM_INGEST_API_KEY) {
    headers['x-api-key'] = apiKey || import.meta.env.VITE_MEDIUM_INGEST_API_KEY!;
  }
  
  try {
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Failed to get ingest status:', error);
    throw error;
  }
}
