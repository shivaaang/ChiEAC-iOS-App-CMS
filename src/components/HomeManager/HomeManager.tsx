//
//  HomeManager.tsx
//  ChiEAC
//
//  Main HomeManager component combining Core Work and Impact sections
//  Created by Shivaang Kumar on 8/24/25.
//

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useHomeManager } from './hooks';
import {
  CoreWorkCard,
  ImpactCard,
  CoreWorkForm,
  ImpactForm,
  ConfirmationDialog,
} from './components';
import type { CoreWorkItem, ImpactItem, CoreWorkFormData, ImpactFormData } from './types';

const HomeManager: React.FC = () => {
  const {
    // State
    coreWorkItems,
    impactItems,
    loading,
    isCoreWorkReorderingMode,
    isImpactReorderingMode,
    showCoreWorkForm,
    showImpactForm,
    editingCoreWork,
    editingImpact,

    // State setters
    setCoreWorkItems,
    setImpactItems,
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

    // Order operations
    updateCoreWorkOrder,
    updateImpactOrder,
  } = useHomeManager();

  // Confirmation dialogs state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isVisible: boolean;
    item: CoreWorkItem | ImpactItem | null;
    type: 'coreWork' | 'impact';
  }>({
    isVisible: false,
    item: null,
    type: 'coreWork',
  });

  // Form handlers
  const handleCreateCoreWork = () => {
    setEditingCoreWork(null);
    setShowCoreWorkForm(true);
  };

  const handleCreateImpact = () => {
    setEditingImpact(null);
    setShowImpactForm(true);
  };

  const handleEditCoreWork = (item: CoreWorkItem) => {
    setEditingCoreWork(item);
    setShowCoreWorkForm(true);
  };

  const handleEditImpact = (item: ImpactItem) => {
    setEditingImpact(item);
    setShowImpactForm(true);
  };

  const handleDeleteCoreWork = (item: CoreWorkItem) => {
    setDeleteConfirmation({
      isVisible: true,
      item,
      type: 'coreWork',
    });
  };

  const handleDeleteImpact = (item: ImpactItem) => {
    setDeleteConfirmation({
      isVisible: true,
      item,
      type: 'impact',
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.item) return;

    try {
      if (deleteConfirmation.type === 'coreWork') {
        await deleteCoreWorkItem(deleteConfirmation.item.id);
      } else {
        await deleteImpactItem(deleteConfirmation.item.id);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeleteConfirmation({ isVisible: false, item: null, type: 'coreWork' });
    }
  };

  // Form submission handlers
  const handleCoreWorkSubmit = async (formData: CoreWorkFormData) => {
    if (editingCoreWork) {
      await updateCoreWorkItem(editingCoreWork.id, formData);
    } else {
      await createCoreWorkItem(formData);
    }
  };

  const handleImpactSubmit = async (formData: ImpactFormData) => {
    if (editingImpact) {
      await updateImpactItem(editingImpact.id, formData);
    } else {
      await createImpactItem(formData);
    }
  };

  // Drag and drop handlers
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Determine which section we're reordering based on droppableId
    if (source.droppableId === 'core-work-items' && isCoreWorkReorderingMode) {
      const newItems = Array.from(coreWorkItems);
      const [reorderedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, reorderedItem);

      // Update order property
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setCoreWorkItems(updatedItems);
    } else if (source.droppableId === 'impact-items' && isImpactReorderingMode) {
      const newItems = Array.from(impactItems);
      const [reorderedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, reorderedItem);

      // Update order property
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setImpactItems(updatedItems);
    }
  };

  const handleDoneReordering = async () => {
    // Save the reordered items to Firebase using dedicated order update functions
    try {
      if (isCoreWorkReorderingMode) {
        await updateCoreWorkOrder(coreWorkItems);
        setIsCoreWorkReorderingMode(false);
      }
      
      if (isImpactReorderingMode) {
        await updateImpactOrder(impactItems);
        setIsImpactReorderingMode(false);
      }
      
      console.log('✅ Order updated successfully');
    } catch (error) {
      console.error('❌ Error updating order:', error);
    }
  };

  const handleCancelReordering = () => {
    // Turn off reordering mode for whichever section is active
    if (isCoreWorkReorderingMode) {
      setIsCoreWorkReorderingMode(false);
    }
    if (isImpactReorderingMode) {
      setIsImpactReorderingMode(false);
    }
    // Reload data to reset any local changes
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-slate-300 font-medium">Loading home content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent mb-2">
          Home Content Management
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Manage your app's core work and impact statistics
        </p>
      </div>

      {/* Core Work Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Core Work
            </h2>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
              {coreWorkItems.length}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateCoreWork}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all duration-300 shadow-lg flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Core Work</span>
            </button>

            {coreWorkItems.length > 1 && (
              <button
                onClick={() => setIsCoreWorkReorderingMode(!isCoreWorkReorderingMode)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  isCoreWorkReorderingMode
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span>{isCoreWorkReorderingMode ? 'Exit Reorder' : 'Change Order'}</span>
              </button>
            )}

            {isCoreWorkReorderingMode && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancelReordering}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDoneReordering}
                  className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all duration-300 text-sm"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Core Work Content */}
        {coreWorkItems.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/60">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No core work items yet</h3>
            <p className="text-slate-400 mb-6">Create your first core work item to get started.</p>
            <button
              onClick={handleCreateCoreWork}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all duration-300 shadow-lg"
            >
              Create Core Work Item
            </button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="core-work-items" isDropDisabled={!isCoreWorkReorderingMode}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={isCoreWorkReorderingMode 
                    ? "space-y-3" 
                    : "grid grid-cols-1 lg:grid-cols-2 gap-6"
                  }
                >
                  {coreWorkItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={!isCoreWorkReorderingMode}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <CoreWorkCard
                            item={item}
                            index={index}
                            isReorderingMode={isCoreWorkReorderingMode}
                            onEdit={handleEditCoreWork}
                            onDelete={handleDeleteCoreWork}
                            isDragging={snapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Impact Stats Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Impact Statistics
            </h2>
            <span className="px-2 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium">
              {impactItems.length}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateImpact}
              className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-lg flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Impact Stat</span>
            </button>

            {impactItems.length > 1 && (
              <button
                onClick={() => setIsImpactReorderingMode(!isImpactReorderingMode)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  isImpactReorderingMode
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span>{isImpactReorderingMode ? 'Exit Reorder' : 'Change Order'}</span>
              </button>
            )}

            {isImpactReorderingMode && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancelReordering}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDoneReordering}
                  className="px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 text-sm"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Impact Stats Content */}
        {impactItems.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/60">
            <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No impact statistics yet</h3>
            <p className="text-slate-400 mb-6">Create your first impact statistic to get started.</p>
            <button
              onClick={handleCreateImpact}
              className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-lg"
            >
              Create Impact Statistic
            </button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="impact-items" isDropDisabled={!isImpactReorderingMode}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={isImpactReorderingMode 
                    ? "space-y-3" 
                    : "grid grid-cols-1 lg:grid-cols-2 gap-6"
                  }
                >
                  {impactItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={!isImpactReorderingMode}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ImpactCard
                            item={item}
                            index={index}
                            isReorderingMode={isImpactReorderingMode}
                            onEdit={handleEditImpact}
                            onDelete={handleDeleteImpact}
                            isDragging={snapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Forms */}
      <CoreWorkForm
        isVisible={showCoreWorkForm}
        editingItem={editingCoreWork}
        onSubmit={handleCoreWorkSubmit}
        onClose={() => {
          setShowCoreWorkForm(false);
          setEditingCoreWork(null);
        }}
      />

      <ImpactForm
        isVisible={showImpactForm}
        editingItem={editingImpact}
        onSubmit={handleImpactSubmit}
        onClose={() => {
          setShowImpactForm(false);
          setEditingImpact(null);
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isVisible={deleteConfirmation.isVisible}
        title="Delete Item"
        message={`Are you sure you want to delete "${
          deleteConfirmation.type === 'coreWork'
            ? (deleteConfirmation.item as CoreWorkItem)?.title
            : (deleteConfirmation.item as ImpactItem)?.label
        }"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmation({ isVisible: false, item: null, type: 'coreWork' })}
      />
    </div>
  );
};

export default HomeManager;
