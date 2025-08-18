//
//  index.ts
//  ChiEAC
//
//  Type definitions for the ChiEAC CMS application
//  Created by Shivaang Kumar on 8/18/25.
//

// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  team: string;
  linkedInProfile?: string;
  imageURL?: string;
  bio?: string;
  joinDate?: Date;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

// Article Types
export interface Article {
  id: string;
  title: string;
  publishedAt: Date;
  imageLink?: string;
  mediumLink?: string;
  articleTags: string[];
}

// Common utility types
export type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};