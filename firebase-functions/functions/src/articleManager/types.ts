//
//  articleManager/types.ts
//  ChiEAC Firebase Functions
//
//  Article management type definitions
//  Created by Shivaang Kumar on 8/20/25.
//

import { Timestamp } from 'firebase-admin/firestore';

// Types for Medium RSS feed processing and Firebase articles
export interface MediumRSSItem {
  title: string;
  link: string;
  pubDate: string;
  category?: string | string[];
  'content:encoded'?: string;
  description?: string;
}

export interface MediumRSSFeed {
  rss: {
    channel: {
      item: MediumRSSItem | MediumRSSItem[];
    };
  };
}

export interface ProcessedArticle {
  id: string;
  title: string;
  medium_link: string;
  image_link: string | null;
  article_tags: string[];
  published_at: string;
}

export interface FirebaseArticle {
  id: string;
  title: string;
  medium_link: string;
  image_link: string | null;
  article_tags: string[];
  published_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface IngestResult {
  added: number;
  updated: number;
  total: number;
  firestore_created: number;
  firestore_updated: number;
}
