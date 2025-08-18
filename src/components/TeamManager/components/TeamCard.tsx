//
//  TeamCard.tsx
//  ChiEAC
//
//  Individual team card component with member count display
//  Created by Shivaang Kumar on 8/17/25.
//

import React from 'react';
import type { Team, TeamMember } from '../types';

interface TeamCardProps {
  team: Team;
  index: number;
  isSelected: boolean;
  isReorderingMode: boolean;
  teamMembers: TeamMember[];
  onTeamClick: (team: Team) => void;
  onViewTeamDetails: (team: Team) => void;
  onDeleteTeam: (id: string) => void;
  isDragging?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  index,
  isSelected,
  isReorderingMode,
  teamMembers,
  onTeamClick,
  onViewTeamDetails: _onViewTeamDetails,
  onDeleteTeam: _onDeleteTeam,
  isDragging = false
}) => {
  const memberCount = teamMembers.filter(member => 
    member.member_team === team.team_code || member.team === team.team_code
  ).length;

  if (isReorderingMode) {
    return (
      <div className={`group relative backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 shadow-lg cursor-grab active:cursor-grabbing border-blue-500/50 bg-slate-900/70 ${
        isDragging ? 'shadow-2xl shadow-blue-500/30 scale-105' : ''
      }`}>
        
        {/* Order indicator */}
        <div className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/30 border border-blue-300/30">
          {index + 1}
        </div>

        {/* Reordering mode overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl pointer-events-none"></div>
        
        {/* Drag indicator */}
        <div className="absolute top-14 right-4 text-blue-400 opacity-70">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-6 pr-16">
            {/* Team icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 border-3 border-orange-500/40 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            
            {/* Team information */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-xl leading-tight mb-1">
                {team.team_name}
              </h3>
              <p className="text-orange-400 text-base font-medium mb-2">
                {memberCount} Members
              </p>
              <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
                {team.team_description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onTeamClick(team)}
      className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-300 cursor-pointer transform hover:scale-[1.02] h-80 ${
        isSelected 
          ? 'border-orange-500/50 shadow-2xl shadow-orange-500/20 bg-gradient-to-br from-slate-900/80 to-slate-800/60' 
          : 'border-slate-700/50 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/15 bg-gradient-to-br from-slate-900/60 to-slate-800/40 hover:-translate-y-1'
      }`}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-300 ${
        isSelected 
          ? 'from-orange-500/10 to-amber-500/10 opacity-100' 
          : 'from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100'
      }`}></div>

      {/* Content */}
      <div className="relative p-8 h-full flex flex-col">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white text-2xl leading-tight group-hover:text-orange-100 transition-colors duration-300">
                  {team.team_name}
                </h3>
              </div>
              <p className="text-slate-400 text-sm font-medium">
                Team Code: {team.team_code}
              </p>
            </div>
          </div>
        </div>

        {/* Members Count */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-orange-400">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-md bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-orange-500/30 border border-orange-300/30">
              {memberCount}
            </div>
            <span className="text-sm font-medium">
              {memberCount === 1 ? 'Member' : 'Members'}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 mb-6">
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
            {team.team_description}
          </p>
        </div>

        {/* Bottom Action */}
        <div className="mt-auto">
          <div className="flex items-center justify-center">
            <div className="text-orange-400 group-hover:text-orange-300 text-sm font-medium transition-colors duration-300 flex items-center gap-2">
              <span>Click to view details</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
