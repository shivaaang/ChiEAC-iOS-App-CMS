//
//  ExpertModeWarningDialog.tsx
//  ChiEAC
//
//  Warning dialog for expert mode functionality
//  Created by Shivaang Kumar on 8/17/25.
//

import React from 'react';

interface ExpertModeWarningDialogProps {
  isVisible: boolean;
  warningType: 'team' | 'member' | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExpertModeWarningDialog: React.FC<ExpertModeWarningDialogProps> = ({
  isVisible,
  warningType,
  onConfirm,
  onCancel
}) => {
  if (!isVisible || !warningType) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl border border-amber-500/30 max-w-lg w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-amber-300">Expert Mode Warning</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-slate-300 text-sm mb-4">
            You are about to enable Expert Mode for {warningType} editing. This mode allows you to directly modify 
            Firestore database fields, including auto-generated IDs and codes.
          </p>
          
          <div className="bg-slate-700/50 p-4 rounded-lg border border-amber-500/20 mb-4">
            <h4 className="font-medium text-amber-300 text-sm mb-2">⚠️ Important Warnings:</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Modifying auto-generated fields can break relationships</li>
              <li>• Invalid IDs or codes may cause database errors</li>
              <li>• Changes are permanent and may affect the live website</li>
              <li>• Only use if you understand Firestore data structure</li>
            </ul>
          </div>
          
          <p className="text-slate-400 text-xs">
            <strong>Recommendation:</strong> Use Safe Mode (default) unless you specifically need to modify database fields.
          </p>
        </div>
        
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200"
          >
            Stay in Safe Mode
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-amber-600/25"
          >
            Enable Expert Mode
          </button>
        </div>
      </div>
    </div>
  );
};
