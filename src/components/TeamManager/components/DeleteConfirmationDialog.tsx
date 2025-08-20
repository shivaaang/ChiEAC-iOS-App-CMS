//
//  DeleteConfirmationDialog.tsx
//  ChiEAC
//
//  Confirmation dialog for team deletion with impact details
//  Created by Shivaang Kumar on 8/18/25.
//

import React from 'react';
import type { Team, TeamMember } from '../types';

interface DeleteConfirmationDialogProps {
  isVisible: boolean;
  team: Team | null;
  affectedMembers: TeamMember[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isVisible,
  team,
  affectedMembers,
  onConfirm,
  onCancel
}) => {
  if (!isVisible || !team) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg border border-red-500/30 max-w-lg w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Delete Team</h3>
          <p className="text-slate-300 mb-4">
            Are you sure you want to delete "<span className="font-medium text-orange-400">{team.team_name}</span>"?
          </p>
          
          {affectedMembers.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <h4 className="text-red-300 font-medium mb-2">⚠️ Impact Warning</h4>
              <p className="text-sm text-red-200 mb-3">
                This team has <span className="font-medium">{affectedMembers.length} member{affectedMembers.length !== 1 ? 's' : ''}</span> that will also be deleted:
              </p>
              <div className="max-h-32 overflow-y-auto">
                <ul className="text-sm text-red-200 space-y-1">
                  {affectedMembers.map((member) => (
                    <li key={member.id} className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      {member.member_name} ({member.member_title})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <p className="text-sm text-slate-400 mb-6">
            This action cannot be undone.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};