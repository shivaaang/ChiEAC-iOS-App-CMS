// Main TeamManager module exports
export { default } from './TeamManager';
export { default as TeamManager } from './TeamManager';

// Re-export types for external use
export type { Team, TeamMember } from './types';

// Re-export hooks for external use if needed
export { useTeamManager } from './hooks';

// Re-export components for external use if needed
export * from './components';
