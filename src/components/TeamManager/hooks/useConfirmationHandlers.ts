//
//  useConfirmationHandlers.ts
//  ChiEAC
//
//  Confirmation handlers for creation and deletion operations
//  Created by Shivaang Kumar on 8/17/25.
//

import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export const createConfirmationHandlers = (
  teamManagerState: any,
  teamManagerActions: any,
  teamHandlers?: any
) => {
  const {
    pendingCreation,
    pendingDeletion,
    pendingMemberDeletion,
    pendingSubmitFunction,
    selectedMemberForView,
    selectedTeamForView,
    filteredMembers,
    teams
  } = teamManagerState;

  const {
    setShowCreateConfirmation,
    setPendingCreation,
    setShowChangeConfirmation,
    setPendingChanges,
    setPendingSubmitFunction,
    setShowDeleteConfirmation,
    setPendingDeletion,
    setShowMemberDeleteConfirmation,
    setPendingMemberDeletion,
    setSelectedTeam,
    setCurrentView,
    setShowOrderChangeConfirmation,
    setIsReorderingMode,
    setOriginalMemberOrder,
    setShowTeamOrderChangeConfirmation,
    setIsTeamReorderingMode,
    setOriginalTeamOrder,
    setFilteredMembers,
    setTeams,
    fetchTeams,
    fetchTeamMembers,
    closeRightPanel: teamManagerCloseRightPanel,
    closeTeamRightPanel: teamManagerCloseTeamRightPanel
  } = teamManagerActions;

  // Creation confirmation handlers
  const confirmCreation = () => {
    setShowCreateConfirmation(false);
    if (pendingCreation.type === 'team' && teamHandlers?.executeTeamUpdate) {
      teamHandlers.executeTeamUpdate();
    } else if (pendingCreation.type === 'member' && teamHandlers?.executeMemberUpdate) {
      teamHandlers.executeMemberUpdate();
    }
  };

  const cancelCreation = () => {
    setShowCreateConfirmation(false);
    setPendingCreation({ type: 'team', data: {} });
  };

  // Change confirmation handlers
  const confirmChanges = () => {
    if (pendingSubmitFunction) {
      pendingSubmitFunction();
    }
  };

  const cancelChanges = () => {
    setShowChangeConfirmation(false);
    setPendingChanges({
      type: 'team',
      original: {},
      updated: {},
      changes: []
    });
    setPendingSubmitFunction(null);
  };

  // Team deletion handlers
  const handleDeleteTeam = async (id: string) => {
    const teamToDelete = teamManagerState.teams.find((t: any) => t.id === id);
    if (!teamToDelete) return;
    
    const affectedMembers = teamManagerState.teamMembers.filter((member: any) => 
      (member.member_team === teamToDelete.team_code) ||
      (member.team === teamToDelete.team_code)
    );
    
    setPendingDeletion({
      team: teamToDelete,
      affectedMembers: affectedMembers
    });
    setShowDeleteConfirmation(true);
  };

  const executeTeamDeletion = async () => {
    if (!pendingDeletion.team) return;
    
    try {
      // First delete all team members
      await Promise.all(
        pendingDeletion.affectedMembers.map((member: any) => deleteDoc(doc(db, 'team_members', member.id)))
      );

      // Then delete the team
      await deleteDoc(doc(db, 'teams', pendingDeletion.team.id));
      
      fetchTeams();
      fetchTeamMembers();
      
      // If this was the selected team, clear the selection
      if (teamManagerState.selectedTeam?.id === pendingDeletion.team.id) {
        setSelectedTeam(null);
        setCurrentView('teams');
      }
      
      // If this was the team being viewed in right panel, close the panel
      if (selectedTeamForView?.id === pendingDeletion.team.id) {
        teamManagerCloseTeamRightPanel();
      }
      
      // Close dialog and reset state
      setShowDeleteConfirmation(false);
      setPendingDeletion({ team: null, affectedMembers: [] });
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error deleting team. Please try again.');
    }
  };

  const cancelDeletion = () => {
    setShowDeleteConfirmation(false);
    setPendingDeletion({ team: null, affectedMembers: [] });
  };

  // Member deletion handlers
  const handleDeleteMember = async (id: string) => {
    const memberToDelete = teamManagerState.teamMembers.find((member: any) => member.id === id);
    if (!memberToDelete) return;
    
    setPendingMemberDeletion(memberToDelete);
    setShowMemberDeleteConfirmation(true);
  };

  const confirmMemberDeletion = async () => {
    if (!pendingMemberDeletion) return;
    
    try {
      await deleteDoc(doc(db, 'team_members', pendingMemberDeletion.id));
      
      // Close right panel if the deleted member was being viewed/edited
      if (selectedMemberForView?.id === pendingMemberDeletion.id) {
        teamManagerCloseRightPanel();
      }
      
      fetchTeamMembers();
      setShowMemberDeleteConfirmation(false);
      setPendingMemberDeletion(null);
    } catch (error) {
      console.error('Error deleting member:', error);
      alert(`Error deleting member: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const cancelMemberDeletion = () => {
    setShowMemberDeleteConfirmation(false);
    setPendingMemberDeletion(null);
  };

  // Member reordering handlers
  const enterReorderingMode = () => {
    teamManagerActions.setOriginalMemberOrder([...filteredMembers]);
    setIsReorderingMode(true);
  };

  const exitReorderingMode = () => {
    setIsReorderingMode(false);
    setOriginalMemberOrder([]);
  };

  const cancelReordering = () => {
    setFilteredMembers([...teamManagerState.originalMemberOrder]);
    exitReorderingMode();
  };

  const hasOrderChanged = () => {
    if (teamManagerState.originalMemberOrder.length !== filteredMembers.length) return true;
    return teamManagerState.originalMemberOrder.some((originalMember: any, index: number) => 
      originalMember.id !== filteredMembers[index].id
    );
  };

  const confirmOrderChanges = async () => {
    try {
      await Promise.all(
        filteredMembers.map((item: any, index: number) =>
          updateDoc(doc(db, 'team_members', item.id), { order: index })
        )
      );
      exitReorderingMode();
      setShowOrderChangeConfirmation(false);
    } catch (error) {
      console.error('Error updating member order:', error);
      alert('Error updating member order. Please try again.');
    }
  };

  const handleDoneReordering = () => {
    if (hasOrderChanged()) {
      setShowOrderChangeConfirmation(true);
    } else {
      exitReorderingMode();
    }
  };

  // Team reordering handlers
  const enterTeamReorderingMode = () => {
    teamManagerActions.setOriginalTeamOrder([...teams]);
    setIsTeamReorderingMode(true);
  };

  const exitTeamReorderingMode = () => {
    setIsTeamReorderingMode(false);
    setOriginalTeamOrder([]);
  };

  const cancelTeamReordering = () => {
    setTeams([...teamManagerState.originalTeamOrder]);
    exitTeamReorderingMode();
  };

  const hasTeamOrderChanged = () => {
    if (teamManagerState.originalTeamOrder.length !== teams.length) return true;
    return teamManagerState.originalTeamOrder.some((originalTeam: any, index: number) => 
      originalTeam.id !== teams[index].id
    );
  };

  const confirmTeamOrderChanges = async () => {
    try {
      await Promise.all(
        teams.map((item: any, index: number) =>
          updateDoc(doc(db, 'teams', item.id), { order: index })
        )
      );
      exitTeamReorderingMode();
      setShowTeamOrderChangeConfirmation(false);
    } catch (error) {
      console.error('Error updating team order:', error);
      alert('Error updating team order. Please try again.');
    }
  };

  const handleDoneTeamReordering = () => {
    if (hasTeamOrderChanged()) {
      setShowTeamOrderChangeConfirmation(true);
    } else {
      exitTeamReorderingMode();
    }
  };

  return {
    confirmCreation,
    cancelCreation,
    confirmChanges,
    cancelChanges,
    handleDeleteTeam,
    executeTeamDeletion,
    cancelDeletion,
    handleDeleteMember,
    confirmMemberDeletion,
    cancelMemberDeletion,
    enterReorderingMode,
    exitReorderingMode,
    cancelReordering,
    hasOrderChanged,
    confirmOrderChanges,
    handleDoneReordering,
    enterTeamReorderingMode,
    exitTeamReorderingMode,
    cancelTeamReordering,
    hasTeamOrderChanged,
    confirmTeamOrderChanges,
    handleDoneTeamReordering
  };
};
