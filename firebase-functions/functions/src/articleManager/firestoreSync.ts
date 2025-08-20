import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import type { ProcessedArticle, FirebaseArticle, IngestResult } from './types.js';

/**
 * Firebase Firestore Operations
 */

/**
 * Simple lock mechanism to prevent overlapping function executions
 */
async function acquireLock(taskName: string, ttlMs = 10 * 60 * 1000): Promise<boolean> {
  const db = getFirestore();
  const lockRef = db.collection('_function_locks').doc(taskName);
  const now = Date.now();
  
  let acquired = false;
  
  await db.runTransaction(async (transaction) => {
    const lockDoc = await transaction.get(lockRef);
    
    if (lockDoc.exists) {
      const data = lockDoc.data();
      const age = now - (data?.timestamp || 0);
      
      if (age < ttlMs) {
        // Lock is still active
        return;
      }
    }
    
    // Acquire or refresh the lock
    transaction.set(lockRef, {
      timestamp: now,
      started_at: Timestamp.now()
    });
    acquired = true;
  });
  
  return acquired;
}

/**
 * Release the lock after processing
 */
async function releaseLock(taskName: string): Promise<void> {
  const db = getFirestore();
  const lockRef = db.collection('_function_locks').doc(taskName);
  
  try {
    await lockRef.delete();
  } catch (error) {
    console.warn('Failed to release lock:', error);
  }
}

/**
 * Mark lock as failed but keep timestamp for TTL
 */
async function markLockFailed(taskName: string, error: Error): Promise<void> {
  const db = getFirestore();
  const lockRef = db.collection('_function_locks').doc(taskName);
  
  try {
    await lockRef.set({
      timestamp: Date.now(),
      failed_at: Timestamp.now(),
      error: String(error)
    }, { merge: true });
  } catch (lockError) {
    console.warn('Failed to mark lock as failed:', lockError);
  }
}

/**
 * Execute function with lock protection
 */
export async function withLock<T>(
  taskName: string,
  fn: () => Promise<T>,
  options: { ttlMs?: number } = {}
): Promise<{ skipped: boolean; result?: T; reason?: string }> {
  const acquired = await acquireLock(taskName, options.ttlMs);
  
  if (!acquired) {
    console.log(`Lock active for ${taskName}, skipping execution`);
    return { skipped: true, reason: 'lock_active' };
  }
  
  try {
    const result = await fn();
    await releaseLock(taskName);
    return { skipped: false, result };
  } catch (error) {
    console.error(`Function ${taskName} failed:`, error);
    await markLockFailed(taskName, error as Error);
    throw error;
  }
}

/**
 * Sync processed articles to Firestore
 */
export async function syncArticlesToFirestore(articles: ProcessedArticle[]): Promise<{
  created: number;
  updated: number;
  total: number;
}> {
  const db = getFirestore();
  let created = 0;
  let updated = 0;
  
  console.log(`Syncing ${articles.length} articles to Firestore`);
  
  for (const article of articles) {
    if (!article.id || !article.published_at) {
      console.warn('Skipping article with missing ID or published_at:', article.title);
      continue;
    }
    
    // Use the full article.id as the document ID (e.g., "article.011c0affcdb9")
    const docId = article.id;
    const articleRef = db.collection('articles').doc(docId);
    
    try {
      const existingDoc = await articleRef.get();
      
      const firestoreData = {
        id: article.id,  // This is the full "article.011c0affcdb9" format
        title: article.title,
        medium_link: article.medium_link,
        image_link: article.image_link,
        article_tags: article.article_tags,
        published_at: Timestamp.fromDate(new Date(article.published_at))
      };
      
      if (existingDoc.exists) {
        const existingData = existingDoc.data();
        
        // Only update if we have new information
        let shouldUpdate = false;
        
        // Update if no image and we have one
        if (!existingData?.image_link && firestoreData.image_link) {
          shouldUpdate = true;
        }
        
        // Update if no tags and we have some
        if ((!existingData?.article_tags || existingData.article_tags.length === 0) && 
            firestoreData.article_tags.length > 0) {
          shouldUpdate = true;
        }
        
        if (shouldUpdate) {
          await articleRef.set(firestoreData, { merge: true });
          updated++;
          console.log(`Updated article: ${article.title}`);
        } else {
          // Article exists but no updates needed
          console.log(`Article already up to date: ${article.title}`);
        }
      } else {
        // Create new article
        await articleRef.set(firestoreData);
        created++;
        console.log(`Created new article: ${article.title}`);
      }
    } catch (error) {
      console.error(`Failed to sync article ${article.title}:`, error);
      // Continue with other articles rather than failing completely
    }
  }
  
  console.log(`Firestore sync complete. Created: ${created}, Updated: ${updated}`);
  
  return {
    created,
    updated,
    total: articles.length
  };
}
