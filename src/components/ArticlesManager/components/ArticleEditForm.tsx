//
//  ArticleEditForm.tsx
//  ChiEAC
//
//  Form component for editing article fields with tag management
//  Created by Shivaang Kumar on 8/18/25.
//

import { useState } from 'react';
import type { Article } from '../../../types';

interface ArticleEditFormProps {
  article: Article;
  onSave: (editedArticle: Article) => void;
  onCancel: () => void;
}

export default function ArticleEditForm({
  article,
  onSave,
  onCancel
}: ArticleEditFormProps) {
  const [formData, setFormData] = useState<Article>({
    ...article,
    articleTags: [...article.articleTags]
  });
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: keyof Article, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRemoveTag = (tagIndex: number) => {
    setFormData(prev => ({
      ...prev,
      articleTags: prev.articleTags.filter((_, index) => index !== tagIndex)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.articleTags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        articleTags: [...prev.articleTags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* Article ID (Read-only) */}
      <div>
        <h4 className="text-slate-300 font-medium mb-2">Article ID</h4>
        <p className="text-slate-100 font-mono text-sm bg-slate-900/60 px-3 py-2 rounded border border-slate-600/50">
          {article.id}
        </p>
      </div>

      {/* Title */}
      <div>
        <h4 className="text-slate-300 font-medium mb-2">Title</h4>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full text-slate-100 bg-slate-900/60 px-3 py-2 rounded border border-slate-600/50 focus:border-orange-500/50 focus:outline-none transition-colors"
        />
      </div>

      {/* Published At (Read-only) */}
      <div>
        <h4 className="text-slate-300 font-medium mb-2">Published At</h4>
        <p className="text-slate-100 bg-slate-900/60 px-3 py-2 rounded border border-slate-600/50">
          {article.publishedAt ? 
            article.publishedAt.toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }) : 'Unknown Date'
          }
        </p>
      </div>

      {/* Image Link */}
      <div>
        <h4 className="text-slate-300 font-medium mb-2">Image Link</h4>
        <input
          type="url"
          value={formData.imageLink || ''}
          onChange={(e) => handleInputChange('imageLink', e.target.value)}
          className="w-full text-slate-100 bg-slate-900/60 px-3 py-2 rounded border border-slate-600/50 focus:border-orange-500/50 focus:outline-none transition-colors font-mono text-sm"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Medium Link */}
      <div>
        <h4 className="text-slate-300 font-medium mb-2">Medium Link</h4>
        <input
          type="url"
          value={formData.mediumLink || ''}
          onChange={(e) => handleInputChange('mediumLink', e.target.value)}
          className="w-full text-slate-100 bg-slate-900/60 px-3 py-2 rounded border border-slate-600/50 focus:border-orange-500/50 focus:outline-none transition-colors font-mono text-sm"
          placeholder="https://medium.com/article-link"
        />
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-slate-300 font-medium mb-3">Tags</h4>
        
        {/* Current Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.articleTags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-slate-700/60 text-slate-200 border border-slate-600/50"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveTag(index)}
                className="ml-1 hover:bg-red-500/20 rounded-full p-0.5 transition-colors"
              >
                <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add New Tag */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            className="flex-1 text-slate-100 bg-slate-900/60 px-3 py-2 rounded border border-slate-600/50 focus:border-orange-500/50 focus:outline-none transition-colors text-sm"
            placeholder="Enter new tag..."
          />
          <button
            onClick={handleAddTag}
            disabled={!newTag.trim() || formData.articleTags.includes(newTag.trim())}
            className="px-3 py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded transition-colors duration-200 text-sm font-medium"
          >
            Add
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-700/60">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-green-600/25"
        >
          Publish Changes
        </button>
      </div>
    </div>
  );
}
