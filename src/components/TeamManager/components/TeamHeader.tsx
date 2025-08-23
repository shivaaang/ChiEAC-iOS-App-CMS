/**
 * ChiEAC CMS - Team Header Component
 * @author Claude AI Assistant
 * 
 * A professional, reusable header component for team management interfaces.
 * Combines navigation, team information, metadata, and actions into one cohesive component.
 */

import React from 'react';

interface TeamHeaderProps {
  // Navigation
  onBackToTeams: () => void;
  
  // Team Information
  selectedTeam: {
    id: string;
    team_name: string;
    team_code: string;
    team_description?: string;
  } | null;
  
  // Members data
  filteredMembers: any[];
  isReorderingMode: boolean;
  
  // Actions
  onCreateMember: () => void;
  onEnterReorderingMode: () => void;
  onEditTeam: (team: any) => void;
  onDeleteTeam: (teamId: string) => void;
  
  // Reordering controls
  onHandleDoneReordering: () => void;
  onCancelReordering: () => void;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({
  onBackToTeams,
  selectedTeam,
  filteredMembers,
  isReorderingMode,
  onCreateMember,
  onEnterReorderingMode,
  onEditTeam,
  onDeleteTeam,
  onHandleDoneReordering,
  onCancelReordering,
}) => {
  if (!selectedTeam) {
    return (
      <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl mb-8 overflow-hidden">
        <div className="p-6">
          <div className="text-center py-8 text-slate-400">
            <div className="text-lg">No team selected</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl mb-8 overflow-hidden">
      {/* Single Row Header Layout - Matching Mockup Exactly */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left Section: Back Button + Team Info */}
          <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 flex-1 min-w-0">
            {/* Back Button - aligned with top buttons */}
            <div className="flex-shrink-0">
              <button
                onClick={onBackToTeams}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white px-4 py-2 rounded font-medium transition-all duration-200 text-sm border border-slate-600 hover:border-slate-500 w-full sm:min-w-[120px] flex items-center justify-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Teams</span>
              </button>
            </div>

            {/* Team Title and Description - centered vertically */}
            <div className="flex-1 min-w-0 pr-8 flex flex-col justify-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent leading-tight">
                {selectedTeam.team_name}
              </h1>
              {selectedTeam.team_description && (
                <p className="text-slate-300 text-sm mt-2">
                  {selectedTeam.team_description}
                </p>
              )}
            </div>
          </div>

          {/* Middle Section: Team Code and Team ID - Responsive layout */}
          <div className="flex flex-col space-y-3 flex-1 lg:ml-8 lg:mr-8 lg:flex-shrink-0 lg:self-center">
            {/* Team Code Row */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-1 lg:space-y-0 lg:space-x-3">
              <label className="text-xs text-slate-400 uppercase tracking-wider font-medium lg:text-right lg:w-20 whitespace-nowrap">Team Code</label>
              <div className="bg-slate-700/50 border border-slate-600 rounded px-3 py-1.5 w-full lg:w-48">
                <span className="text-slate-200 font-mono text-sm">{selectedTeam.team_code}</span>
              </div>
            </div>

            {/* Team ID Row */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-1 lg:space-y-0 lg:space-x-3">
              <label className="text-xs text-slate-400 uppercase tracking-wider font-medium lg:text-right lg:w-20 whitespace-nowrap">Team ID</label>
              <div className="bg-slate-700/50 border border-slate-600 rounded px-3 py-1.5 w-full lg:w-48">
                <span className="text-slate-200 font-mono text-sm">{selectedTeam.id}</span>
              </div>
            </div>
          </div>

          {/* Right Section: Action Buttons - Responsive layout */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:flex-shrink-0 lg:self-center">
            {/* Top Row */}
            <button
              onClick={() => onEditTeam(selectedTeam)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white px-4 py-2 rounded font-medium transition-all duration-200 text-sm border border-slate-600 hover:border-slate-500 lg:min-w-[120px] flex items-center justify-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Details</span>
            </button>

            <button
              onClick={onCreateMember}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-medium transition-all duration-200 text-sm flex items-center justify-center space-x-1 lg:min-w-[120px] border border-orange-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Member</span>
            </button>

            {/* Bottom Row */}
            {filteredMembers.length > 1 && !isReorderingMode && (
              <button
                onClick={onEnterReorderingMode}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white px-4 py-2 rounded font-medium transition-all duration-200 text-sm border border-slate-600 hover:border-slate-500 flex items-center justify-center space-x-1 lg:min-w-[120px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Change Order</span>
              </button>
            )}

            <button
              onClick={() => onDeleteTeam(selectedTeam.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-all duration-200 text-sm lg:min-w-[120px] flex items-center justify-center space-x-1 border border-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Team</span>
            </button>
          </div>
        </div>

        {/* Reordering Mode Controls - Separate Row When Active */}
        {isReorderingMode && (
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-amber-300 font-medium">Drag and drop to reorder team members</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onHandleDoneReordering}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Done
                </button>
                <button
                  onClick={onCancelReordering}
                  className="bg-slate-600 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 border border-slate-600 hover:border-slate-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
