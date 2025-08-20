//
//  FilterAndSortControls.tsx
//  ChiEAC
//
//  Professional filter and sort controls for form submissions
//  Created by Shivaang Kumar on 8/20/25.
//

import React from 'react';

type StatusFilter = 'all' | 'incomplete' | 'complete';
type SortOrder = 'latest' | 'oldest';

interface FilterAndSortControlsProps {
  statusFilter: StatusFilter;
  sortOrder: SortOrder;
  searchQuery: string;
  onStatusFilterChange: (filter: StatusFilter) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onSearchChange: (query: string) => void;
}

const FilterAndSortControls: React.FC<FilterAndSortControlsProps> = ({
  statusFilter,
  sortOrder,
  searchQuery,
  onStatusFilterChange,
  onSortOrderChange,
  onSearchChange
}) => {
  return (
    <div className="sticky top-20 z-10 mb-6 p-4 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Sort Order Toggle - Left */}
        <div className="flex flex-col space-y-2 lg:flex-shrink-0">
          <label className="text-sm font-medium text-slate-300">Sort Order</label>
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => onSortOrderChange('latest')}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2
                ${sortOrder === 'latest'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>Latest</span>
            </button>
            <button
              onClick={() => onSortOrderChange('oldest')}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2
                ${sortOrder === 'oldest'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8V20m0 0l4-4m-4 4l-4-4M7 4v12m0 0l-4-4m4 4l4-4" />
              </svg>
              <span>Oldest</span>
            </button>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="flex flex-col space-y-2 lg:flex-1 lg:mx-6">
          <label className="text-sm font-medium text-slate-300">Search Submissions</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email, phone, or message..."
              className="
                block w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg
                text-white placeholder-slate-400 text-sm
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
              "
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Toggle - Right */}
        <div className="flex flex-col space-y-2 lg:flex-shrink-0">
          <label className="text-sm font-medium text-slate-300">Filter by Status</label>
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${statusFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }
              `}
            >
              Show All
            </button>
            <button
              onClick={() => onStatusFilterChange('incomplete')}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${statusFilter === 'incomplete'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }
              `}
            >
              Incomplete
            </button>
            <button
              onClick={() => onStatusFilterChange('complete')}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${statusFilter === 'complete'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }
              `}
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterAndSortControls;
