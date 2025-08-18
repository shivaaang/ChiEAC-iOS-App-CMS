//
//  CoreWorkManager.tsx
//  ChiEAC
//
//  Core work management with CRUD operations and reordering
//  Created by Shivaang Kumar on 8/16/25.
//

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { db } from '../config/firebase';
import type { CoreWork } from '../types';

export default function CoreWorkManager() {
  const [coreWorkItems, setCoreWorkItems] = useState<CoreWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CoreWork | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });

  const fetchCoreWork = async () => {
    try {
      console.log('🔍 Fetching core work from Firestore...');
      const querySnapshot = await getDocs(collection(db, 'core_work'));
      console.log('📊 Core work query result:', querySnapshot.size, 'documents found');
      
      const items: CoreWork[] = [];
      querySnapshot.forEach((doc) => {
        console.log('📄 Document found:', doc.id, doc.data());
        items.push({ id: doc.id, ...doc.data() } as CoreWork);
      });
      
      // Sort by order
      items.sort((a, b) => a.order - b.order);
      console.log('✅ Core work items loaded:', items);
      setCoreWorkItems(items);
    } catch (error) {
      console.error('❌ Error fetching core work:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoreWork();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, 'core_work', editingItem.id), {
          title: formData.title,
          description: formData.description,
          icon: formData.icon,
        });
      } else {
        // Add new item
        const newOrder = coreWorkItems.length > 0 ? Math.max(...coreWorkItems.map(item => item.order)) + 1 : 0;
        await addDoc(collection(db, 'core_work'), {
          ...formData,
          order: newOrder,
          id: `coreWork_${Date.now()}`, // Auto-generated ID
        });
      }
      
      // Reset form and refresh data
      setFormData({ title: '', description: '', icon: '' });
      setShowForm(false);
      setEditingItem(null);
      fetchCoreWork();
    } catch (error) {
      console.error('Error saving core work item:', error);
    }
  };

  const handleEdit = (item: CoreWork) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'core_work', id));
        fetchCoreWork();
      } catch (error) {
        console.error('Error deleting core work item:', error);
      }
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(coreWorkItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setCoreWorkItems(updatedItems);

    // Update in Firestore
    try {
      await Promise.all(
        updatedItems.map((item) =>
          updateDoc(doc(db, 'core_work', item.id), { order: item.order })
        )
      );
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chieac-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Core Work Management
            </h1>
            <p className="text-slate-300 text-lg">
              Define and organize the fundamental mission areas displayed on your homepage
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-violet-500/20 border border-violet-500/30 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
              <span className="text-violet-300 text-sm font-medium">{coreWorkItems.length} Items</span>
            </div>
            <div className="text-sm text-slate-400">Drag to reorder</div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="group flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-semibold">Add New Item</span>
        </button>
      </div>

      {/* Enhanced Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-700/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editingItem ? 'Edit Core Work Item' : 'Add New Core Work Item'}
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  {editingItem ? 'Update the details below' : 'Fill in the details for your new core work item'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setFormData({ title: '', description: '', icon: '' });
                }}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chieac-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chieac-primary focus:border-transparent transition-all resize-none"
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Icon (SF Symbol) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chieac-primary focus:border-transparent transition-all"
                    placeholder="e.g., heart.fill, star, lightbulb.fill"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <span className="text-xs">SF Symbol</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Use SF Symbol names for iOS compatibility
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-chieac-primary to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-chieac-primary/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {editingItem ? 'Update Item' : 'Create Item'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    setFormData({ title: '', description: '', icon: '' });
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Core Work Items */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="coreWork">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {coreWorkItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="group relative bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700/60 p-6 hover:shadow-xl hover:shadow-violet-500/10 hover:border-slate-600/60 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-xl text-white text-lg shadow-lg mr-4">
                              {item.icon === 'heart.fill' ? '❤️' : 
                               item.icon === 'star.fill' ? '⭐' : 
                               item.icon === 'lightbulb.fill' ? '💡' : 
                               item.icon === 'hands.sparkles.fill' ? '✨' : '🎯'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-violet-500/20 text-violet-300 text-xs font-semibold rounded-full mr-3">
                                  {item.order + 1}
                                </span>
                                <h3 className="text-xl font-bold text-white group-hover:text-violet-200">
                                  {item.title}
                                </h3>
                              </div>
                              <span className="text-xs text-slate-400 font-mono bg-slate-700/60 px-2 py-1 rounded-md mt-1 inline-block">
                                {item.icon}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-300 leading-relaxed text-sm">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="group/btn flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-md text-sm font-medium"
                          >
                            <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="group/btn flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-md text-sm font-medium"
                          >
                            <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {coreWorkItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-chieac-secondary-text text-lg">
            No core work items yet. Add your first item to get started!
          </p>
        </div>
      )}
    </div>
  );
}
