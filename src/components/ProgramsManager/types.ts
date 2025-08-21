//
//  types.ts
//  ChiEAC
//
//  Type definitions for ProgramsManager component
//  Created by Shivaang Kumar on 8/20/25.
//

import type { ProgramInfo } from '../../types';

// Re-export main program type
export type { ProgramInfo };

// Form data type (program without id and order)
export type ProgramFormData = Omit<ProgramInfo, 'id' | 'order'>;

// Hook return type for future use
export interface UseProgramsManagerReturn {
  programs: ProgramInfo[];
  loading: boolean;
  fetchPrograms: () => Promise<void>;
  handleSubmit: (formData: ProgramFormData, editingProgram?: ProgramInfo | null) => Promise<void>;
  handleEdit: (program: ProgramInfo) => void;
  handleDelete: (id: string) => Promise<void>;
  handleDragEnd: (result: any) => Promise<void>;
}
