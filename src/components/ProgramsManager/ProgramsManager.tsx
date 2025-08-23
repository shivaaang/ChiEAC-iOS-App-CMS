//
//  ProgramsManager.tsx
//  ChiEAC
//
//  Modularized programs management component with CRUD operations and drag-and-drop reordering
//  Created by Shivaang Kumar on 8/20/25.
//

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { db } from '../../config/firebase';
import { 
  collection, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  orderBy, 
  query,
  setDoc
} from 'firebase/firestore';
import type { ProgramInfo } from '../../types';
import { 
  ProgramCard, 
  ProgramDeleteConfirmationDialog, 
  ProgramViewDialog, 
  ProgramFormModal 
} from './components';

export default function ProgramsManager() {
  const [programs, setPrograms] = useState<ProgramInfo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewingProgram, setViewingProgram] = useState<ProgramInfo | null>(null);
  const [isReorderingMode, setIsReorderingMode] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<ProgramInfo | null>(null);
  const [formData, setFormData] = useState<Omit<ProgramInfo, 'id' | 'order'>>({
    title: '',
    subtitle: '',
    description: '',
    benefits: [''],
    impact: [''],
    icon: 'graduationcap.fill'
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Sync viewingProgram with programs array updates
  useEffect(() => {
    if (viewingProgram) {
      const updatedProgram = programs.find(p => p.id === viewingProgram.id);
      if (updatedProgram) {
        setViewingProgram(updatedProgram);
      }
    }
  }, [programs, viewingProgram]);

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

  const generateProgramId = (title: string): string => {
    // Convert title to lowercase, replace spaces with underscores, remove special characters
    const cleanTitle = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    
    return `program.${cleanTitle}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        // For editing, just update the existing document
        const programData = {
          ...formData,
          benefits: formData.benefits.filter((b: string) => b.trim() !== ''),
          impact: formData.impact.filter((i: string) => i.trim() !== ''),
        };
        await updateDoc(doc(db, 'programs', editingProgram.id), programData);
        
        // Immediate state update for viewingProgram
        if (viewingProgram && viewingProgram.id === editingProgram.id) {
          setViewingProgram({ ...viewingProgram, ...programData });
        }
      } else {
        // For new programs, generate ID and use it as document ID
        const programId = generateProgramId(formData.title);
        const programData = {
          ...formData,
          id: programId,
          benefits: formData.benefits.filter((b: string) => b.trim() !== ''),
          impact: formData.impact.filter((i: string) => i.trim() !== ''),
          order: programs.length
        };
        await setDoc(doc(db, 'programs', programId), programData);
      }

      setShowForm(false);
      setEditingProgram(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        benefits: [''],
        impact: [''],
        icon: 'graduationcap.fill'
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
      benefits: program.benefits.length > 0 ? program.benefits : [''],
      impact: program.impact.length > 0 ? program.impact : [''],
      icon: program.icon
    });
    setShowForm(true);
  };

  const handleProgramClick = (program: ProgramInfo) => {
    setViewingProgram(program);
  };

  const handleEnterReorderingMode = () => {
    setIsReorderingMode(true);
  };

  const handleDoneReordering = () => {
    setIsReorderingMode(false);
  };

  const handleCancelReordering = () => {
    setIsReorderingMode(false);
    fetchPrograms(); // Revert any changes
  };

  const handleDelete = (program: ProgramInfo) => {
    setProgramToDelete(program);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (programToDelete) {
      try {
        await deleteDoc(doc(db, 'programs', programToDelete.id));
        setShowDeleteConfirmation(false);
        setProgramToDelete(null);
        setViewingProgram(null); // Close view dialog if open
        fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setProgramToDelete(null);
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

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProgram(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      benefits: [''],
      impact: [''],
      icon: 'graduationcap.fill'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading programs...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">Programs Management</h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Manage educational programs and initiatives
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">Programs</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Program reordering controls */}
          {programs.length > 1 && (
            <div className="flex items-center gap-3">
              {!isReorderingMode ? (
                <button
                  onClick={handleEnterReorderingMode}
                  className="bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 hover:border-slate-500 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Change Order
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDoneReordering}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Done
                  </button>
                  <button
                    onClick={handleCancelReordering}
                    className="bg-slate-600 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 hover:border-slate-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
          >
            Add Program
          </button>
        </div>
      </div>

      {/* Programs Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="programs" isDropDisabled={!isReorderingMode}>
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className={isReorderingMode 
                ? "space-y-3" 
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              }
            >
              {programs.map((program, index) => (
                <Draggable key={program.id} draggableId={program.id} index={index} isDragDisabled={!isReorderingMode}>
                  {(provided, snapshot) => (
                    <ProgramCard
                      ref={provided.innerRef}
                      program={program}
                      index={index}
                      isSelected={false}
                      isReorderingMode={isReorderingMode}
                      isDragging={snapshot.isDragging}
                      onClick={() => !isReorderingMode && handleProgramClick(program)}
                      onDelete={() => handleDelete(program)}
                      dragHandleProps={isReorderingMode ? provided.dragHandleProps : undefined}
                      {...provided.draggableProps}
                    />
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
          <p className="text-slate-400">No programs found. Add your first program!</p>
        </div>
      )}

      {/* View Details Dialog */}
      {viewingProgram && (
        <ProgramViewDialog
          program={viewingProgram}
          onClose={() => setViewingProgram(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Form Modal */}
      <ProgramFormModal
        isVisible={showForm}
        editingProgram={editingProgram}
        formData={formData}
        onSubmit={handleSubmit}
        onClose={handleFormClose}
        onFormDataChange={setFormData}
        onAddListItem={addListItem}
        onUpdateListItem={updateListItem}
        onRemoveListItem={removeListItem}
      />

      {/* Delete Confirmation Dialog */}
      <ProgramDeleteConfirmationDialog
        isVisible={showDeleteConfirmation}
        program={programToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
