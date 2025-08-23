//
//  MembersView.tsx
//  ChiEAC
//
//  Members view section matching legacy layout exactly
//  Created by Shivaang Kumar on 8/18/25.
//

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { MemberCard } from './MemberCard';
import { TeamHeader } from './TeamHeader';
import type { Team, TeamMember } from '../types';

interface MembersViewProps {
  selectedTeam: Team | null;
  teamMembers: TeamMember[];
  isReorderingMode: boolean;
  selectedMemberForView: TeamMember | null;
  rightPanelMode: 'view' | 'edit' | null;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  onMemberDragEnd: (result: DropResult) => void;
  onToggleReorderMode: () => void;
  onCreateMember: () => void;
  onBackToTeams: () => void;
  onCloseRightPanel: () => void;
  onEnterReorderingMode: () => void;
  onHandleDoneReordering: () => void;
  onCancelReordering: () => void;
  onHandleMemberCardClick: (member: TeamMember) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (id: string) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  selectedTeam,
  teamMembers, // This is already filtered members from team manager
  isReorderingMode,
  selectedMemberForView,
  rightPanelMode,
  onEditMember,
  onDeleteMember,
  onMemberDragEnd,
  onToggleReorderMode: _onToggleReorderMode,
  onCreateMember,
  onBackToTeams,
  onCloseRightPanel,
  onEnterReorderingMode,
  onHandleDoneReordering,
  onCancelReordering,
  onHandleMemberCardClick,
  onEditTeam,
  onDeleteTeam
}) => {
  // Use the already filtered members passed from team manager
  const filteredMembers = teamMembers;

  return (
    <div>
      {/* Use TeamHeader component instead of inline header */}
      <TeamHeader
        onBackToTeams={onBackToTeams}
        selectedTeam={selectedTeam}
        filteredMembers={filteredMembers}
        isReorderingMode={isReorderingMode}
        onCreateMember={onCreateMember}
        onEnterReorderingMode={onEnterReorderingMode}
        onEditTeam={onEditTeam}
        onDeleteTeam={onDeleteTeam}
        onHandleDoneReordering={onHandleDoneReordering}
        onCancelReordering={onCancelReordering}
      />

      {/* Main content area with dynamic layout */}
      <div className={`flex flex-col lg:flex-row gap-6 min-h-[600px] ${selectedMemberForView || rightPanelMode ? '' : 'justify-center'}`}>
        {/* Left side: Member cards */}
        <div className={`${selectedMemberForView || rightPanelMode ? 'lg:w-[60%]' : 'w-full'} transition-all duration-300`}>

        {!selectedTeam ? (
          <div className="text-center py-12 text-slate-400 bg-slate-900/40 rounded-xl backdrop-blur-sm border border-slate-700">
            <div className="text-lg">No team selected</div>
          </div>
        ) : (
          <DragDropContext onDragEnd={onMemberDragEnd}>
            <Droppable droppableId="teamMembers" isDropDisabled={!isReorderingMode}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {filteredMembers.map((member, index) => {
                    const isSelected = selectedMemberForView?.id === member.id;
                    return (
                      <Draggable key={member.id} draggableId={member.id} index={index} isDragDisabled={!isReorderingMode}>
                        {(provided, snapshot) => (
                          <MemberCard
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            dragHandleProps={isReorderingMode ? provided.dragHandleProps : undefined}
                            member={member}
                            index={index}
                            isSelected={isSelected}
                            isReorderingMode={isReorderingMode}
                            isDragging={snapshot.isDragging}
                            onClick={() => !isReorderingMode && onHandleMemberCardClick(member)}
                            onEdit={() => onEditMember(member)}
                            onDelete={() => onDeleteMember(member.id)}
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        </div>

        {/* Right side: Member details view or Edit form (40%) */}
        {(selectedMemberForView || rightPanelMode) && (
          <div className="w-full lg:w-[40%]">
            {rightPanelMode === 'view' && selectedMemberForView && (() => {
              // Find the latest member data from the current team members
              const currentMember = filteredMembers.find(m => m.id === selectedMemberForView.id);
              // Only show member details if the member belongs to the current team
              if (!currentMember) return null;
              return (
              <div className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-700 shadow-lg sticky top-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-semibold text-white text-lg">Member Details</h3>
                  <button
                    onClick={onCloseRightPanel}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Member Image */}
                {currentMember.member_image_link && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={currentMember.member_image_link}
                      alt={currentMember.member_name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-orange-500/30"
                    />
                  </div>
                )}
                
                {/* Member Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white text-xl text-center mb-2">
                      {currentMember.member_name}
                    </h4>
                    <p className="text-orange-400 text-lg font-medium text-center">
                      {currentMember.member_title}
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h5 className="font-medium text-slate-300 mb-2">Member Description</h5>
                    <p className="text-orange-300 font-mono text-sm">
                      {currentMember.member_summary || 'No description available'}
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h5 className="font-medium text-slate-300 mb-2">Member Description Summary</h5>
                    <p className="text-orange-300 font-mono text-sm">
                      {currentMember.member_summary_short || 'No summary available'}
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h5 className="font-medium text-slate-300 mb-2">Member Image Source</h5>
                    <a 
                      href={currentMember.member_image_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-300 font-mono text-sm hover:text-orange-200 hover:underline transition-colors duration-200"
                    >
                      {currentMember.member_image_link || 'No image source available'}
                    </a>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h5 className="font-medium text-slate-300 mb-2">Team</h5>
                    <p className="text-orange-300 font-mono text-sm">
                      {currentMember.member_team}
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h5 className="font-medium text-slate-300 mb-2">ID</h5>
                    <p className="text-orange-300 font-mono text-sm">
                      {currentMember.id}
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => onEditMember(currentMember)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                  >
                    Edit Member
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMember(currentMember.id);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-300"
                  >
                    Delete Member
                  </button>
                </div>
              </div>
              );
            })()}

          </div>
        )}
      </div>
    </div>
  );
};