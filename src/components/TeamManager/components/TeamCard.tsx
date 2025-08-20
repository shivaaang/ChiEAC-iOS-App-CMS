//
//  TeamCard.tsx
//  ChiEAC
//
//  Team card component matching legacy layout exactly (both normal and reordering modes)
//  Created by Shivaang Kumar on 8/18/25.
//

import React from 'react';
import type { Team } from '../types';

interface TeamCardProps {
  team: Team;
  memberCount: number;
  index: number;
  isSelected: boolean;
  isReorderingMode: boolean;
  isDragging?: boolean;
  onClick: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export const TeamCard = React.forwardRef<HTMLDivElement, TeamCardProps>(({
  team,
  memberCount,
  index,
  isSelected,
  isReorderingMode,
  isDragging = false,
  onClick,
  onDelete,
  dragHandleProps,
  ...props
}, ref) => {

  if (isReorderingMode) {
    return (
      <div 
        ref={ref}
        {...props}
        {...dragHandleProps}
        className={`group relative backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 shadow-lg cursor-grab active:cursor-grabbing border-blue-500/50 bg-slate-900/70 ${
          isDragging ? 'shadow-2xl shadow-blue-500/30 scale-105' : ''
        }`}
      >
        {/* Order indicator - rounded square */}
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

  // Normal card style
  return (
    <div
      ref={ref}
      {...props}
      onClick={onClick}
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
                <h3 className="font-bold text-white text-2xl leading-tight group-hover:text-orange-100 transition-colors duration-300">
                  {team.team_name}
                </h3>
                {/* Permanent arrow indicator */}
                <svg className="w-5 h-5 text-orange-400 opacity-60 group-hover:opacity-100 group-hover:text-orange-300 transition-all duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Member Count Capsule */}
              <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-3 py-1.5 flex items-center gap-1.5 group-hover:border-orange-400/50 group-hover:from-orange-500/30 group-hover:to-amber-500/30 transition-all duration-300">
                <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-orange-300 text-xs font-medium group-hover:text-orange-200 transition-colors duration-300">
                  {memberCount} Members
                </span>
              </div>
              
              {/* Order indicator inline with capsule */}
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-md bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-orange-500/30 border border-orange-300/30">
                {index + 1}
              </div>
            </div>
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full group-hover:w-24 transition-all duration-300"></div>
        </div>

        {/* Description Section */}
        <div className="flex-1 mb-6">
          <p className="text-slate-300 text-sm leading-relaxed overflow-hidden group-hover:text-slate-200 transition-colors duration-300" 
             style={{
               display: '-webkit-box',
               WebkitLineClamp: 3,
               WebkitBoxOrient: 'vertical'
             }}>
            {team.team_description}
          </p>
        </div>

        {/* Bottom Action Hint */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 text-orange-300/60 group-hover:text-orange-300 transition-all duration-300">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
              Click to view details
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

TeamCard.displayName = 'TeamCard';