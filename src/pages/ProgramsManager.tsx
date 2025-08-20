//
//  ProgramsManager.tsx
//  ChiEAC
//
//  Programs management with CRUD operations and drag-and-drop reordering
//  Created by Shivaang Kumar on 8/16/25.
//

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  orderBy, 
  query 
} from 'firebase/firestore';
import type { ProgramInfo } from '../types';

export default function ProgramsManager() {
  const [programs, setPrograms] = useState<ProgramInfo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<ProgramInfo, 'id' | 'order'>>({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    benefits: [''],
    impact: [''],
    status: 'active',
    isVisible: true,
    icon: 'graduationcap.fill',
    contactEmail: ''
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const q = query(collection(db, 'programs'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const programsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProgramInfo[];
      setPrograms(programsData);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const programData = {
        ...formData,
        benefits: formData.benefits.filter((b: string) => b.trim() !== ''),
        impact: formData.impact.filter((i: string) => i.trim() !== ''),
        order: editingProgram ? editingProgram.order : programs.length
      };

      if (editingProgram) {
        await updateDoc(doc(db, 'programs', editingProgram.id), programData);
      } else {
        await addDoc(collection(db, 'programs'), programData);
      }

      setShowForm(false);
      setEditingProgram(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        category: '',
        benefits: [''],
        impact: [''],
        status: 'active',
        isVisible: true,
        icon: 'graduationcap.fill',
        contactEmail: ''
      });
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const handleEdit = (program: ProgramInfo) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      subtitle: program.subtitle,
      description: program.description,
      category: program.category,
      benefits: program.benefits.length > 0 ? program.benefits : [''],
      impact: program.impact.length > 0 ? program.impact : [''],
      status: program.status,
      isVisible: program.isVisible,
      icon: program.icon,
      contactEmail: program.contactEmail
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await deleteDoc(doc(db, 'programs', id));
        fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(programs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setPrograms(updatedItems);

    // Update order in Firebase
    try {
      const updatePromises = updatedItems.map(item =>
        updateDoc(doc(db, 'programs', item.id), { order: item.order })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating order:', error);
      fetchPrograms(); // Revert on error
    }
  };

  const addListItem = (field: 'benefits' | 'impact') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'benefits' | 'impact', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'benefits' | 'impact', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-chieac-secondary-text">Loading programs...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">Programs Management</h1>
        <p className="text-slate-300 text-lg">
          Manage educational programs and initiatives
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Programs</h2>
        <button
          onClick={() => setShowForm(true)}
          className="group flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          Add Program
        </button>
      </div>

      {/* Programs List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="programs">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {programs.map((program, index) => (
                <Draggable key={program.id} draggableId={program.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="group relative bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700/60 p-6 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-slate-600/60 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-emerald-300 text-lg">📚</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{program.title}</h3>
                              <p className="text-sm text-emerald-300">{program.subtitle}</p>
                            </div>
                          </div>
                          <p className="text-slate-300 mb-3">{program.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {program.benefits.length > 0 && (
                              <div>
                                <h4 className="font-medium text-white mb-2">Benefits</h4>
                                <ul className="text-sm text-slate-300 space-y-1">
                                  {program.benefits.slice(0, 2).map((benefit, i) => (
                                    <li key={i}>• {benefit}</li>
                                  ))}
                                  {program.benefits.length > 2 && (
                                    <li className="text-emerald-300">... and {program.benefits.length - 2} more</li>
                                  )}
                                </ul>
                              </div>
                            )}
                            {program.impact.length > 0 && (
                              <div>
                                <h4 className="font-medium text-white mb-2">Impact</h4>
                                <ul className="text-sm text-slate-300 space-y-1">
                                  {program.impact.slice(0, 2).map((impact, i) => (
                                    <li key={i}>• {impact}</li>
                                  ))}
                                  {program.impact.length > 2 && (
                                    <li className="text-emerald-300">... and {program.impact.length - 2} more</li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="mt-3 flex items-center space-x-4 text-sm text-slate-400">
                            <span>Icon: {program.icon}</span>
                            <span>Contact: {program.contactEmail}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(program)}
                            className="text-emerald-400 hover:text-emerald-300 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(program.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
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

      {programs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-chieac-secondary-text">No programs found. Add your first program!</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-chieac-dark-text mb-4">
              {editingProgram ? 'Edit Program' : 'Add New Program'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-chieac-dark-text mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-chieac-border rounded focus:outline-none focus:ring-2 focus:ring-chieac-primary/20 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-chieac-dark-text mb-1">
                    Subtitle <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-chieac-border rounded focus:outline-none focus:ring-2 focus:ring-chieac-primary/20 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-chieac-dark-text mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-chieac-border rounded focus:outline-none focus:ring-2 focus:ring-chieac-primary/20 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-chieac-dark-text mb-1">
                    Icon (SF Symbol)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="graduationcap.fill"
                    className="w-full px-3 py-2 border border-chieac-border rounded focus:outline-none focus:ring-2 focus:ring-chieac-primary/20 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    SF Symbol examples: graduationcap.fill, book.closed, person.3
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-chieac-dark-text mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-chieac-border rounded focus:outline-none focus:ring-2 focus:ring-chieac-primary/20 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-chieac-dark-text">
                    Benefits
                  </label>
                  <button
                    type="button"
                    onClick={() => addListItem('benefits')}
                    className="text-chieac-primary hover:text-chieac-primary/80 text-sm"
                  >
                    + Add Benefit
                  </button>
                </div>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateListItem('benefits', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-chieac-border rounded focus:outline-none focus:ring-2 focus:ring-chieac-primary/20 focus:border-transparent"
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('benefits', index)}
                        className="text-red-600 hover:text-red-800 px-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Impact */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-chieac-dark-text">
                    Impact
                  </label>
                  <button
                    type="button"
                    onClick={() => addListItem('impact')}
                    className="text-chieac-primary hover:text-chieac-primary/80 text-sm"
                  >
                    + Add Impact
                  </button>
                </div>
                {formData.impact.map((impact, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={impact}
                      onChange={(e) => updateListItem('impact', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-chieac-border rounded focus:outline-none focus:ring-2 focus:ring-chieac-primary/20 focus:border-transparent"
                    />
                    {formData.impact.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('impact', index)}
                        className="text-red-600 hover:text-red-800 px-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProgram(null);
                    setFormData({
                      title: '',
                      subtitle: '',
                      description: '',
                      category: '',
                      benefits: [''],
                      impact: [''],
                      status: 'active',
                      isVisible: true,
                      icon: 'graduationcap.fill',
                      contactEmail: ''
                    });
                  }}
                  className="px-4 py-2 text-chieac-secondary-text hover:text-chieac-dark-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-chieac-primary text-white px-4 py-2 rounded hover:bg-chieac-primary/90 transition-colors"
                >
                  {editingProgram ? 'Update Program' : 'Add Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
