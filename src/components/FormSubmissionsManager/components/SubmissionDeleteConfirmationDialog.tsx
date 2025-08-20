//
//  SubmissionDeleteConfirmationDialog.tsx
//  ChiEAC
//
//  Confirmation dialog for form submission deletion with warning
//  Created by Shivaang Kumar on 8/20/25.
//

import React from 'react';
import type { FormSubmission } from '../types';

interface SubmissionDeleteConfirmationDialogProps {
  isVisible: boolean;
  submission: FormSubmission | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SubmissionDeleteConfirmationDialog: React.FC<SubmissionDeleteConfirmationDialogProps> = ({
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
          <div className="w-16 h-16 bg-slate-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Delete Submission</h3>
          <p className="text-slate-300 mb-4">
            Are you sure you want to delete the message from <span className="font-medium text-blue-400">{submission.firstName} {submission.lastName}</span>?
          </p>
          
          <p className="text-sm text-slate-400 mb-6">
            This action cannot be recovered once deleted.
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
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
