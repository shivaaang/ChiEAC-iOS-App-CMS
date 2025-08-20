import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { fetchAndProcessMediumFeed, syncArticlesToFirestore, withLock } from './articleManager/index.js';
import type { IngestResult } from './articleManager/types.js';

// Email notifications
import { onFormSubmissionCreated } from './emailNotifications/index.js';

// Set global options for all functions
setGlobalOptions({
  region: 'us-central1',
  timeoutSeconds: 300,
  memory: '512MiB'
});

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault()
});

/**
 * Core ingest logic
 */
async function performIngest(): Promise<IngestResult> {
  console.log('Starting Medium RSS ingest process');
  
  // Step 1: Fetch and process RSS feed
  const processedArticles = await fetchAndProcessMediumFeed();
  
  // Step 2: Sync to Firestore
  const syncResults = await syncArticlesToFirestore(processedArticles);
  
  const result: IngestResult = {
    added: processedArticles.length,
    updated: 0, // This will be calculated during sync
    total: processedArticles.length,
    firestore_created: syncResults.created,
    firestore_updated: syncResults.updated
  };
  
  console.log('Ingest completed:', result);
  return result;
}

/**
 * Scheduled function - runs at the top of every hour (UTC)
 * Schedule: 0 * * * * (cron format)
 * Timezone: UTC (00:00, 01:00, 02:00, etc.)
 */
export const hourlyMediumIngest = onSchedule('0 * * * *', async (event) => {
  const result = await withLock('medium_ingest', performIngest);
  
  if (result.skipped) {
    console.log(`Scheduled ingest skipped: ${result.reason}`);
  } else {
    console.log('Scheduled ingest completed:', result.result);
  }
});

/**
 * HTTP-triggered function for manual/immediate ingests
 * Can be called from your CMS "Fetch Now" button
 */
export const fetchMediumNow = onRequest({
  cors: true, // Enable CORS for web requests
}, async (req, res) => {
  try {
    // Optional: Add authentication
    const authHeader = req.get('authorization');
    const apiKey = req.get('x-api-key');
    
    // You can set MEDIUM_INGEST_API_KEY as an environment variable
    const requiredApiKey = process.env.MEDIUM_INGEST_API_KEY;
    
    if (requiredApiKey && apiKey !== requiredApiKey) {
      res.status(403).json({
        error: 'Forbidden: Invalid API key'
      });
      return;
    }
    
    console.log('Manual ingest triggered via HTTP request');
    
    const result = await withLock('medium_ingest_manual', performIngest);
    
    if (result.skipped) {
      res.status(409).json({
        success: false,
        message: `Ingest already running or recently completed. Reason: ${result.reason}`,
        skipped: true
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Medium RSS ingest completed successfully',
        data: result.result,
        skipped: false
      });
    }
  } catch (error) {
    console.error('Manual ingest failed:', error);
    
    res.status(500).json({
      success: false,
      message: 'Ingest failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * HTTP function to get ingest status/logs
 */
export const getIngestStatus = onRequest({
  cors: true,
}, async (req, res) => {
  try {
    // This is a simple status endpoint
    // You could expand this to show recent ingest logs, statistics, etc.
    res.status(200).json({
      success: true,
      message: 'Medium ingest functions are healthy',
      timestamp: new Date().toISOString(),
      functions: {
        hourlyMediumIngest: 'Scheduled every 60 minutes',
        fetchMediumNow: 'Available for manual triggers',
        getIngestStatus: 'Available for status checks'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Status check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Export email notification triggers
export { onFormSubmissionCreated };
