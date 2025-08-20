// Hooks index - re-exports all team management hooks
export { useTeamManager } from './useTeamManager';
export { createTeamHandlers } from './useTeamHandlers';
export { createConfirmationHandlers } from './useConfirmationHandlers';

// Hook wrappers for easier usage
import { createTeamHandlers } from './useTeamHandlers';
import { createConfirmationHandlers } from './useConfirmationHandlers';

export const useTeamHandlers = (teamManager: any) => {
  return createTeamHandlers(teamManager, teamManager);
};

export const useConfirmationHandlers = (teamManager: any, teamHandlers?: any) => {
  return createConfirmationHandlers(teamManager, teamManager, teamHandlers);
};
