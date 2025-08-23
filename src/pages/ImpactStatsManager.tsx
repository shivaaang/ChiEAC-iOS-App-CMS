//
//  ImpactStatsManager.tsx
//  ChiEAC
//
//  Impact statistics management with CRUD operations and reordering
//  Created by Shivaang Kumar on 8/16/25.
//

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { db } from '../config/firebase';
import type { ImpactStat } from '../types';

export default function ImpactStatsManager() {
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ImpactStat | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    label: '',
    subtitle: '',
    icon: '',
  });

  const fetchImpactStats = async () => {
    try {
      console.log('🔍 Fetching impact stats from Firestore...');
      const querySnapshot = await getDocs(collection(db, 'impact_stats'));
      console.log('📊 Impact stats query result:', querySnapshot.size, 'documents found');
      
      const items: ImpactStat[] = [];
      querySnapshot.forEach((doc) => {
        console.log('📄 Document found:', doc.id, doc.data());
        items.push({ id: doc.id, ...doc.data() } as ImpactStat);
      });
      
      items.sort((a, b) => a.order - b.order);
      console.log('✅ Impact stats loaded:', items);
      setImpactStats(items);
    } catch (error) {
      console.error('❌ Error fetching impact stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpactStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'impact_stats', editingItem.id), {
          ...formData,
          icon: formData.icon || '📊',
        });
        console.log('✅ Impact stat updated successfully');
      } else {
        const newOrder = impactStats.length;
        await addDoc(collection(db, 'impact_stats'), {
          ...formData,
          icon: formData.icon || '📊',
          order: newOrder,
        });
        console.log('✅ Impact stat added successfully');
      }
      
      setFormData({ number: '', label: '', subtitle: '', icon: '' });
      setShowForm(false);
      setEditingItem(null);
      await fetchImpactStats();
    } catch (error) {
      console.error('❌ Error saving impact stat:', error);
    }
  };

  const handleEdit = (item: ImpactStat) => {
    setEditingItem(item);
    setFormData({
      number: item.number,
      label: item.label,
      subtitle: item.subtitle,
      icon: item.icon,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this impact statistic?')) {
      try {
        await deleteDoc(doc(db, 'impact_stats', id));
        console.log('✅ Impact stat deleted successfully');
        await fetchImpactStats();
      } catch (error) {
        console.error('❌ Error deleting impact stat:', error);
      }
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(impactStats);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setImpactStats(updatedItems);

    try {
      const updatePromises = updatedItems.map((item) =>
        updateDoc(doc(db, 'impact_stats', item.id), { order: item.order })
      );
      await Promise.all(updatePromises);
      console.log('✅ Impact stats order updated successfully');
    } catch (error) {
      console.error('❌ Error updating impact stats order:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-slate-300 font-medium">Loading impact statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">Impact Statistics</h1>
          <p className="text-slate-300 text-base sm:text-lg">Track and manage key performance metrics and achievements</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-sm font-medium">{impactStats.length} Statistics</span>
            </div>
            <div className="text-sm text-slate-400">Drag to reorder</div>
          </div>
          
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({ number: '', label: '', subtitle: '', icon: '' });
              setShowForm(true);
            }}
            className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Statistic</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-700/60">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editingItem ? 'Edit Impact Statistic' : 'Add New Impact Statistic'}
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  {editingItem ? 'Update the statistic details' : 'Add a new metric to track performance'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setFormData({ number: '', label: '', subtitle: '', icon: '' });
                }}
                className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Number/Value</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="e.g., 150+, 95%, $50K"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="e.g., Students Served, Success Rate"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none"
                  placeholder="Brief description of what this statistic represents"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Icon (Optional)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="📊"
                />
                <p className="text-xs text-slate-400 mt-2">Add an emoji (defaults to 📊)</p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {editingItem ? 'Update Statistic' : 'Add Statistic'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    setFormData({ number: '', label: '', subtitle: '', icon: '' });
                  }}
                  className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="impact-stats">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {impactStats.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="group relative bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700/60 p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:border-slate-600/60 transition-all duration-300 hover:-translate-y-1"
                      style={{
                        ...provided.draggableProps.style,
                        transform: snapshot.isDragging 
                          ? provided.draggableProps.style?.transform 
                          : 'none',
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-slate-400 mr-2">#{item.order + 1}</span>
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl text-white text-lg shadow-lg">
                            {/* SF Symbol will be handled by iOS app - no icon display in web dashboard */}
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-400">{item.number}</div>
                            <div className="text-sm font-medium text-white">{item.label}</div>
                            <div className="text-xs text-slate-300">{item.subtitle}</div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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

      {impactStats.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-300 text-lg font-medium">No impact statistics yet</p>
          <p className="text-slate-400 mt-2">Add your first statistic to start tracking your impact!</p>
        </div>
      )}
    </div>
  );
}
