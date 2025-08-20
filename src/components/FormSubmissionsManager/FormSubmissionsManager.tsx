//
//  FormSubmissionsManager.tsx
//  ChiEAC
//
//  Main modular Form Submissions Manager component
//  Created by Shivaang Kumar on 8/20/25.
//

import { useState, useMemo } from 'react';
import { useFormSubmissions } from './hooks';
import { SubmissionsList, SubmissionDetails, FilterAndSortControls } from './components';
import type { FormSubmission } from './types';

type StatusFilter = 'all' | 'incomplete' | 'complete';
type SortOrder = 'latest' | 'oldest';

const FormSubmissionsManager: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    submissions,
    loading,
    error,
    fetchSubmissions,
    updateStatus,
    deleteSubmission
  } = useFormSubmissions();

  const handleViewSubmission = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedSubmission(null);
  };

  const handleStatusChange = async (submissionId: string, newStatus: 'incomplete' | 'complete') => {
    try {
      await updateStatus(submissionId, newStatus);
    } catch (error) {
      console.error('Failed to update submission status:', error);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      await deleteSubmission(submissionId);
    } catch (error) {
      console.error('Failed to delete submission:', error);
    }
  };

  // Filter and sort submissions
  const filteredAndSortedSubmissions = useMemo(() => {
    let filtered = submissions;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      // Normalize query by removing all non-alphanumeric characters for phone search
      const normalizedQuery = query.replace(/[^a-z0-9]/g, '');
      
      filtered = submissions.filter(sub => {
        // Search in name
        const fullName = `${sub.firstName} ${sub.lastName}`.toLowerCase();
        if (fullName.includes(query)) return true;
        
        // Search in email
        if (sub.email.toLowerCase().includes(query)) return true;
        
        // Search in message
        if (sub.message.toLowerCase().includes(query)) return true;
        
        // Search in phone (normalized - remove all formatting)
        const normalizedPhone = sub.phone.replace(/[^0-9]/g, '');
        if (normalizedPhone.includes(normalizedQuery)) return true;
        
        return false;
      });
    }

    // Apply status filter
    if (statusFilter === 'incomplete') {
      filtered = filtered.filter(sub => sub.status === 'incomplete');
    } else if (statusFilter === 'complete') {
      filtered = filtered.filter(sub => sub.status === 'complete');
    }

    // Apply sort order
    const sorted = [...filtered].sort((a, b) => {
      const dateA = a.submittedAt.getTime();
      const dateB = b.submittedAt.getTime();
      
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [submissions, statusFilter, sortOrder, searchQuery]);

  const handleRefresh = async () => {
    await fetchSubmissions();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              <h1 className="text-4xl font-bold mb-2">Form Submissions</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Messages from iOS app users
            </p>
            {submissions.filter(s => s.status === 'incomplete').length > 0 && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300">
                  {submissions.filter(s => s.status === 'incomplete').length} incomplete submission{submissions.filter(s => s.status === 'incomplete').length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          
          {/* Refresh Button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`
                inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${loading 
                  ? 'bg-slate-600/50 text-slate-300 cursor-not-allowed' 
                  : 'bg-slate-600 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl'
                }
              `}
              title="Refresh submissions"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-300/30 border-t-slate-300 rounded-full animate-spin mr-2"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <FilterAndSortControls
        statusFilter={statusFilter}
        sortOrder={sortOrder}
        searchQuery={searchQuery}
        onStatusFilterChange={setStatusFilter}
        onSortOrderChange={setSortOrder}
        onSearchChange={setSearchQuery}
      />

      {/* Submissions List */}
      <SubmissionsList
        submissions={filteredAndSortedSubmissions}
        loading={loading}
        error={error}
        onView={handleViewSubmission}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteSubmission}
      />

      {/* Submission Details Modal */}
      {showDetails && selectedSubmission && (
        <SubmissionDetails
          submission={selectedSubmission}
          onClose={handleCloseDetails}
          onDelete={handleDeleteSubmission}
        />
      )}
    </div>
  );
};

export default FormSubmissionsManager;
