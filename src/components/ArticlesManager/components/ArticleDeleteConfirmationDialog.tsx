//
//  ArticleDeleteConfirmationDialog.tsx
//  ChiEAC
//
//  Confirmation dialog for deleting articles
//  Created by Shivaang Kumar on 8/18/25.
//

import type { Article } from '../types';

interface ArticleDeleteConfirmationDialogProps {
  isOpen: boolean;
  article: Article;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ArticleDeleteConfirmationDialog({
  isOpen,
  article,
  onConfirm,
  onCancel,
  isLoading = false
}: ArticleDeleteConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700/60 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Delete Article
              </h3>
              <p className="text-sm text-slate-400">
                This action cannot be undone
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-slate-300 mb-3">
              Are you sure you want to delete this article?
            </p>
            <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-600/50">
              <p className="text-slate-200 font-medium text-sm truncate">
                {article.title}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                ID: {article.id}
              </p>
            </div>
            <p className="text-sm text-red-400 mt-3">
              This will permanently remove the article from the database. The article may be re-added automatically during the next Medium RSS sync if it is in the top ~10 recent articles on chieac.medium.com.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-200 font-medium rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-red-600/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                'Delete Article'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
