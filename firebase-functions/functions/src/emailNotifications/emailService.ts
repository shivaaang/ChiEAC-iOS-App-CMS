//
//  emailNotifications/emailService.ts
//  ChiEAC Firebase Functions
//
//  Gmail API email service for form submission notifications
//  Created by Shivaang Kumar on 8/20/25.
//

import { google } from 'googleapis';
import { defineSecret } from 'firebase-functions/params';
import { FormSubmissionData, EmailTemplates } from './templates.js';

// Gmail API configuration
const gmailClientId = defineSecret('GMAIL_CLIENT_ID');
const gmailClientSecret = defineSecret('GMAIL_CLIENT_SECRET');
const gmailRefreshToken = defineSecret('GMAIL_REFRESH_TOKEN');

/**
 * EmailService class for sending notifications via Gmail API
 */
export class EmailService {
  /**
   * Send form submission notification email
   */
  static async sendFormSubmissionNotification(
    formData: FormSubmissionData,
    recipientEmail: string
  ): Promise<boolean> {
    try {
      // Initialize OAuth2 client with trimmed secrets to remove any newlines
      const oauth2Client = new google.auth.OAuth2(
        gmailClientId.value().trim(),
        gmailClientSecret.value().trim(),
        'urn:ietf:wg:oauth:2.0:oob'
      );

      oauth2Client.setCredentials({
        refresh_token: gmailRefreshToken.value().trim()
      });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      // Create email content
      const subject = EmailTemplates.getSubject(formData);
      const htmlBody = EmailTemplates.getHtmlBody(formData);

      // Create the email message in RFC 2822 format
      const message = [
        `From: ChiEAC iOS App CMS <chieac.developer@gmail.com>`,
        `To: ${recipientEmail}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        htmlBody
      ].join('\n');

      // Encode to base64url
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send email via Gmail API
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      console.log('Email sent successfully via Gmail API:', result.data.id);
      return true;

    } catch (error) {
      console.error('Error sending email via Gmail API:', error);
      return false;
    }
  }
}
