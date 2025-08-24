//
//  ImpactCard.tsx
//  ChiEAC
//
//  Impact statistics card component
//  Created by Shivaang Kumar on 8/24/25.
//

import React from 'react';
import type { ImpactItem } from '../types';

interface ImpactCardProps {
  item: ImpactItem;
  index: number;
  isReorderingMode: boolean;
  onEdit: (item: ImpactItem) => void;
  onDelete: (item: ImpactItem) => void;
  isDragging?: boolean;
}

const ImpactCard: React.FC<ImpactCardProps> = ({
  item,
  index,
  isReorderingMode,
  onEdit,
  onDelete,
  isDragging = false,
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60 hover:border-slate-600/60 transition-all duration-300 group ${
        isDragging ? 'shadow-2xl shadow-violet-500/20 scale-105' : ''
      } ${isReorderingMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="flex-1 min-w-0 pr-3 text-center">
          {/* SF Symbol Name */}
          {item.icon && (
            <div className="inline-flex items-center px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full mb-3">
              <span className="text-xs text-violet-400 font-mono">
                {item.icon}
              </span>
            </div>
          )}
          
          {/* Metric - Large number */}
          <div className="text-3xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300 mb-2">
            {item.number}
          </div>
          
          {/* Label - Medium text */}
          <div className="text-base font-semibold text-slate-300 mb-1">
            {item.label}
          </div>
          
          {/* Subtitle - Small text */}
          <div className="text-sm text-slate-400">
            {item.subtitle}
          </div>
        </div>

        {/* Actions at top right */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {isReorderingMode && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-violet-500/20 text-violet-400 rounded text-xs font-bold border border-violet-500/30">
                {index + 1}
              </div>
              <div className="text-slate-400 cursor-grab active:cursor-grabbing">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>
            </div>
          )}
          
          {!isReorderingMode && (
            <div className="flex items-center space-x-1">
              {/* Edit button */}
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded transition-all duration-200"
                title="Edit Impact Statistic"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              {/* Delete button */}
              <button
                onClick={() => onDelete(item)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200"
                title="Delete Impact Statistic"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImpactCard;
