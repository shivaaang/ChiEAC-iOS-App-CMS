//
//  TeamsView.tsx
//  ChiEAC
//
//  Teams overview section component matching legacy layout exactly
//  Created by Shivaang Kumar on 8/18/25.
//

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { TeamCard } from './TeamCard';
import type { Team, TeamMember } from '../types';

interface TeamsViewProps {
  teams: Team[];
  isReorderingMode: boolean;
  teamMembers: TeamMember[];
  onTeamClick: (team: Team) => void;
  onDeleteTeam: (id: string) => void;
  onTeamDragEnd: (result: DropResult) => void;
  onCreateTeam: () => void;
  onEnterTeamReorderingMode: () => void;
  onHandleDoneTeamReordering: () => void;
  onCancelTeamReordering: () => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  isReorderingMode,
  teamMembers,
  onTeamClick,
  onDeleteTeam,
  onTeamDragEnd,
  onCreateTeam,
  onEnterTeamReorderingMode,
  onHandleDoneTeamReordering,
  onCancelTeamReordering
}) => {
  const getMemberCount = (teamCode: string) => {
    return teamMembers.filter(member => 
      member.member_team === teamCode || member.team === teamCode
    ).length;
  };

  return (
    <div>
      {/* Header matching legacy exactly */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
          <h1 className="text-4xl font-bold mb-2">Team Management</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Manage teams and team members
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-white">Teams</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Team reordering controls */}
          {teams.length > 1 && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isReorderingMode ? (
                <button
                  onClick={onEnterTeamReorderingMode}
                  className="bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 hover:border-slate-500 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Change Order
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={onHandleDoneTeamReordering}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg flex items-center gap-2 flex-1 sm:flex-none justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Done
                  </button>
                  <button
                    onClick={onCancelTeamReordering}
                    className="bg-slate-600 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 hover:border-slate-500 flex-1 sm:flex-none"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onCreateTeam}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 w-full sm:w-auto"
          >
            Add Team
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="min-h-[600px] w-full">
        {/* Team cards */}
        <div className="w-full">
          <DragDropContext onDragEnd={onTeamDragEnd}>
            <Droppable droppableId="teams" isDropDisabled={!isReorderingMode}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={isReorderingMode 
                    ? "space-y-3" 
                    : "grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  }
                >
                  {teams.map((team, index) => {
                    const memberCount = getMemberCount(team.team_code);
                    
                    return (
                      <Draggable key={team.id} draggableId={team.id} index={index} isDragDisabled={!isReorderingMode}>
                        {(provided, snapshot) => (
                          <TeamCard
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            dragHandleProps={isReorderingMode ? provided.dragHandleProps : undefined}
                            team={team}
                            memberCount={memberCount}
                            index={index}
                            isSelected={false}
                            isReorderingMode={isReorderingMode}
                            isDragging={snapshot.isDragging}
                            onClick={() => !isReorderingMode && onTeamClick(team)}
                            onDelete={() => onDeleteTeam(team.id)}
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
        </div>
      </div>
    </div>
  );
};