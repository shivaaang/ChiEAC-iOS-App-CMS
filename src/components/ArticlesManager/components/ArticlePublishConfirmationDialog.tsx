//
//  ArticlePublishConfirmationDialog.tsx
//  ChiEAC
//
//  Confirmation dialog for publishing articles
//  Created by Shivaang Kumar on 8/18/25.
//

import type { Article } from '../types';

interface ArticlePublishConfirmationDialogProps {
  isOpen: boolean;
  originalArticle: Article;
  editedArticle: Article;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ArticlePublishConfirmationDialog({
  isOpen,
  originalArticle,
  editedArticle,
  onConfirm,
  onCancel,
  isLoading = false
}: ArticlePublishConfirmationDialogProps) {
  if (!isOpen) return null;

  // Detect changes and create detailed change objects
  const getDetailedChanges = () => {
    const changes: Array<{
      field: string;
      before: string | string[];
      after: string | string[];
    }> = [];
    
    if (originalArticle.title !== editedArticle.title) {
      changes.push({
        field: 'Title',
        before: originalArticle.title,
        after: editedArticle.title
      });
    }
    
    if (originalArticle.imageLink !== editedArticle.imageLink) {
      changes.push({
        field: 'Image Link',
        before: originalArticle.imageLink || '(not set)',
        after: editedArticle.imageLink || '(not set)'
      });
    }
    
    if (originalArticle.mediumLink !== editedArticle.mediumLink) {
      changes.push({
        field: 'Medium Link',
        before: originalArticle.mediumLink || '(not set)',
        after: editedArticle.mediumLink || '(not set)'
      });
    }
    
    if (JSON.stringify(originalArticle.articleTags.sort()) !== JSON.stringify(editedArticle.articleTags.sort())) {
      changes.push({
        field: 'Tags',
        before: originalArticle.articleTags.length > 0 ? originalArticle.articleTags : ['(no tags)'],
        after: editedArticle.articleTags.length > 0 ? editedArticle.articleTags : ['(no tags)']
      });
    }
    
    return changes;
  };

  const detailedChanges = getDetailedChanges();
  const hasChanges = detailedChanges.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-slate-800 border border-slate-700/60 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Publish Changes
              </h3>
              <p className="text-sm text-slate-400">
                Confirm your article updates
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            {hasChanges ? (
              <div>
                <p className="text-slate-300 mb-4">
                  You have made changes to the following fields:
                </p>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 space-y-4">
                  {detailedChanges.map((change, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-orange-300 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {change.field}
                      </h4>
                      
                      {change.field === 'Tags' ? (
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-400">Before:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Array.isArray(change.before) ? change.before.map((tag, tagIndex) => (
                                <span key={tagIndex} className="px-2 py-1 text-xs rounded-full bg-slate-600/60 text-slate-300 border border-slate-500/50">
                                  {tag}
                                </span>
                              )) : (
                                <span className="text-slate-300">{change.before}</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400">After:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Array.isArray(change.after) ? change.after.map((tag, tagIndex) => (
                                <span key={tagIndex} className="px-2 py-1 text-xs rounded-full bg-slate-600/60 text-slate-300 border border-slate-500/50">
                                  {tag}
                                </span>
                              )) : (
                                <span className="text-slate-300">{change.after}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-slate-400">Before:</span>
                            <span className="text-slate-300 ml-2 font-mono break-all">{change.before}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">After:</span>
                            <span className="text-slate-300 ml-2 font-mono break-all">{change.after}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-slate-400 mt-3">
                  These changes will be saved to the database immediately.
                </p>
              </div>
            ) : (
              <p className="text-slate-400">
                No changes detected. The article will remain unchanged.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-200 font-medium rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!hasChanges || isLoading}
              className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-green-600/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                hasChanges ? 'Publish Changes' : 'No Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
