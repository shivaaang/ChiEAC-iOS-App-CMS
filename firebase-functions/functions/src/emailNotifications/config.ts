//
//  emailNotifications/config.ts
//  ChiEAC Firebase Functions
//
//  Configuration for email notifications with environment variables (future-proof)
//  Created by Shivaang Kumar on 8/20/25.
//

import { defineString } from 'firebase-functions/params';

// Define configurable parameters using environment variables
export const notificationRecipient = defineString('NOTIFICATION_RECIPIENT', {
  description: 'Email address to receive form submission notifications',
  default: 'chieac.developer@gmail.com'
});

export const EMAIL_CONFIG = {
  // Email configuration
  FROM_NAME: 'ChiEAC CMS',
  
  // Feature flags
  ENABLE_HTML_EMAILS: true,
  ENABLE_TEXT_FALLBACK: true,
  
  // Retry configuration
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 2000,
} as const;
