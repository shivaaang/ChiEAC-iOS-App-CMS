//
//  MemberCard.tsx
//  ChiEAC
//
//  Individual team member card component
//  Created by Shivaang Kumar on 8/17/25.
//

import React from 'react';
import type { TeamMember } from '../types';

interface MemberCardProps {
  member: TeamMember;
  index: number;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  isDragging?: boolean;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  index,
  onEditMember,
  onDeleteMember,
  isDragging = false
}) => {
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'lead':
      case 'team lead':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'member':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'lead':
      case 'team lead':
        return 'from-amber-500 to-yellow-500 border-amber-400/40';
      case 'member':
        return 'from-blue-500 to-indigo-500 border-blue-400/40';
      default:
        return 'from-slate-500 to-gray-500 border-slate-400/40';
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border border-slate-700/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] bg-gradient-to-br from-slate-900/60 to-slate-800/40 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 ${
      isDragging ? 'shadow-2xl shadow-orange-500/30 scale-105' : ''
    }`}>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

      {/* Content */}
      <div className="relative p-6">
        {/* Header with role badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-orange-100 transition-colors duration-300">
              {member.member_name}
            </h4>
            <p className="text-slate-400 text-sm">
              {member.member_title}
            </p>
          </div>
          
          {/* Role Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-white text-xs font-medium shadow-lg bg-gradient-to-br ${getRoleColor(member.member_title)}`}>
            {getRoleIcon(member.member_title)}
            <span>{member.member_title}</span>
          </div>
        </div>

        {/* Bio */}
        {member.member_summary && (
          <div className="mb-4">
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
              {member.member_summary}
            </p>
          </div>
        )}

        {/* Order indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600">
              {index + 1}
            </div>
            <span className="text-xs font-medium">Display Order</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditMember(member);
              }}
              className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors duration-200 shadow-lg"
              title="Edit Member"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteMember(member.id);
              }}
              className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors duration-200 shadow-lg"
              title="Delete Member"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
