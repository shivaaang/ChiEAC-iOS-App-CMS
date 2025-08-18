//
//  CreationConfirmationDialog.tsx
//  ChiEAC
//
//  Confirmation dialog for team and member creation
//  Created by Shivaang Kumar on 8/17/25.
//

import React from 'react';

interface CreationConfirmationDialogProps {
  isVisible: boolean;
  pendingCreation: {
    type: 'team' | 'member';
    data: any;
  } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CreationConfirmationDialog: React.FC<CreationConfirmationDialogProps> = ({
  isVisible,
  pendingCreation,
  onConfirm,
  onCancel
}) => {
  if (!isVisible || !pendingCreation) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg border border-orange-500/30 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-200">
            Create New {pendingCreation.type === 'team' ? 'Team' : 'Team Member'}
          </h3>
        </div>
        
        <p className="text-slate-300 text-sm mb-4">
          Are you sure you want to create this {pendingCreation.type === 'team' ? 'team' : 'team member'}? 
          This will be published to the database immediately.
        </p>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h4 className="font-medium text-orange-300 text-sm mb-3">Details:</h4>
          {pendingCreation.type === 'team' ? (
            <div className="space-y-2 text-sm text-slate-300">
              <div><span className="text-slate-400">Name:</span> {pendingCreation.data.team_name}</div>
              <div><span className="text-slate-400">Description:</span> {pendingCreation.data.team_description}</div>
              <div><span className="text-slate-400">Team Code:</span> {pendingCreation.data.team_code}</div>
              <div><span className="text-slate-400">ID:</span> {pendingCreation.data.id}</div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-slate-300">
              <div><span className="text-slate-400">Name:</span> {pendingCreation.data.member_name}</div>
              <div><span className="text-slate-400">Title:</span> {pendingCreation.data.member_title}</div>
              <div><span className="text-slate-400">Team:</span> {pendingCreation.data.member_team}</div>
              <div><span className="text-slate-400">ID:</span> {pendingCreation.data.id}</div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-green-600/25"
          >
            Create {pendingCreation.type === 'team' ? 'Team' : 'Member'}
          </button>
        </div>
      </div>
    </div>
  );
};
