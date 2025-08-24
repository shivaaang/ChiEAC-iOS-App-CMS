//
//  CoreWorkForm.tsx
//  ChiEAC
//
//  Core Work item form modal component
//  Created by Shivaang Kumar on 8/24/25.
//

import React, { useState, useEffect } from 'react';
import type { CoreWorkItem, CoreWorkFormData } from '../types';

interface CoreWorkFormProps {
  isVisible: boolean;
  editingItem: CoreWorkItem | null;
  onSubmit: (formData: CoreWorkFormData) => Promise<void>;
  onClose: () => void;
}

const CoreWorkForm: React.FC<CoreWorkFormProps> = ({
  isVisible,
  editingItem,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<CoreWorkFormData>({
    title: '',
    description: '',
    icon: '',
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or editing item changes
  useEffect(() => {
    if (isVisible) {
      if (editingItem) {
        setFormData({
          title: editingItem.title,
          description: editingItem.description,
          icon: editingItem.icon,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          icon: '',
        });
      }
    }
  }, [isVisible, editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {editingItem ? 'Edit Core Work Item' : 'Add Core Work Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter description"
              required
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              SF Symbol Name
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="bolt.fill, person.3, etc."
            />
            
            {/* SF Symbol Suggestions */}
            <div className="mt-3">
              <p className="text-xs text-slate-400 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {['bolt.fill', 'person.3.fill', 'lightbulb.fill', 'target', 'star.fill', 'heart.fill', 'shield.fill', 'gear'].map((symbol) => (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: symbol })}
                    className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs rounded-full border border-emerald-600/30 hover:border-emerald-600/50 transition-colors"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Caution Notice */}
            <div className="mt-3 p-2 bg-amber-900/20 border border-amber-600/30 rounded-lg flex items-start space-x-2">
              <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-xs text-amber-200">
                Only use valid SF Symbol names to ensure proper rendering in the iOS app.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.description.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {editingItem ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                editingItem ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoreWorkForm;
