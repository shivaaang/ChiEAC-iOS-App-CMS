// Main ArticlesManager module exports
export { default } from './ArticlesManager';
export { default as ArticlesManager } from './ArticlesManager';

// Re-export types for external use
export type { Article, ArticleFormData, UseArticlesManagerReturn } from './types';

// Re-export hooks for external use if needed
export { useArticlesManager } from './hooks';

// Re-export components for external use if needed
export * from './components';
