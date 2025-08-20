//
//  useFormSubmissions.ts
//  ChiEAC
//
//  Hook for managing form submissions data and operations
//  Created by Shivaang Kumar on 8/20/25.
//

import { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { 
  collection, 
  getDocs, 
  orderBy, 
  query,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import type { FormSubmission } from '../types';

export const useFormSubmissions = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch form submissions from Firestore
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(
        collection(db, 'contact_form_submissions'), 
        orderBy('submittedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      
        const submissionsData: FormSubmission[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          message: data.message || '',
          source: data.source || 'unknown',
          submittedAt: data.submittedAt?.toDate() || new Date(),
          status: data.status || 'incomplete'
        };
      });      setSubmissions(submissionsData);
    } catch (err) {
      console.error('Error fetching form submissions:', err);
      setError('Failed to fetch form submissions');
    } finally {
      setLoading(false);
    }
  };

  // Update submission status
  const updateStatus = async (submissionId: string, newStatus: 'incomplete' | 'complete') => {
    try {
      await updateDoc(doc(db, 'contact_form_submissions', submissionId), {
        status: newStatus
      });
      
      setSubmissions(prev => prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: newStatus } 
          : sub
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      throw new Error('Failed to update status');
    }
  };

  // Delete submission
  const deleteSubmission = async (submissionId: string) => {
    try {
      await deleteDoc(doc(db, 'contact_form_submissions', submissionId));
      setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
    } catch (err) {
      console.error('Error deleting submission:', err);
      throw new Error('Failed to delete submission');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const incompleteCount = submissions.filter(sub => sub.status === 'incomplete').length;

  return {
    submissions,
    loading,
    error,
    incompleteCount,
    fetchSubmissions,
    updateStatus,
    deleteSubmission
  };
};
