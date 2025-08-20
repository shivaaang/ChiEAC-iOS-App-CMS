//
//  ChangeConfirmationDialog.tsx
//  ChiEAC
//
//  Confirmation dialog for team and member changes
//  Created by Shivaang Kumar on 8/18/25.
//

import React from 'react';
import type { PendingChanges } from '../types';

interface ChangeConfirmationDialogProps {
  isVisible: boolean;
  pendingChanges: PendingChanges;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ChangeConfirmationDialog: React.FC<ChangeConfirmationDialogProps> = ({
  isVisible,
  pendingChanges,
  onConfirm,
  onCancel
}) => {
  if (!isVisible) return null;

  const isTeam = pendingChanges.type === 'team';

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg border border-orange-500/30 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            Confirm {isTeam ? 'Team' : 'Member'} Changes
          </h3>
          <p className="text-slate-300 mb-4">
            Please review the changes below:
          </p>
          
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
            {pendingChanges.changes.map((change, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="text-sm font-medium text-slate-300 mb-1">
                  {change.field}
                </div>
                <div className="text-xs space-y-1">
                  <div className="text-red-300">
                    <span className="font-medium">From:</span> {change.oldValue || '(empty)'}
                  </div>
                  <div className="text-green-300">
                    <span className="font-medium">To:</span> {change.newValue || '(empty)'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-slate-400 mb-6">
            Do you want to save these changes?
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};