//
//  ProgramViewDialog.tsx
//  ChiEAC
//
//  Program view dialog component for displaying program details
//  Created by Shivaang Kumar on 8/21/25.
//

import type { ProgramInfo } from '../../../types';

interface ProgramViewDialogProps {
  program: ProgramInfo;
  onClose: () => void;
  onEdit: (program: ProgramInfo) => void;
  onDelete: (program: ProgramInfo) => void;
}

export default function ProgramViewDialog({ 
  program, 
  onClose, 
  onEdit, 
  onDelete 
}: ProgramViewDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-white">{program.title}</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => onEdit(program)}
                className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 px-4 py-2 rounded-lg border border-emerald-500/30 transition-colors flex-1 sm:flex-none justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => onDelete(program)}
                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg border border-red-500/30 transition-colors flex-1 sm:flex-none justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white ml-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Header with basic info */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{program.title}</h2>
              <p className="text-emerald-300 text-lg font-medium">{program.subtitle}</p>
            </div>
            <div className="text-right text-sm space-y-1 mt-1">
              <div>
                <span className="text-slate-400">Icon: </span>
                <span className="text-white">{program.icon}</span>
              </div>
              <div>
                <span className="text-slate-400">Order: </span>
                <span className="text-white">{program.order + 1}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
            <p className="text-slate-300 leading-relaxed">{program.description}</p>
          </div>

          {/* Benefits and Impact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Benefits */}
            <div>
              {program.benefits.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Benefits</h4>
                  <ul className="space-y-2">
                    {program.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <span className="text-slate-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Impact */}
            <div>
              {program.impact.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Impact</h4>
                  <ul className="space-y-2">
                    {program.impact.map((impact, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <span className="text-slate-300">{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
