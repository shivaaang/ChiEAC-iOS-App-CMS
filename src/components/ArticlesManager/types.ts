//
//  types.ts
//  ChiEAC
//
//  TypeScript type definitions for ArticlesManager components
//  Created by Shivaang Kumar on 8/19/25.
//

export interface Article {
  id: string;
  title: string;
  publishedAt: Date;
  imageLink?: string;
  mediumLink?: string;
  articleTags: string[];
}

// Firebase-specific types for ArticlesManager
export type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

// Dialog and form types for ArticlesManager
export interface ArticleFormData {
  title: string;
  imageLink: string;
  mediumLink: string;
  articleTags: string[];
}

// Hook return type for better type safety
export interface UseArticlesManagerReturn {
  // State
  articles: Article[];
  loading: boolean;
  selectedArticle: Article | null;
  showViewDialog: boolean;
  currentPage: number;
  articlesPerPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  currentArticles: Article[];
  
  // Setters
  setArticles: (articles: Article[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedArticle: (article: Article | null) => void;
  setShowViewDialog: (show: boolean) => void;
  setCurrentPage: (page: number) => void;
  
  // Functions
  fetchArticles: () => Promise<void>;
  updateArticle: (article: Article) => Promise<boolean>;
  deleteArticle: (articleId: string) => Promise<boolean>;
  handleArticleClick: (article: Article) => void;
  handleCloseDialog: () => void;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}
