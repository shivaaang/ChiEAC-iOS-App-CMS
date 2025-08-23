//
//  MemberCard.tsx
//  ChiEAC
//
//  Team member card component matching legacy layout exactly
//  Created by Shivaang Kumar on 8/18/25.
//

import React from 'react';
import type { TeamMember } from '../types';

interface MemberCardProps {
  member: TeamMember;
  index: number;
  isSelected: boolean;
  isReorderingMode: boolean;
  isDragging?: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export const MemberCard = React.forwardRef<HTMLDivElement, MemberCardProps>(({
  member,
  index,
  isSelected,
  isReorderingMode,
  isDragging = false,
  onClick,
  onEdit,
  onDelete,
  dragHandleProps,
  ...props
}, ref) => {
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number; time: number } | null>(null);
  const [touchMoved, setTouchMoved] = React.useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isReorderingMode) return;
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
    setTouchMoved(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || isReorderingMode) return;
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    // If moved more than 10px in any direction, consider it a scroll/swipe
    if (deltaX > 10 || deltaY > 10) {
      setTouchMoved(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isReorderingMode || !touchStart) return;
    
    const touchDuration = Date.now() - touchStart.time;
    
    // Only trigger click if:
    // 1. Touch didn't move significantly (not a scroll)
    // 2. Touch duration was reasonable (not a long press)
    if (!touchMoved && touchDuration < 500) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
    
    setTouchStart(null);
    setTouchMoved(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isReorderingMode) return;
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      ref={ref}
      {...props}
      {...(isReorderingMode ? dragHandleProps : {})}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`group relative backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 shadow-lg touch-manipulation ${
        isReorderingMode 
          ? 'cursor-grab active:cursor-grabbing border-blue-500/50 bg-slate-900/70' 
          : 'cursor-pointer'
      } ${
        isSelected && !isReorderingMode
          ? 'bg-slate-900/80 border-orange-500/50 shadow-2xl shadow-orange-500/20' 
          : isReorderingMode
          ? 'bg-slate-900/70 border-blue-500/30 hover:border-blue-400/50'
          : 'bg-slate-900/60 border-slate-700 hover:bg-slate-800/60 hover:border-orange-500/50 hover:shadow-xl'
      } ${isDragging ? 'shadow-2xl shadow-blue-500/30 scale-105' : ''}`}
    >
      {/* Gradient Overlay for selected state */}
      {isSelected && !isReorderingMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl pointer-events-none"></div>
      )}

      {/* Reordering mode overlay */}
      {isReorderingMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl pointer-events-none"></div>
      )}
      
      {/* Drag indicator for reordering mode - top right */}
      {isReorderingMode && (
        <div className="absolute top-4 right-4 text-blue-400 opacity-70">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      )}

      {/* Subtle clickable indicator - top right (only when not reordering) */}
      {!isReorderingMode && (
        <div className="absolute top-4 right-4 opacity-40 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
      
      <div className="relative z-10">
        {/* Redesigned layout with order number below image */}
        <div className="flex items-center space-x-3 sm:space-x-6 pr-4 sm:pr-16">
          {/* Member image section with order number below */}
          <div className="flex-shrink-0 flex flex-col items-center space-y-2 sm:space-y-3">
            {/* Member image */}
            {(member.member_image_link || member.imageURL) ? (
              <img
                src={member.member_image_link || member.imageURL}
                alt={member.member_name || member.name}
                className="w-16 h-16 rounded-full object-cover border-3 border-orange-500/40 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-3 border-slate-500/40 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            
            {/* Order indicator - rounded square below image */}
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-md ${
              isReorderingMode 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/30 border border-blue-300/30' 
                : 'bg-gradient-to-br from-slate-600 to-slate-700 text-slate-300 shadow-slate-700/30 border border-slate-500/30'
            }`}>
              {index + 1}
            </div>
          </div>
          
          {/* Member information - improved typography and spacing */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-xl leading-tight group-hover:text-orange-100 transition-colors duration-300 mb-1">
              {member.member_name || member.name}
            </h3>
            <p className="text-orange-400 text-base font-medium mb-2">
              {member.member_title || member.title}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors duration-300 line-clamp-2">
              {member.member_summary_short || member.bioShort || 'No bio available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

MemberCard.displayName = 'MemberCard';