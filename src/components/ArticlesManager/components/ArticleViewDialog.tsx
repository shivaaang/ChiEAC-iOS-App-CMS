//
//  ArticleViewDialog.tsx
//  ChiEAC
//
//  Side panel dialog for viewing and editing articles with 16:9 images
//  Created by Shivaang Kumar on 8/18/25.
//

import { useState } from 'react';
import type { Article } from '../types';
import ArticleEditWarningDialog from './ArticleEditWarningDialog';
import ArticleEditForm from './ArticleEditForm';
import ArticlePublishConfirmationDialog from './ArticlePublishConfirmationDialog';
import ArticleDeleteConfirmationDialog from './ArticleDeleteConfirmationDialog';

interface ArticleViewDialogProps {
  isOpen: boolean;
  article: Article;
  onClose: () => void;
  onUpdate: (article: Article) => Promise<boolean>;
  onDelete: (articleId: string) => Promise<boolean>;
}

export default function ArticleViewDialog({
  isOpen,
  article,
  onClose,
  onUpdate,
  onDelete
}: ArticleViewDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editedArticle, setEditedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle edit button click
  const handleEditClick = () => {
    setShowEditWarning(true);
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  // Handle edit warning confirmation
  const handleEditWarningConfirm = () => {
    setShowEditWarning(false);
    setIsEditing(true);
  };

  // Handle edit form save
  const handleEditSave = (updatedArticle: Article) => {
    setEditedArticle(updatedArticle);
    setShowPublishConfirmation(true);
  };

  // Handle edit form cancel
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedArticle(null);
  };

  // Handle publish confirmation
  const handlePublishConfirm = async () => {
    if (!editedArticle) return;

    setIsLoading(true);
    const success = await onUpdate(editedArticle);
    
    if (success) {
      setShowPublishConfirmation(false);
      setIsEditing(false);
      setEditedArticle(null);
    }
    setIsLoading(false);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    const success = await onDelete(article.id);
    
    if (success) {
      setShowDeleteConfirmation(false);
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Main Dialog */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-end z-40">
        <div className="bg-slate-800 border-l border-slate-700/60 w-[30%] h-full overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-100">
                {isEditing ? 'Edit Article' : 'Article Details'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isEditing ? (
              /* Edit Mode */
              <ArticleEditForm
                article={article}
                onSave={handleEditSave}
                onCancel={handleEditCancel}
              />
            ) : (
              /* View Mode */
              <div className="space-y-6">
                {/* Article Image with 16:9 aspect ratio */}
                {article.imageLink && (
                  <div className="aspect-[16/9] overflow-hidden rounded-lg">
                    <img
                      src={article.imageLink}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Title below image */}
                <div>
                  <h3 className="text-xl font-bold text-slate-100">
                    {article.title}
                  </h3>
                </div>

                {/* Article Info */}
                <div className="space-y-4">
                  {/* Article ID */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Article ID</label>
                    <div className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-200 font-mono text-sm">
                      {article.id}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Title</label>
                    <div className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-200 font-mono text-sm">
                      {article.title}
                    </div>
                  </div>

                  {/* Published At */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Published At</label>
                    <div className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-200 font-mono text-sm">
                      {article.publishedAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZoneName: 'short'
                      })}
                    </div>
                  </div>

                  {/* Image Link */}
                  {article.imageLink && (
                    <div>
                      <label className="block text-slate-400 text-sm font-medium mb-2">Image Link</label>
                      <div className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg">
                        <a
                          href={article.imageLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 underline break-all font-mono text-sm"
                        >
                          {article.imageLink}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Medium Link */}
                  {article.mediumLink && (
                    <div>
                      <label className="block text-slate-400 text-sm font-medium mb-2">Medium Link</label>
                      <div className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg">
                        <a
                          href={article.mediumLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 underline break-all font-mono text-sm"
                        >
                          {article.mediumLink}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {article.articleTags.length > 0 && (
                  <div>
                    <h4 className="text-slate-300 font-medium mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {article.articleTags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm rounded-full bg-slate-700/60 text-slate-200 border border-slate-600/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-700/60">
                  <button
                    onClick={handleEditClick}
                    className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-orange-600/25"
                  >
                    Edit Article
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-red-600/25"
                  >
                    Delete Article
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Warning Dialog */}
      <ArticleEditWarningDialog
        isOpen={showEditWarning}
        onConfirm={handleEditWarningConfirm}
        onCancel={() => setShowEditWarning(false)}
      />

      {/* Publish Confirmation Dialog */}
      {editedArticle && (
        <ArticlePublishConfirmationDialog
          isOpen={showPublishConfirmation}
          originalArticle={article}
          editedArticle={editedArticle}
          onConfirm={handlePublishConfirm}
          onCancel={() => setShowPublishConfirmation(false)}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ArticleDeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        article={article}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirmation(false)}
        isLoading={isLoading}
      />
    </>
  );
}
