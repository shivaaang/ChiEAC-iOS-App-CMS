//
//  emailNotifications/formSubmissionTrigger.ts
//  ChiEAC Firebase Functions
//
//  Firestore trigger for form submission notifications
//  Created by Shivaang Kumar on 8/20/25.
//

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { EmailService } from './emailService.js';
import { FormSubmissionData } from './templates.js';
import { defineSecret } from 'firebase-functions/params';
import { notificationRecipient } from './config.js';

// Define the secrets this function needs
const gmailClientId = defineSecret('GMAIL_CLIENT_ID');
const gmailClientSecret = defineSecret('GMAIL_CLIENT_SECRET');
const gmailRefreshToken = defineSecret('GMAIL_REFRESH_TOKEN');

/**
 * Firestore trigger: When a new document is created in contact_form_submissions
 * This function automatically sends an email notification
 */
export const onFormSubmissionCreated = onDocumentCreated(
  {
    document: 'contact_form_submissions/{submissionId}',
    secrets: [gmailClientId, gmailClientSecret, gmailRefreshToken],
  },
  async (event) => {
    try {
      const submissionId = event.params.submissionId;
      const submissionData = event.data?.data();

      if (!submissionData) {
        console.error('No data found in form submission document');
        return;
      }

      console.log(`Processing new form submission: ${submissionId}`);

      // Transform Firestore data to our email data format
      // Handle both firstName/lastName and name fields for compatibility
      const firstName = submissionData.firstName || '';
      const lastName = submissionData.lastName || '';
      const fullName = submissionData.name || `${firstName} ${lastName}`.trim() || 'Unknown';

      const emailData: FormSubmissionData = {
        id: submissionId,
        name: fullName,
        email: submissionData.email || 'No email provided',
        phone: submissionData.phone || undefined,
        message: submissionData.message || 'No message provided',
        submittedAt: submissionData.submittedAt?.toDate() || new Date(),
        status: submissionData.status || 'incomplete',
      };

      // Send email notification using Gmail API
      const emailSent = await EmailService.sendFormSubmissionNotification(
        emailData,
        notificationRecipient.value()
      );

      if (emailSent) {
        console.log(`Email notification sent successfully for submission ${submissionId}`);
      } else {
        console.error(`Failed to send email notification for submission ${submissionId}`);
      }

    } catch (error) {
      console.error('Error in form submission trigger:', error);
      // Don't throw - we don't want to fail the Firestore write if email fails
    }
  }
);
