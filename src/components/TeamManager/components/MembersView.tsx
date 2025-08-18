//
//  MembersView.tsx
//  ChiEAC
//
//  Members view section with drag-and-drop reordering
//  Created by Shivaang Kumar on 8/17/25.
//

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { MemberCard } from './MemberCard';
import type { Team, TeamMember } from '../types';

interface MembersViewProps {
  selectedTeam: Team | null;
  teamMembers: TeamMember[];
  isReorderingMode: boolean;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  onMemberDragEnd: (result: DropResult) => void;
  onToggleReorderMode: () => void;
  onCreateMember: () => void;
  onBackToTeams: () => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  selectedTeam,
  teamMembers,
  isReorderingMode,
  onEditMember,
  onDeleteMember,
  onMemberDragEnd,
  onToggleReorderMode,
  onCreateMember,
  onBackToTeams
}) => {
  if (!selectedTeam) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No team selected</h3>
        <p className="text-slate-400 mb-6">Select a team to view and manage its members</p>
        <button
          onClick={onBackToTeams}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 flex items-center gap-2 mx-auto hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Teams
        </button>
      </div>
    );
  }

  const filteredMembers = teamMembers.filter(member => 
    member.member_team === selectedTeam.team_code || member.team === selectedTeam.team_code
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToTeams}
            className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              {selectedTeam.team_name} Members
            </h2>
            <p className="text-slate-400">
              {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} total
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Reorder Mode Toggle */}
          {filteredMembers.length > 1 && (
            <button
              onClick={onToggleReorderMode}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center gap-2 ${
                isReorderingMode
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30'
                  : 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-200 shadow-slate-500/20'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              {isReorderingMode ? 'Exit Reorder' : 'Reorder Members'}
            </button>
          )}

          {/* Create Member Button */}
          <button
            onClick={onCreateMember}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 flex items-center gap-2 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </button>
        </div>
      </div>

      {/* Team Info Card */}
      <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{selectedTeam.team_name}</h3>
            <p className="text-slate-400 text-sm">Team Code: {selectedTeam.team_code}</p>
          </div>
        </div>
        <p className="text-slate-300 mt-4 leading-relaxed">
          {selectedTeam.team_description}
        </p>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No members yet</h3>
          <p className="text-slate-400 mb-6">Add the first member to this team</p>
          <button
            onClick={onCreateMember}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 flex items-center gap-2 mx-auto hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add First Member
          </button>
        </div>
      ) : isReorderingMode ? (
        <DragDropContext onDragEnd={onMemberDragEnd}>
          <Droppable droppableId="members" direction="vertical">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {filteredMembers.map((member, index) => (
                  <Draggable
                    key={member.id}
                    draggableId={member.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <MemberCard
                          member={member}
                          index={index}
                          onEditMember={onEditMember}
                          onDeleteMember={onDeleteMember}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              index={index}
              onEditMember={onEditMember}
              onDeleteMember={onDeleteMember}
            />
          ))}
        </div>
      )}
    </div>
  );
};
