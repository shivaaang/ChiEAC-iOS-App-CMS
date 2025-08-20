//
//  SubmissionCard.tsx
//  ChiEAC
//
//  Horizontal card component for displaying form submissions
//  Created by Shivaang Kumar on 8/20/25.
//

import React, { useState } from 'react';
import type { FormSubmissionCardProps } from '../types';
import { SubmissionDeleteConfirmationDialog } from './SubmissionDeleteConfirmationDialog';
import { StatusChangeConfirmationDialog } from './StatusChangeConfirmationDialog';

const SubmissionCard: React.FC<FormSubmissionCardProps> = ({ 
  submission, 
  onView,
  onStatusChange,
  onDelete
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const handleCardClick = () => {
    // Remove auto-read functionality
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView(submission);
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (submission.status === 'complete') {
      // Show confirmation dialog for marking as incomplete
      setShowStatusDialog(true);
    } else {
      // Mark as complete directly (no dialog needed)
      onStatusChange(submission.id, 'complete');
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(submission.id);
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleStatusConfirm = () => {
    onStatusChange(submission.id, 'incomplete');
    setShowStatusDialog(false);
  };

  const handleStatusCancel = () => {
    setShowStatusDialog(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceColor = (source: string) => {
    const colors = {
      'get_help': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'impact': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'elevate': 'bg-green-500/20 text-green-300 border-green-500/30',
      'data_science_alliance': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'send_a_message': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'contact': 'bg-green-500/20 text-green-300 border-green-500/30',
      'support': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'feedback': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'default': 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    };
    return colors[source as keyof typeof colors] || colors.default;
  };

  const formatSource = (source: string) => {
    // Handle specific cases with multiple underscores
    const sourceMap: { [key: string]: string } = {
      'get_help': 'Get Help',
      'impact': 'Impact',
      'elevate': 'Elevate',
      'data_science_alliance': 'Data Science Alliance',
      'send_a_message': 'Send A Message'
    };
    
    return sourceMap[source] || source.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div 
      className={`
        p-6 rounded-lg border transition-all duration-200 cursor-pointer hover:border-slate-600
        ${submission.status === 'complete'
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-slate-800 border-slate-600 shadow-lg'
        }
      `}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Date and Time */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-bold text-white">
              {submission.submittedAt.getDate()}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wide">
              {submission.submittedAt.toLocaleDateString('en-US', { month: 'short' })}
            </span>
          </div>
          
          <div className="text-sm text-slate-400">
            <div>{formatTime(submission.submittedAt)}</div>
          </div>
        </div>

        {/* Center - Contact Info and Message */}
        <div className="flex-1 mx-6">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">
              {submission.firstName} {submission.lastName}
            </h3>
            {submission.status === 'incomplete' && (
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{submission.email}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{submission.phone || '(not provided)'}</span>
              </div>
              
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium border
                ${getSourceColor(submission.source)}
              `}>
                {formatSource(submission.source)}
              </div>
            </div>
          </div>
          
          <p className="text-slate-300 line-clamp-2 text-sm">
            {submission.message}
          </p>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleStatusClick}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${submission.status === 'complete'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
              }
            `}
            title={submission.status === 'complete' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {submission.status === 'complete' ? (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Complete</span>
              </div>
            ) : (
              <span>Mark Complete</span>
            )}
          </button>
          
          <button
            onClick={handleViewClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            View
          </button>
          
          <button
            onClick={handleDeleteClick}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            title="Delete submission"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <SubmissionDeleteConfirmationDialog
        isVisible={showDeleteDialog}
        submission={submission}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      
      {/* Status Change Confirmation Dialog */}
      <StatusChangeConfirmationDialog
        isVisible={showStatusDialog}
        submission={submission}
        onConfirm={handleStatusConfirm}
        onCancel={handleStatusCancel}
      />
    </div>
  );
};

export default SubmissionCard;
