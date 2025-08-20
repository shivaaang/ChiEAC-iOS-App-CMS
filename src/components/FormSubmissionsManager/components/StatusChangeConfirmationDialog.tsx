//
//  StatusChangeConfirmationDialog.tsx
//  ChiEAC
//
//  Confirmation dialog for changing submission status to incomplete
//  Created by Shivaang Kumar on 8/20/25.
//

import React from 'react';
import type { FormSubmission } from '../types';

interface StatusChangeConfirmationDialogProps {
  isVisible: boolean;
  submission: FormSubmission | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const StatusChangeConfirmationDialog: React.FC<StatusChangeConfirmationDialogProps> = ({
  isVisible,
  submission,
  onConfirm,
  onCancel
}) => {
  if (!isVisible || !submission) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 max-w-lg w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Mark as Incomplete</h3>
          <p className="text-slate-300 mb-4">
            Are you sure you want to mark the submission from <span className="font-medium text-blue-400">{submission.firstName} {submission.lastName}</span> as incomplete?
          </p>
          
          <p className="text-sm text-slate-400 mb-6">
            This will move the submission back to your pending items list.
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
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Mark Incomplete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
