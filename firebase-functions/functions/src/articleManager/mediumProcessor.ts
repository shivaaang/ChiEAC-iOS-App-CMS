import crypto from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import type { MediumRSSFeed, MediumRSSItem, ProcessedArticle } from './types.js';

// Configuration
const FEED_URL = 'https://chieac.medium.com/feed';
const FEED_SCAN_LIMIT = 100; // Increased to catch more articles

/**
 * Utility Functions
 */

// Create a URL-friendly slug from a title
function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // Remove diacritics
    .replace(/['"`']/g, '') // Remove quotes
    .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric with underscores
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .replace(/_+/g, '_') // Collapse multiple underscores
    .slice(0, 100); // Limit length
}

// Create a short hash for uniqueness
function shortHash(str: string): string {
  return crypto.createHash('sha1').update(str).digest('hex').slice(0, 6);
}

// Extract the canonical ID from a Medium URL
function canonicalIdFromLink(link: string): string | null {
  if (!link) return null;
  
  try {
    // Remove query params and trailing slash
    const cleanLink = link.replace(/[#?].*$/, '').replace(/\/$/, '');
    const slugPart = cleanLink.split('/').pop();
    
    if (!slugPart) return null;
    
    // Medium URLs end with a canonical ID (10-13 hex characters)
    const token = slugPart.split('-').pop();
    if (token && /^[0-9a-f]{10,13}$/.test(token)) {
      return token;
    }
  } catch {
    return null;
  }
  
  return null;
}

// Convert Date to ISO string without milliseconds
function toIsoNoFraction(date: Date): string {
  const iso = date.toISOString();
  return iso.replace('.000Z', 'Z');
}

// Extract the first image URL from HTML content
function extractFirstImage(html: string): string | null {
  if (!html) return null;
  
  const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  if (!match) return null;
  
  let url = match[1];
  
  // Optimize Medium CDN images
  if (/cdn-images-1\.medium\.com/.test(url)) {
    url = url.replace(/max\/\\d+\//, 'max/1024/');
  }
  
  return url;
}

// Convert string to title case
function titleCase(str: string): string {
  return str
    .split(/\\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format individual tag
function formatTag(tag: string): string {
  return titleCase(tag.replace(/[-_]+/g, ' ').toLowerCase());
}

// Normalize and limit tags array
function normalizeTags(rawTags: string | string[] | undefined): string[] {
  if (!rawTags) return [];
  
  const tagsArray = Array.isArray(rawTags) ? rawTags : [rawTags];
  
  return [...new Set(
    tagsArray
      .map(tag => formatTag(String(tag).trim()))
      .filter(Boolean)
  )].slice(0, 10); // Limit to 10 tags max
}

/**
 * Main RSS Processing Function
 */
export async function fetchAndProcessMediumFeed(): Promise<ProcessedArticle[]> {
  console.log('Fetching RSS feed from:', FEED_URL);
  
  // Fetch the RSS feed
  const response = await fetch(FEED_URL);
  if (!response.ok) {
    throw new Error(`RSS feed request failed with status ${response.status}`);
  }
  
  const xmlText = await response.text();
  
  // Parse XML to JSON
  const parser = new XMLParser({ ignoreAttributes: false });
  const json = parser.parse(xmlText) as MediumRSSFeed;
  
  // Extract items from the channel
  const channel = json?.rss?.channel;
  let items = channel?.item || [];
  
  // Ensure items is an array
  if (!Array.isArray(items)) {
    items = [items];
  }
  
  // Limit items for processing
  items = items.slice(0, FEED_SCAN_LIMIT);
  
  console.log(`Processing ${items.length} RSS items`);
  
  // Process each item
  const processedArticles: ProcessedArticle[] = [];
  
  for (const item of items) {
    const title = item.title?.trim() || 'Untitled';
    const link = item.link;
    
    // Clean the link (remove query params)
    let cleanLink = link;
    try {
      const url = new URL(link);
      url.search = '';
      cleanLink = url.toString();
    } catch {
      // Keep original link if URL parsing fails
    }
    
    // Generate article ID
    const canonicalToken = canonicalIdFromLink(cleanLink);
    let articleId: string;
    
    if (canonicalToken) {
      articleId = `article.${canonicalToken}`;
    } else {
      // Fallback: create ID from slug + hash
      const slug = slugify(title);
      const hash = shortHash(cleanLink || title);
      articleId = `article.${slug}_${hash}`;
    }
    
    // Parse publication date
    const feedDate = item.pubDate ? new Date(item.pubDate) : null;
    const publishedAt = feedDate ? toIsoNoFraction(feedDate) : toIsoNoFraction(new Date());
    
    // Process tags
    const tags = normalizeTags(item.category);
    
    // Extract content and image
    const content = item['content:encoded'] || item.description || '';
    const imageLink = extractFirstImage(content);
    
    processedArticles.push({
      id: articleId,
      title,
      medium_link: cleanLink,
      image_link: imageLink,
      article_tags: tags,
      published_at: publishedAt
    });
  }
  
  console.log(`Successfully processed ${processedArticles.length} articles`);
  return processedArticles;
}
