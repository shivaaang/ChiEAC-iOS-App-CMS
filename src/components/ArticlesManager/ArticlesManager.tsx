//
//  ArticlesManager.tsx
//  ChiEAC
//
//  Main ArticlesManager component with modular architecture
//  Created by Shivaang Kumar on 8/19/25.
//

import React from 'react';
import type { Article } from './types';
import { useArticlesManager } from './hooks/useArticlesManager';
import ArticleViewDialog from './components/ArticleViewDialog';
import FetchNowButton from './components/FetchNowButton';

const ArticlesManager: React.FC = () => {
  const {
    // State
    articles,
    loading,
    selectedArticle,
    showViewDialog,
    currentPage,
    
    // Computed values
    totalPages,
    startIndex,
    endIndex,
    currentArticles,
    articlesPerPage,
    
    // Actions
    fetchArticles,
    updateArticle,
    deleteArticle,
    handleArticleClick,
    handleCloseDialog,
    goToPage,
    goToPreviousPage,
    goToNextPage
  } = useArticlesManager();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <span className="text-slate-300 font-medium">Loading articles...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
              <h1 className="text-4xl font-bold mb-2">Articles Manager</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Manage and edit article content from Medium RSS feed
            </p>
          </div>
          
          {/* Fetch Now Button */}
          <div className="flex-shrink-0">
            <FetchNowButton 
              onRefreshNeeded={fetchArticles}
            />
          </div>
        </div>
      </div>

      {/* Articles List - Thin horizontal cards */}
      <div className="space-y-3">
        {currentArticles.map((article: Article) => {
          // Extract the short ID from the full article ID (after the last dot)
          const shortId = article.id.includes('.') ? article.id.split('.').pop() : article.id;
          
          return (
            <div
              key={article.id}
              onClick={() => handleArticleClick(article)}
              className="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-750 transition-all duration-200 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-100 mb-3 pr-8">
                    {article.title}
                  </h3>

                  {/* ID and Tags Row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* ID Capsule - Different color */}
                    <div className="px-2.5 py-1 text-xs rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 font-mono">
                      {shortId}
                    </div>

                    {/* Separator */}
                    <div className="w-px h-3 bg-slate-600"></div>

                    {/* Tags Capsules */}
                    <div className="flex flex-wrap gap-1.5">
                      {article.articleTags.map((tag: string, index: number) => (
                        <div
                          key={index}
                          className="px-2.5 py-1 text-xs rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/50"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side - Published date and arrow */}
                <div className="flex items-center justify-between ml-6 min-w-[120px]">
                  <div className="text-slate-400 text-sm">
                    {article.publishedAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  
                  {/* Clickable arrow */}
                  <div className="text-slate-500 hover:text-orange-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {articles.length > articlesPerPage && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/60">
          {/* Articles count info */}
          <div className="text-sm text-slate-400">
            Showing {startIndex + 1}-{Math.min(endIndex, articles.length)} of {articles.length} articles
          </div>

          {/* Pagination controls */}
          <div className="flex items-center space-x-2">
            {/* Previous button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600/50 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first page, last page, current page, and pages around current page
                const showPage = 
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  Math.abs(pageNum - currentPage) <= 1;

                if (!showPage) {
                  // Show ellipsis for gaps
                  if (pageNum === 2 && currentPage > 4) {
                    return (
                      <span key={pageNum} className="px-2 text-slate-500">
                        ...
                      </span>
                    );
                  }
                  if (pageNum === totalPages - 1 && currentPage < totalPages - 3) {
                    return (
                      <span key={pageNum} className="px-2 text-slate-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      currentPage === pageNum
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25'
                        : 'text-slate-300 bg-slate-800 border border-slate-600/50 hover:bg-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600/50 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {articles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">No articles found</h3>
          <p className="text-slate-500">Articles will appear here when they are fetched from the Medium RSS feed.</p>
        </div>
      )}

      {/* Article View Dialog */}
      {selectedArticle && (
        <ArticleViewDialog
          isOpen={showViewDialog}
          article={selectedArticle}
          onClose={handleCloseDialog}
          onUpdate={updateArticle}
          onDelete={deleteArticle}
        />
      )}
    </div>
  );
};

export default ArticlesManager;
