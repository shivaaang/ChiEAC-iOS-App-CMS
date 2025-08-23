//
//  MemberDeleteConfirmationDialog.tsx
//  ChiEAC
//
//  Confirmation dialog for team member deletion
//  Created by Shivaang Kumar on 8/18/25.
//

import React from 'react';
import type { TeamMember } from '../types';

interface MemberDeleteConfirmationDialogProps {
  isVisible: boolean;
  member: TeamMember | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const MemberDeleteConfirmationDialog: React.FC<MemberDeleteConfirmationDialogProps> = ({
  isVisible,
  member,
  onConfirm,
  onCancel
}) => {
  if (!isVisible || !member) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg border border-red-500/30 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Delete Member</h3>
          <p className="text-slate-300 mb-4">
            Are you sure you want to delete "<span className="font-medium text-orange-400">{member.member_name}</span>"?
          </p>
          
          <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
            <p className="text-sm text-slate-300">
              <span className="font-medium">{member.member_title}</span>
            </p>
            {member.member_team && (
              <p className="text-xs text-slate-400">Team: {member.member_team}</p>
            )}
          </div>
          
          <p className="text-sm text-slate-400 mb-6">
            This action cannot be undone.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCancel();
              }}
              className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors touch-manipulation min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onConfirm();
              }}
              className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors touch-manipulation min-h-[44px]"
            >
              Delete Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};