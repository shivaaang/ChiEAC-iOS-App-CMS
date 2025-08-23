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
    <div className="mb-6 bg-slate-800 rounded-lg border border-slate-700 shadow-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Sort Order Toggle - Left */}
        <div className="flex flex-col space-y-2 lg:flex-shrink-0">
          <label className="text-sm font-medium text-slate-300">Sort Order</label>
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => onSortOrderChange('latest')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2 ${
                sortOrder === 'latest'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Latest</span>
            </button>
            <button
              onClick={() => onSortOrderChange('oldest')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2 ${
                sortOrder === 'oldest'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span>Oldest</span>
            </button>
          </div>
        </div>

        {/* Search Input - Center */}
        <div className="flex flex-col space-y-2 lg:flex-1 lg:mx-6">
          <label className="text-sm font-medium text-slate-300">Search Submissions</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email, or subject..."
              className="
                w-full pl-10 pr-4 py-3 
                bg-slate-700 border border-slate-600 
                text-white placeholder-slate-400 
                rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all duration-200
              "
            />
          </div>
        </div>

        {/* Status Filter - Right */}
        <div className="flex flex-col space-y-2 lg:flex-shrink-0">
          <label className="text-sm font-medium text-slate-300">Status Filter</label>
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onStatusFilterChange('incomplete')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                statusFilter === 'incomplete'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
              }`}
            >
              Incomplete
            </button>
            <button
              onClick={() => onStatusFilterChange('complete')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                statusFilter === 'complete'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
              }`}
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
