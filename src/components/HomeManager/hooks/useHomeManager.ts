//
//  useHomeManager.ts
//  ChiEAC
//
//  Main hook for HomeManager state and data management
//  Created by Shivaang Kumar on 8/24/25.
//

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { CoreWorkItem, ImpactItem, HomeSection, CoreWorkFormData, ImpactFormData } from '../types';

// Helper function to create meaningful document IDs from titles
const createDocumentId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 50); // Limit length
};

export const useHomeManager = () => {
  const [coreWorkItems, setCoreWorkItems] = useState<CoreWorkItem[]>([]);
  const [impactItems, setImpactItems] = useState<ImpactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<HomeSection>('coreWork');
  const [isCoreWorkReorderingMode, setIsCoreWorkReorderingMode] = useState(false);
  const [isImpactReorderingMode, setIsImpactReorderingMode] = useState(false);
  const [showCoreWorkForm, setShowCoreWorkForm] = useState(false);
  const [showImpactForm, setShowImpactForm] = useState(false);
  const [editingCoreWork, setEditingCoreWork] = useState<CoreWorkItem | null>(null);
  const [editingImpact, setEditingImpact] = useState<ImpactItem | null>(null);

  // Fetch core work items
  const fetchCoreWorkItems = async () => {
    try {
      console.log('🔍 Fetching core work items from Firestore...');
      const q = query(collection(db, 'core_work'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      console.log('📊 Core work query result:', querySnapshot.size, 'documents found');
      
      const items: CoreWorkItem[] = [];
      querySnapshot.forEach((doc) => {
        console.log('📄 Core work document found:', doc.id, doc.data());
        items.push({ id: doc.id, ...doc.data() } as CoreWorkItem);
      });
      
      console.log('✅ Core work items loaded:', items);
      setCoreWorkItems(items);
    } catch (error) {
      console.error('❌ Error fetching core work items:', error);
    }
  };

  // Fetch impact stats
  const fetchImpactItems = async () => {
    try {
      console.log('🔍 Fetching impact stats from Firestore...');
      const q = query(collection(db, 'impact_stats'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      console.log('📊 Impact stats query result:', querySnapshot.size, 'documents found');
      
      const items: ImpactItem[] = [];
      querySnapshot.forEach((doc) => {
        console.log('📄 Impact document found:', doc.id, doc.data());
        items.push({ id: doc.id, ...doc.data() } as ImpactItem);
      });
      
      console.log('✅ Impact items loaded:', items);
      setImpactItems(items);
    } catch (error) {
      console.error('❌ Error fetching impact items:', error);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCoreWorkItems(), fetchImpactItems()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Core Work CRUD operations
  const createCoreWorkItem = async (formData: CoreWorkFormData) => {
    try {
      const newOrder = coreWorkItems.length + 1;
      const documentId = `core_work.${createDocumentId(formData.title)}`;
      
      const itemData = {
        id: documentId,
        ...formData,
        order: newOrder,
      };
      
      await setDoc(doc(db, 'core_work', documentId), itemData);
      
      const newItem: CoreWorkItem = itemData;
      
      setCoreWorkItems([...coreWorkItems, newItem]);
      console.log('✅ Core work item created:', newItem);
    } catch (error) {
      console.error('❌ Error creating core work item:', error);
      throw error;
    }
  };

  const updateCoreWorkItem = async (id: string, formData: CoreWorkFormData) => {
    try {
      const updateData = { ...formData, id }; // Ensure id field is preserved
      await updateDoc(doc(db, 'core_work', id), updateData);
      
      setCoreWorkItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updateData } : item
      ));
      console.log('✅ Core work item updated:', id);
    } catch (error) {
      console.error('❌ Error updating core work item:', error);
      throw error;
    }
  };

  const deleteCoreWorkItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'core_work', id));
      setCoreWorkItems(prev => prev.filter(item => item.id !== id));
      console.log('✅ Core work item deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting core work item:', error);
      throw error;
    }
  };

  // Impact CRUD operations
  const createImpactItem = async (formData: ImpactFormData) => {
    try {
      const newOrder = impactItems.length + 1;
      const documentId = `impact.${createDocumentId(formData.label)}`;
      
      const itemData = {
        id: documentId,
        ...formData,
        order: newOrder,
      };
      
      await setDoc(doc(db, 'impact_stats', documentId), itemData);
      
      const newItem: ImpactItem = itemData;
      
      setImpactItems([...impactItems, newItem]);
      console.log('✅ Impact item created:', newItem);
    } catch (error) {
      console.error('❌ Error creating impact item:', error);
      throw error;
    }
  };

  const updateImpactItem = async (id: string, formData: ImpactFormData) => {
    try {
      const updateData = { ...formData, id }; // Ensure id field is preserved
      await updateDoc(doc(db, 'impact_stats', id), updateData);
      
      setImpactItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updateData } : item
      ));
      console.log('✅ Impact item updated:', id);
    } catch (error) {
      console.error('❌ Error updating impact item:', error);
      throw error;
    }
  };

  const deleteImpactItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'impact_stats', id));
      setImpactItems(prev => prev.filter(item => item.id !== id));
      console.log('✅ Impact item deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting impact item:', error);
      throw error;
    }
  };

  // Reordering operations
  const updateCoreWorkOrder = async (items: CoreWorkItem[]) => {
    try {
      const updates = items.map((item, index) => 
        updateDoc(doc(db, 'core_work', item.id), { order: index + 1 })
      );
      await Promise.all(updates);
      console.log('✅ Core work order updated');
    } catch (error) {
      console.error('❌ Error updating core work order:', error);
      throw error;
    }
  };

  const updateImpactOrder = async (items: ImpactItem[]) => {
    try {
      const updates = items.map((item, index) => 
        updateDoc(doc(db, 'impact_stats', item.id), { order: index + 1 })
      );
      await Promise.all(updates);
      console.log('✅ Impact order updated');
    } catch (error) {
      console.error('❌ Error updating impact order:', error);
      throw error;
    }
  };

  return {
    // State
    coreWorkItems,
    impactItems,
    loading,
    activeSection,
    isCoreWorkReorderingMode,
    isImpactReorderingMode,
    showCoreWorkForm,
    showImpactForm,
    editingCoreWork,
    editingImpact,

    // State setters
    setCoreWorkItems,
    setImpactItems,
    setActiveSection,
    setIsCoreWorkReorderingMode,
    setIsImpactReorderingMode,
    setShowCoreWorkForm,
    setShowImpactForm,
    setEditingCoreWork,
    setEditingImpact,

    // CRUD operations
    createCoreWorkItem,
    updateCoreWorkItem,
    deleteCoreWorkItem,
    createImpactItem,
    updateImpactItem,
    deleteImpactItem,

    // Reordering
    updateCoreWorkOrder,
    updateImpactOrder,

    // Refresh data
    fetchCoreWorkItems,
    fetchImpactItems,
  };
};
