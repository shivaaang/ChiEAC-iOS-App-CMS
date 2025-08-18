//
//  TeamsView.tsx
//  ChiEAC
//
//  Teams overview section component with drag-and-drop reordering
//  Created by Shivaang Kumar on 8/17/25.
//

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { TeamCard } from './TeamCard';
import type { Team, TeamMember } from '../types';

interface TeamsViewProps {
  teams: Team[];
  selectedTeam: Team | null;
  isReorderingMode: boolean;
  teamMembers: TeamMember[];
  onTeamClick: (team: Team) => void;
  onViewTeamDetails: (team: Team) => void;
  onDeleteTeam: (id: string) => void;
  onTeamDragEnd: (result: DropResult) => void;
  onToggleReorderMode: () => void;
  onCreateTeam: () => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  selectedTeam,
  isReorderingMode,
  teamMembers,
  onTeamClick,
  onViewTeamDetails,
  onDeleteTeam,
  onTeamDragEnd,
  onToggleReorderMode,
  onCreateTeam
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Teams</h2>
          <p className="text-slate-400">
            {teams.length} {teams.length === 1 ? 'team' : 'teams'} total
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Reorder Mode Toggle */}
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
            {isReorderingMode ? 'Exit Reorder' : 'Reorder Teams'}
          </button>

          {/* Create Team Button */}
          <button
            onClick={onCreateTeam}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 flex items-center gap-2 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Team
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No teams yet</h3>
          <p className="text-slate-400 mb-6">Create your first team to get started</p>
          <button
            onClick={onCreateTeam}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 flex items-center gap-2 mx-auto hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Team
          </button>
        </div>
      ) : isReorderingMode ? (
        <DragDropContext onDragEnd={onTeamDragEnd}>
          <Droppable droppableId="teams" direction="vertical">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {teams.map((team, index) => (
                  <Draggable
                    key={team.id}
                    draggableId={team.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TeamCard
                          team={team}
                          index={index}
                          isSelected={selectedTeam?.id === team.id}
                          isReorderingMode={true}
                          teamMembers={teamMembers}
                          onTeamClick={onTeamClick}
                          onViewTeamDetails={onViewTeamDetails}
                          onDeleteTeam={onDeleteTeam}
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
          {teams.map((team, index) => (
            <TeamCard
              key={team.id}
              team={team}
              index={index}
              isSelected={selectedTeam?.id === team.id}
              isReorderingMode={false}
              teamMembers={teamMembers}
              onTeamClick={onTeamClick}
              onViewTeamDetails={onViewTeamDetails}
              onDeleteTeam={onDeleteTeam}
            />
          ))}
        </div>
      )}
    </div>
  );
};
