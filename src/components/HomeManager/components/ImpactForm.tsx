//
//  ImpactForm.tsx
//  ChiEAC
//
//  Impact statistics form modal component
//  Created by Shivaang Kumar on 8/24/25.
//

import React, { useState, useEffect } from 'react';
import type { ImpactItem, ImpactFormData } from '../types';

interface ImpactFormProps {
  isVisible: boolean;
  editingItem: ImpactItem | null;
  onSubmit: (formData: ImpactFormData) => Promise<void>;
  onClose: () => void;
}

const ImpactForm: React.FC<ImpactFormProps> = ({
  isVisible,
  editingItem,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<ImpactFormData>({
    number: '',
    label: '',
    subtitle: '',
    icon: '',
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or editing item changes
  useEffect(() => {
    if (isVisible) {
      if (editingItem) {
        setFormData({
          number: editingItem.number,
          label: editingItem.label,
          subtitle: editingItem.subtitle,
          icon: editingItem.icon,
        });
      } else {
        setFormData({
          number: '',
          label: '',
          subtitle: '',
          icon: '',
        });
      }
    }
  }, [isVisible, editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number.trim() || !formData.label.trim() || !formData.subtitle.trim()) return;

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
            {editingItem ? 'Edit Impact Statistic' : 'Add Impact Statistic'}
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
          {/* Number */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Number *
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="1,600+"
              required
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Students Supported"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Subtitle *
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="across Chicago"
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
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="graduationcap.fill, house.fill, etc."
            />
            
            {/* SF Symbol Suggestions */}
            <div className="mt-3">
              <p className="text-xs text-slate-400 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {['graduationcap.fill', 'house.fill', 'dollarsign.circle.fill', 'chart.bar.fill', 'heart.fill', 'globe', 'people.fill', 'trophy.fill'].map((symbol) => (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: symbol })}
                    className="px-2 py-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-xs rounded-full border border-violet-600/30 hover:border-violet-600/50 transition-colors"
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
              disabled={loading || !formData.number.trim() || !formData.label.trim() || !formData.subtitle.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ImpactForm;
