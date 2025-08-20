//
//  OrderChangeConfirmationDialog.tsx
//  ChiEAC
//
//  Confirmation dialog for reordering operations
//  Created by Shivaang Kumar on 8/18/25.
//

import React from 'react';

interface OrderChangeConfirmationDialogProps {
  isVisible: boolean;
  isTeamReordering?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const OrderChangeConfirmationDialog: React.FC<OrderChangeConfirmationDialogProps> = ({
  isVisible,
  isTeamReordering = false,
  onConfirm,
  onCancel
}) => {
  if (!isVisible) return null;

  const itemTypePlural = isTeamReordering ? 'teams' : 'members';

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg border border-blue-500/30 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            Save Order Changes
          </h3>
          <p className="text-slate-300 mb-4">
            You've reordered the {itemTypePlural}. Do you want to save these changes?
          </p>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-200">
              The new order will be saved to the database and reflected across the application.
            </p>
          </div>
          
          <p className="text-sm text-slate-400 mb-6">
            You can also discard changes to revert to the original order.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};