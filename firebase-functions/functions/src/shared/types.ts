//
//  shared/types.ts
//  ChiEAC Firebase Functions
//
//  Shared type definitions across all modules
//  Created by Shivaang Kumar on 8/20/25.
//

// Common response types
export interface BaseResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// Error handling types
export interface ErrorDetails {
  code: string;
  message: string;
  details?: any;
}

// Common result patterns
export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: ErrorDetails;
  metadata?: Record<string, any>;
}
