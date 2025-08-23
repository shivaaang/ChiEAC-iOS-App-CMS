//
//  emailNotifications/templates.ts
//  ChiEAC Firebase Functions
//
//  Email templates for form submission notifications
//  Created by Shivaang Kumar on 8/20/25.
//

export interface FormSubmissionData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: Date;
  status: 'incomplete' | 'complete';
}

export class EmailTemplates {
  /**
   * Generate subject line for form submission notification
   */
  static getSubject(data: FormSubmissionData): string {
    return `New Form Submission from ${data.name} - ChiEAC App`;
  }

  /**
   * Generate HTML email body for form submission notification
   */
  static getHtmlBody(data: FormSubmissionData): string {
    const formattedDate = data.submittedAt.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Chicago',
      timeZoneName: 'short'
    });

    // Add explicit timezone initials for clarity
    const chicagoTimeWithInitials = `${formattedDate} (CT)`;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Form Submission - ChiEAC</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 12px;
            background-color: #f8fafc;
          }
          .container {
            background: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #e2e8f0;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 6px;
          }
          .subtitle {
            color: #64748b;
            font-size: 16px;
          }
          .submission-info {
            background: #f1f5f9;
            border-radius: 6px;
            padding: 20px;
            margin: 16px 0;
          }
          .field {
            margin-bottom: 16px;
          }
          .field-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 4px;
            display: block;
          }
          .field-value {
            color: #1f2937;
            word-wrap: break-word;
          }
          .message-field {
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 12px;
            white-space: pre-wrap;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .status-incomplete {
            background: #fef3c7;
            color: #92400e;
          }
          .status-complete {
            background: #d1fae5;
            color: #065f46;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
          }
          .cta-section {
            text-align: center;
            margin: 16px 0;
            padding: 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
          }
          .cta-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          .cta-text {
            color: #64748b;
            margin: 8px 0 12px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ChiEAC</div>
            <div class="subtitle">New Form Submission from iOS App</div>
          </div>

          <div class="submission-info">
            <div class="field">
              <span class="field-label">Submitted By:</span>
              <div class="field-value">${data.name}</div>
            </div>

            <div class="field">
              <span class="field-label">Email Address:</span>
              <div class="field-value">
                <a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none;">
                  ${data.email}
                </a>
              </div>
            </div>

            <div class="field">
              <span class="field-label">Phone Number:</span>
              <div class="field-value">
                ${data.phone ? `<a href="tel:${data.phone}" style="color: #3b82f6; text-decoration: none;">${data.phone}</a>` : '<span style="color: #64748b; font-style: italic;">(not provided)</span>'}
              </div>
            </div>

            <div class="field">
              <span class="field-label">Submission Date:</span>
              <div class="field-value">${chicagoTimeWithInitials}</div>
            </div>

            <div class="field">
              <span class="field-label">Status:</span>
              <div class="field-value">
                <span class="status-badge ${data.status === 'complete' ? 'status-complete' : 'status-incomplete'}">
                  ${data.status === 'complete' ? 'Complete' : 'Incomplete'}
                </span>
              </div>
            </div>

            <div class="field">
              <span class="field-label">Message:</span>
              <div class="field-value">
                <div class="message-field">${data.message}</div>
              </div>
            </div>
          </div>

          <div class="cta-section">
            <p class="cta-text">
              View and manage this submission in your CMS
            </p>
            <a href="https://chieac-prod.web.app/form-submissions" class="cta-button">Open ChiEAC CMS</a>
          </div>

          <div class="footer">
            <p>
              This notification was sent automatically when a new form submission was received through the ChiEAC mobile app.
            </p>
            <p style="margin-top: 8px;">
              Submission ID: <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 3px;">${data.id}</code>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate plain text email body for form submission notification
   */
  static getTextBody(data: FormSubmissionData): string {
    const formattedDate = data.submittedAt.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Chicago',
      timeZoneName: 'short'
    });

    // Add explicit timezone initials for clarity
    const chicagoTimeWithInitials = `${formattedDate} (CT)`;
    
    return `
ChiEAC - New Form Submission from iOS App

Submission Details:
-------------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || '(not provided)'}
Date: ${chicagoTimeWithInitials}
Status: ${data.status === 'complete' ? 'Complete' : 'Incomplete'}

Message:
--------
${data.message}

-------------------
View this submission in ChiEAC CMS: https://chieac-prod.web.app/form-submissions

Submission ID: ${data.id}

This notification was sent automatically when a new form submission was received through the ChiEAC mobile app.
    `.trim();
  }
}
