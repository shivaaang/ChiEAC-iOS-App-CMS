//
//  useArticlesManager.ts
//  ChiEAC
//
//  Custom hook for managing articles data and operations
//  Created by Shivaang Kumar on 8/19/25.
//

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { Article } from '../types';

export const useArticlesManager = () => {
  // Core state
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Constants
  const articlesPerPage = 10;

  // Pagination calculations
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  // Fetch articles from Firebase
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const articlesCollection = collection(db, 'articles');
      const articlesSnapshot = await getDocs(articlesCollection);
      
      const articlesData = articlesSnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Handle Firestore timestamp properly - check both field names
        let publishedDate: Date;
        
        const publishedAtField = data.publishedAt || data.published_at;
        
        if (publishedAtField) {
          if (typeof publishedAtField === 'object' && publishedAtField.toDate) {
            // Firestore Timestamp object
            publishedDate = publishedAtField.toDate();
          } else if (typeof publishedAtField === 'object' && publishedAtField.seconds) {
            // Firestore timestamp with seconds/nanoseconds
            publishedDate = new Date(publishedAtField.seconds * 1000);
          } else if (typeof publishedAtField === 'string') {
            // String date (fallback)
            publishedDate = new Date(publishedAtField);
            if (isNaN(publishedDate.getTime())) {
              console.warn('Invalid date string for article:', doc.id, publishedAtField);
              publishedDate = new Date(); // Fallback to current date
            }
          } else {
            console.warn('Unknown publishedAt format for article:', doc.id, publishedAtField);
            publishedDate = new Date();
          }
        } else {
          console.warn('No publishedAt or published_at field for article:', doc.id);
          publishedDate = new Date();
        }
        
        return {
          id: doc.id,
          title: data.title || '',
          publishedAt: publishedDate,
          imageLink: data.imageLink || data.image_link || '',
          mediumLink: data.mediumLink || data.medium_link || '',
          articleTags: data.articleTags || data.article_tags || []
        } as Article;
      });

      // Sort by published date (newest first)
      articlesData.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update article in Firebase
  const updateArticle = async (updatedArticle: Article) => {
    try {
      const articleRef = doc(db, 'articles', updatedArticle.id);
      await updateDoc(articleRef, {
        title: updatedArticle.title,
        image_link: updatedArticle.imageLink,
        medium_link: updatedArticle.mediumLink,
        article_tags: updatedArticle.articleTags
      });

      // Update local state
      setArticles(prev => 
        prev.map(article => 
          article.id === updatedArticle.id ? updatedArticle : article
        )
      );

      // Update selectedArticle if it's the one being updated
      setSelectedArticle(prev => 
        prev && prev.id === updatedArticle.id ? updatedArticle : prev
      );

      return true;
    } catch (error) {
      console.error('Error updating article:', error);
      return false;
    }
  };

  // Delete article from Firebase
  const deleteArticle = async (articleId: string) => {
    try {
      await deleteDoc(doc(db, 'articles', articleId));
      
      // Update local state
      const updatedArticles = articles.filter(article => article.id !== articleId);
      setArticles(updatedArticles);
      
      // Handle pagination edge case: if current page becomes empty after deletion
      const newTotalPages = Math.ceil(updatedArticles.length / articlesPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  };

  // Handle article selection
  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setShowViewDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setShowViewDialog(false);
    setSelectedArticle(null);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Effects
  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    // State
    articles,
    loading,
    selectedArticle,
    showViewDialog,
    currentPage,
    articlesPerPage,
    totalPages,
    startIndex,
    endIndex,
    currentArticles,
    
    // Setters
    setArticles,
    setLoading,
    setSelectedArticle,
    setShowViewDialog,
    setCurrentPage,
    
    // Functions
    fetchArticles,
    updateArticle,
    deleteArticle,
    handleArticleClick,
    handleCloseDialog,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  };
};
