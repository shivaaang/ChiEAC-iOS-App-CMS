//
//  types.ts
//  ChiEAC
//
//  HomeManager specific type definitions
//  Created by Shivaang Kumar on 8/24/25.
//

export interface CoreWorkItem {
  id: string;
  title: string;
  description: string;
  icon: string; // SF Symbol name (e.g., "bolt.fill", "person.3")
  order: number;
}

export interface ImpactItem {
  id: string;
  number: string;
  label: string;
  subtitle: string;
  icon: string; // SF Symbol name (e.g., "graduationcap.fill", "house.fill")
  order: number;
}

export type HomeSection = 'coreWork' | 'impact';

export interface HomeManagerState {
  coreWorkItems: CoreWorkItem[];
  impactItems: ImpactItem[];
  loading: boolean;
  activeSection: HomeSection;
  isReorderingMode: boolean;
  showCoreWorkForm: boolean;
  showImpactForm: boolean;
  editingCoreWork: CoreWorkItem | null;
  editingImpact: ImpactItem | null;
}

export interface CoreWorkFormData {
  title: string;
  description: string;
  icon: string; // SF Symbol name
}

export interface ImpactFormData {
  number: string;
  label: string;
  subtitle: string;
  icon: string; // SF Symbol name
}
