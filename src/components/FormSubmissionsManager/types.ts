//
//  types.ts
//  ChiEAC
//
//  Type definitions for Form Submissions Manager
//  Created by Shivaang Kumar on 8/20/25.
//

export interface FormSubmission {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  message: string;
  source: string;
  submittedAt: Date;
  status: 'incomplete' | 'complete';
  readAt?: Date; // Optional - when the submission was read
}

export interface FormSubmissionCardProps {
  submission: FormSubmission;
  onView: (submission: FormSubmission) => void;
  onStatusChange: (submissionId: string, newStatus: 'incomplete' | 'complete') => void;
  onDelete: (submissionId: string) => void;
}

export interface SubmissionDetailsProps {
  submission: FormSubmission;
  onClose: () => void;
  onDelete: (submissionId: string) => void;
}
