//
//  ProgramDeleteConfirmationDialog.tsx
//  ChiEAC
//
//  Confirmation dialog for program deletion
//  Created by Shivaang Kumar on 8/21/25.
//

import React from 'react';
import type { ProgramInfo } from '../../../types';

interface ProgramDeleteConfirmationDialogProps {
  isVisible: boolean;
  program: ProgramInfo | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ProgramDeleteConfirmationDialog: React.FC<ProgramDeleteConfirmationDialogProps> = ({
  isVisible,
  program,
  onConfirm,
  onCancel
}) => {
  if (!isVisible || !program) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg border border-red-500/30 max-w-lg w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Delete Program</h3>
          <p className="text-slate-300 mb-4">
            Are you sure you want to delete "<span className="font-medium text-emerald-400">{program.title}</span>"?
          </p>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <h4 className="text-red-300 font-medium mb-2">⚠️ Warning</h4>
            <p className="text-sm text-red-200">
              This will permanently remove the program and all its associated benefits and impact data.
            </p>
          </div>
          
          <p className="text-sm text-slate-400 mb-6">
            This action cannot be undone.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onCancel}
              className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Program
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
