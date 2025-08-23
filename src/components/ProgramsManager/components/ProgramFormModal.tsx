//
//  ProgramFormModal.tsx
//  ChiEAC
//
//  Program form modal component for adding and editing programs
//  Created by Shivaang Kumar on 8/21/25.
//

import type { ProgramInfo } from '../../../types';

interface ProgramFormModalProps {
  isVisible: boolean;
  editingProgram: ProgramInfo | null;
  formData: Omit<ProgramInfo, 'id' | 'order'>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onFormDataChange: (data: Omit<ProgramInfo, 'id' | 'order'>) => void;
  onAddListItem: (field: 'benefits' | 'impact') => void;
  onUpdateListItem: (field: 'benefits' | 'impact', index: number, value: string) => void;
  onRemoveListItem: (field: 'benefits' | 'impact', index: number) => void;
}

export default function ProgramFormModal({
  isVisible,
  editingProgram,
  formData,
  onSubmit,
  onClose,
  onFormDataChange,
  onAddListItem,
  onUpdateListItem,
  onRemoveListItem
}: ProgramFormModalProps) {
  if (!isVisible) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-[60] p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl my-4 min-h-fit">
        <div className="p-4 sm:p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingProgram ? 'Edit Program' : 'Add New Program'}
          </h3>
        </div>
        
        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent touch-manipulation min-h-[44px]"
                placeholder="Enter program title"
                required
                autoComplete="off"
                autoCapitalize="words"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subtitle <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => onFormDataChange({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent touch-manipulation min-h-[44px]"
                placeholder="Enter program subtitle"
                required
                autoComplete="off"
                autoCapitalize="words"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter program description"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Icon (SF Symbol)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => onFormDataChange({ ...formData, icon: e.target.value })}
                placeholder="graduationcap.fill"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-400 mt-1">
                Examples: graduationcap.fill, book.closed, person.3
              </p>
            </div>
            <div className="flex items-center">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-amber-300/90">
                    Please use only SF Symbols for proper rendering in the mobile app.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Benefits
              </label>
              <button
                type="button"
                onClick={() => onAddListItem('benefits')}
                className="text-emerald-400 hover:text-emerald-300 text-sm"
              >
                + Add Benefit
              </button>
            </div>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => onUpdateListItem('benefits', index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter benefit"
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveListItem('benefits', index)}
                    className="text-red-400 hover:text-red-300 px-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Impact */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Impact
              </label>
              <button
                type="button"
                onClick={() => onAddListItem('impact')}
                className="text-emerald-400 hover:text-emerald-300 text-sm"
              >
                + Add Impact
              </button>
            </div>
            {formData.impact.map((impact, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={impact}
                  onChange={(e) => onUpdateListItem('impact', index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter impact"
                />
                {formData.impact.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveListItem('impact', index)}
                    className="text-red-400 hover:text-red-300 px-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-700 pt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              className="w-full sm:w-auto px-6 py-3 text-slate-300 hover:text-white border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors touch-manipulation min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg touch-manipulation min-h-[44px]"
            >
              {editingProgram ? 'Update Program' : 'Add Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
