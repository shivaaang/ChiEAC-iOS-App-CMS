//
//  SubmissionsList.tsx
//  ChiEAC
//
//  List component for displaying form submissions
//  Created by Shivaang Kumar on 8/20/25.
//

import SubmissionCard from './SubmissionCard';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import type { FormSubmission } from '../types';

interface SubmissionsListProps {
  submissions: FormSubmission[];
  loading: boolean;
  error: string | null;
  onView: (submission: FormSubmission) => void;
  onStatusChange: (submissionId: string, newStatus: 'incomplete' | 'complete') => void;
  onDelete: (submissionId: string) => void;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({
  submissions,
  loading,
  error,
  onView,
  onStatusChange,
  onDelete
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-300 mb-2">Error Loading Submissions</h3>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          onView={onView}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SubmissionsList;
