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
  title: string;
  value: number;
  unit: string;
  description: string;
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
  category: string;
  benefits: string[];
  impact: string[];
  status: 'active' | 'upcoming' | 'completed';
  startDate?: Date;
  endDate?: Date;
  isVisible: boolean;
  icon: string;
  contactEmail: string;
  order: number;
}