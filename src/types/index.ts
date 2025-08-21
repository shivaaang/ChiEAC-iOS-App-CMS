//
//  index.ts
//  ChiEAC
//
//  Global type definitions for the ChiEAC CMS application
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

// Core Work Types
export interface CoreWork {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  category: string;
  status: 'active' | 'completed' | 'planned';
  priority: 'low' | 'medium' | 'high';
  startDate?: Date;
  completionDate?: Date;
  tags: string[];
}

// Impact Statistics Types
export interface ImpactStat {
  id: string;
  number: string;
  label: string;
  subtitle: string;
  icon: string;
  order: number;
  category: string;
  lastUpdated: Date;
  isVisible: boolean;
}

// Program Information Types
export interface ProgramInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  impact: string[];
  icon: string;
  order: number;
}