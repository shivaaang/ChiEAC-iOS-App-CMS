//
//  SectionSelector.tsx
//  ChiEAC
//
//  Section selector component for switching between Core Work and Impact
//  Created by Shivaang Kumar on 8/24/25.
//

import React from 'react';
import type { HomeSection } from '../types';

interface SectionSelectorProps {
  activeSection: HomeSection;
  onSectionChange: (section: HomeSection) => void;
  coreWorkCount: number;
  impactCount: number;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({
  activeSection,
  onSectionChange,
  coreWorkCount,
  impactCount,
}) => {
  return (
    <div className="flex items-center bg-slate-800/60 backdrop-blur-sm rounded-xl p-1.5 border border-slate-700/60">
      <button
        onClick={() => onSectionChange('coreWork')}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
          activeSection === 'coreWork'
            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
        }`}
      >
        <div className={`p-2 rounded-lg ${
          activeSection === 'coreWork' 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-slate-700/60 text-slate-400'
        }`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold">Core Work</span>
          <span className={`text-xs ${
            activeSection === 'coreWork' ? 'text-emerald-300' : 'text-slate-500'
          }`}>
            {coreWorkCount} {coreWorkCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </button>

      <button
        onClick={() => onSectionChange('impact')}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
          activeSection === 'impact'
            ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 border border-violet-500/30 shadow-lg shadow-violet-500/10'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
        }`}
      >
        <div className={`p-2 rounded-lg ${
          activeSection === 'impact' 
            ? 'bg-violet-500/20 text-violet-400' 
            : 'bg-slate-700/60 text-slate-400'
        }`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold">Impact Stats</span>
          <span className={`text-xs ${
            activeSection === 'impact' ? 'text-violet-300' : 'text-slate-500'
          }`}>
            {impactCount} {impactCount === 1 ? 'stat' : 'stats'}
          </span>
        </div>
      </button>
    </div>
  );
};

export default SectionSelector;
