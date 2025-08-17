//
//  index.ts
//  ChiEAC
//
//  Created by Shivaang Kumar on 8/16/25.
//

// Firebase data types matching your iOS app models

export interface CoreWork {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface ImpactStat {
  id: string;
  number: string;
  label: string;
  subtitle: string;
  icon: string;
  order: number;
}

export interface TeamMember {
  id: string;
  // Support both naming conventions for compatibility
  name?: string;
  member_name?: string;
  title?: string;
  member_title?: string;
  bio?: string;
  member_summary?: string;
  bioShort?: string;
  member_summary_short?: string;
  team?: string;
  member_team?: string;
  imageURL?: string;
  member_image_link?: string;
  order: number;
}

export interface Team {
  id: string;
  name: string;
  code: 'core_team' | 'advisory_board';
  description: string;
  order: number;
}

export interface ProgramInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  impact: string[];
  icon: string;
  contactEmail: string;
  order: number;
}

export interface Article {
  id: string;
  title: string;
  mediumLink: string;
  imageLink: string;
  articleTags: string[];
  publishedAt?: Date;
}

export interface OrganizationInfo {
  id: string;
  mission: string;
  description: string;
  tagline: string;
  contactEmail: string;
}

export interface ExternalLink {
  id: string;
  name: string;
  address: string;
}

export interface SupportMissionContent {
  headerTitle: string;
  mission: {
    intro: string;
    support: string;
    change: string;
  };
  impactNumbers: Array<{
    id: string;
    number: string;
    label: string;
    subtitle: string;
    icon: string;
  }>;
  donationLevelsHeading: string;
  donationLevels: Array<{
    icon: string;
    amount: string;
    title: string;
    description: string;
  }>;
  longTermSolutions: {
    title: string;
    paragraphs: string[];
  };
  whyChiEAC: {
    title: string;
    paragraphs: string[];
  };
  cta: {
    headline: string;
    subheadline: string;
    buttonLabel: string;
    reassuranceText: string;
    badges: Array<{
      emoji: string;
      label: string;
    }>;
  };
}
