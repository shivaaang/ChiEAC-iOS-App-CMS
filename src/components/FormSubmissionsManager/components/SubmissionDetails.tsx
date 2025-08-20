//
//  SubmissionDetails.tsx
//  ChiEAC
//
//  Modal component for viewing full submission details
//  Created by Shivaang Kumar on 8/20/25.
//

import type { SubmissionDetailsProps } from '../types';

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
  submission,
  onClose,
  onDelete
}) => {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this form submission?')) {
      onDelete(submission.id);
      onClose();
    }
  };

  const getSourceColor = (source: string) => {
    const colors = {
      'get_help': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'contact': 'bg-green-500/20 text-green-300 border-green-500/30',
      'support': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'feedback': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'default': 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    };
    return colors[source as keyof typeof colors] || colors.default;
  };

  const formatSource = (source: string) => {
    return source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                {submission.firstName} {submission.lastName}
              </h2>
              <div className="flex items-center space-x-4 text-slate-400 text-sm">
                <span>{submission.email}</span>
                <span>{submission.phone}</span>
              </div>
              <div className="mt-2">
                <span className={`
                  inline-block px-3 py-1 rounded-full text-xs font-medium border
                  ${getSourceColor(submission.source)}
                `}>
                  {formatSource(submission.source)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-100 whitespace-pre-wrap">{submission.message}</p>
            </div>
          </div>
          
          <div className="text-sm text-slate-500 mb-6">
            Submitted on {submission.submittedAt.toLocaleDateString()} at {submission.submittedAt.toLocaleTimeString()}
            {submission.readAt && (
              <span className="block mt-1">
                Read on {submission.readAt.toLocaleDateString()} at {submission.readAt.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;
