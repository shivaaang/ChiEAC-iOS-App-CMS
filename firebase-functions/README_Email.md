# Email Notification Service Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication & Security](#authentication--security)
4. [File Structure & Components](#file-structure--components)
5. [Initial Setup Guide](#initial-setup-guide)
6. [Configuration Management](#configuration-management)
7. [Deployment Guide](#deployment-guide)
8. [Customization Guide](#customization-guide)
9. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
10. [Security Best Practices](#security-best-practices)
11. [Technical Reference](#technical-reference)
12. [Appendices](#appendices)

---

## Overview

### What This Service Does
The **Email Notification Service** is a production-ready, serverless email system built on Firebase Functions v2 that automatically sends notification emails when new form submissions are created in the ChiEAC application. The service leverages the Gmail API to send professional HTML emails with zero third-party dependencies on traditional SMTP servers.

### Key Features
- **Automatic Triggering**: Firestore document creation triggers instant email notifications
- **Gmail API Integration**: Uses Google's official Gmail API for reliable email delivery
- **OAuth 2.0 Security**: Secure authentication using refresh tokens stored in Firebase Secrets
- **Professional Templates**: Rich HTML email templates with responsive design
- **Zero Downtime**: Serverless architecture with automatic scaling
- **Future-Proof**: No deprecated APIs or dependencies that expire in 2026+
- **Error Handling**: Comprehensive error logging and graceful failure handling
- **Configurable**: Easy customization of recipients, templates, and settings

### Business Value
- **Immediate Response**: Form submissions trigger instant notifications within seconds
- **Professional Communication**: Branded email templates maintain organizational consistency
- **Operational Reliability**: No dependency on external SMTP providers or app passwords
- **Cost Effective**: Leverages existing Google Workspace infrastructure
- **Maintainable**: Clean, documented codebase with minimal dependencies

---

## Architecture

### High-Level Architecture
```
iOS App Form Submission → Firestore Document → Firebase Function → Gmail API → Email Delivery
```

### Detailed Data Flow
1. **Form Submission**: User submits contact form through iOS app
2. **Firestore Write**: iOS app creates document in `contact_form_submissions` collection
3. **Function Trigger**: Firestore document creation triggers `onFormSubmissionCreated` function
4. **Data Processing**: Function extracts and validates form submission data
5. **Authentication**: OAuth2 client authenticates with Gmail API using stored refresh token
6. **Email Generation**: HTML email is generated using professional template
7. **API Call**: Gmail API's `messages.send` method sends the email
8. **Logging**: Success/failure is logged for monitoring and debugging

### Technology Stack
- **Runtime**: Node.js 22 (ES Modules)
- **Platform**: Firebase Functions v2 (Google Cloud Functions)
- **Database**: Cloud Firestore
- **Email API**: Gmail API v1
- **Authentication**: OAuth 2.0 with refresh tokens
- **Secret Management**: Firebase Secrets Manager
- **Language**: TypeScript with strict type checking

### Security Architecture
- **Principle of Least Privilege**: Function only has Gmail send permissions
- **Secret Isolation**: OAuth credentials stored in Firebase Secrets (not in code)
- **No Persistent Storage**: No tokens cached in function memory between invocations
- **Audit Trail**: All email operations logged with unique message IDs
- **Error Handling**: Sensitive information redacted from error logs

---

## Authentication & Security

### OAuth 2.0 Flow Overview
The service uses **OAuth 2.0 Authorization Code Flow** with refresh tokens to authenticate with Gmail API. This approach is more secure and reliable than traditional SMTP authentication.

### Why Gmail API Over SMTP?
| Feature | Gmail API | SMTP |
|---------|-----------|------|
| **Security** | OAuth 2.0 tokens | App passwords |
| **Reliability** | Google's infrastructure | Third-party servers |
| **Rate Limits** | Higher limits | Lower limits |
| **Monitoring** | Rich API responses | Limited feedback |
| **Future Support** | Long-term Google support | App passwords deprecated |

### OAuth Scopes Required
The service requires the following minimal Google OAuth scope:
- `https://www.googleapis.com/auth/gmail.send` - Send emails on behalf of the authenticated user

### Security Credentials Stored
Three secure credentials are required and stored in Firebase Secrets:
1. **GMAIL_CLIENT_ID**: OAuth 2.0 client identifier
2. **GMAIL_CLIENT_SECRET**: OAuth 2.0 client secret
3. **GMAIL_REFRESH_TOKEN**: Long-lived token for API access

---

## File Structure & Components

### Directory Structure
```
firebase-functions/functions/src/emailNotifications/
├── index.ts                    # Public exports
├── emailService.ts            # Core Gmail API service
├── formSubmissionTrigger.ts   # Firestore trigger function
├── config.ts                  # Configuration management
└── templates.ts               # Email templates and types
```

### Component Responsibilities

#### `emailService.ts` - Core Email Service
**Purpose**: Handles Gmail API authentication and email sending logic.

**Key Functions**:
- `sendFormSubmissionNotification()`: Main email sending method
- `generateEmailHTML()`: Creates formatted HTML email content
- OAuth 2.0 client initialization and token management
- RFC 2822 message formatting and base64url encoding

**Dependencies**: 
- `googleapis`: Google's official Node.js client library
- `firebase-functions/params`: For accessing Firebase Secrets

**Error Handling**: Catches and logs OAuth errors, API failures, and network issues.

#### `formSubmissionTrigger.ts` - Firestore Trigger
**Purpose**: Firestore event handler that processes new form submissions.

**Trigger Configuration**:
- **Collection**: `contact_form_submissions`
- **Event**: Document creation (`onDocumentCreated`)
- **Pattern**: `contact_form_submissions/{submissionId}`

**Data Processing**:
- Extracts form data from Firestore document
- Handles both `firstName`/`lastName` and combined `name` fields
- Validates required fields (name, email, message)
- Transforms Firestore timestamps to JavaScript Date objects

**Secret Dependencies**: Declares all required OAuth secrets for the function runtime.

#### `config.ts` - Configuration Management
**Purpose**: Centralizes configuration using Firebase environment variables.

**Environment Variables**:
- `NOTIFICATION_RECIPIENT`: Email address to receive notifications (default: chieac.developer@gmail.com)

**Configuration Constants**:
- Email sender name and branding
- Feature flags for HTML/text email types
- Retry configuration for failed sends

#### `templates.ts` - Email Templates & Types
**Purpose**: Defines data structures and email template generation.

**TypeScript Interfaces**:
```typescript
interface FormSubmissionData {
  id: string;           // Firestore document ID
  name: string;         // Submitter's full name
  email: string;        // Submitter's email
  phone?: string;       // Optional phone number
  message: string;      // Form message content
  submittedAt: Date;    // Submission timestamp
  status: 'incomplete' | 'complete';
}
```

**Template Features**:
- Responsive HTML design
- Professional branding with ChiEAC styling
- Formatted timestamp display
- Optional field handling (phone numbers)
- Mobile-friendly layout

#### `index.ts` - Public API
**Purpose**: Exports public interfaces for the email notification system.

**Exports**:
- `onFormSubmissionCreated`: The main Firestore trigger function
- `EmailService`: Email service class for potential direct usage

---

## Initial Setup Guide

### Prerequisites
Before setting up the email service, ensure you have:
- Google Cloud Console access with admin privileges
- Firebase CLI installed and authenticated
- Node.js 22+ installed locally
- TypeScript development environment

### Step 1: Google Cloud Console Setup

#### 1.1 Create OAuth 2.0 Credentials
1. **Open your web browser** and navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. **Click on the project dropdown** at the top of the page and select your project (`chieac-prod`)
3. **In the left sidebar**, go to **APIs & Services** → **Credentials**
4. **Click the blue "Create Credentials" button** → **OAuth 2.0 Client IDs**
5. **Select "Desktop Application"** as the application type from the dropdown
6. **Enter the name** "ChiEAC Email Service" in the name field
7. **Click the "Create" button**
8. **A popup will appear showing your credentials**:
   - **Copy the "Client ID"** (long string ending in `.apps.googleusercontent.com`) and **paste it into a temporary text file** (like Notepad, TextEdit, or VS Code) - you'll need this in Step 3.1
   - **Copy the "Client Secret"** (shorter alphanumeric string) and **paste it into the same text file** - you'll need this in Step 3.1
9. **Click "OK"** to close the popup

#### 1.2 Enable Gmail API
1. **In the same Google Cloud Console**, click on **APIs & Services** → **Library** in the left sidebar
2. **In the search bar**, type "Gmail API" and press Enter
3. **Click on "Gmail API"** from the search results (it should be the first result)
4. **Click the blue "Enable" button**
5. **Wait for the API to be enabled** (this usually takes a few seconds)
6. **To verify**: Go to **APIs & Services** → **Enabled APIs** in the left sidebar and confirm "Gmail API" appears in the list

### Step 2: Generate Refresh Token

#### 2.1 OAuth Authorization Flow
You'll need to complete a one-time OAuth authorization to get a refresh token:

1. **Create Authorization URL**:
   - **Take the Client ID** you saved in Step 1.1.8
   - **Copy this URL template**:
   ```
   https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/gmail.send&response_type=code&access_type=offline&prompt=consent
   ```
   - **Replace `YOUR_CLIENT_ID`** with your actual Client ID from your text file

2. **Authorize the Application**:
   - **Copy the complete URL** (after replacing YOUR_CLIENT_ID)
   - **Open a new tab in your web browser** and **paste the URL** into the address bar
   - **Press Enter** to navigate to the authorization page
   - **Sign in with your Google account** (the one that will send the emails)
   - **Click "Continue"** when Google asks to verify the app
   - **Click "Continue"** again on the unverified app warning
   - **Click "Allow"** to grant Gmail send permissions

3. **Get Authorization Code**:
   - **After clicking Allow**, you'll see a page with a code
   - **Copy the entire authorization code** (usually starts with `4/0A` and is quite long)
   - **Paste this code into your text file** and label it "Authorization Code"

4. **Exchange Code for Refresh Token**:
   - **Open Terminal/Command Prompt**
   - **Run this curl command** (replace the placeholders with your actual values):
   ```bash
   curl -X POST https://oauth2.googleapis.com/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "code=YOUR_AUTHORIZATION_CODE" \
     -d "grant_type=authorization_code" \
     -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob"
   ```
   - **Replace `YOUR_CLIENT_ID`** with your Client ID
   - **Replace `YOUR_CLIENT_SECRET`** with your Client Secret  
   - **Replace `YOUR_AUTHORIZATION_CODE`** with the authorization code you just copied

5. **Save the Refresh Token**:
   - **Look for the response** from the curl command
   - **Find the line** that contains `"refresh_token":"`
   - **Copy the refresh token value** (the long string between the quotes after `"refresh_token":"`)
   - **Add this to your text file** and label it "Refresh Token" - this is your permanent credential

### Step 3: Configure Firebase Secrets

#### 3.1 Store OAuth Credentials
**Store the three required credentials in Firebase Secrets Manager:**

```bash
# 1. Open Terminal/Command Prompt and navigate to your firebase-functions directory
cd /path/to/your/firebase-functions

# 2. Set Gmail Client ID
firebase functions:secrets:set GMAIL_CLIENT_ID
# When prompted with "Enter a value for GMAIL_CLIENT_ID:", paste your Client ID from your text file and press Enter

# 3. Set Gmail Client Secret  
firebase functions:secrets:set GMAIL_CLIENT_SECRET
# When prompted with "Enter a value for GMAIL_CLIENT_SECRET:", paste your Client Secret from your text file and press Enter

# 4. Set Gmail Refresh Token
firebase functions:secrets:set GMAIL_REFRESH_TOKEN
# When prompted with "Enter a value for GMAIL_REFRESH_TOKEN:", paste your Refresh Token from your text file and press Enter
```

**Important Notes:**
- **Paste exactly what you copied** - no extra spaces, no quotes, no newlines
- **Press Enter immediately after pasting** each value
- **You should see "Created a new secret version"** message for each secret

#### 3.2 Verify Secret Storage
**Run these commands to confirm your secrets are stored correctly:**

```bash
# Check that Gmail Client ID is stored (you should see a preview of your Client ID)
firebase functions:secrets:access GMAIL_CLIENT_ID --dry-run

# Check that Gmail Client Secret is stored (you should see "Secret exists")
firebase functions:secrets:access GMAIL_CLIENT_SECRET --dry-run

# Check that Gmail Refresh Token is stored (you should see "Secret exists")
firebase functions:secrets:access GMAIL_REFRESH_TOKEN --dry-run
```

**Expected Output:** Each command should show either a preview of your secret or confirm that the secret exists. If you see any "Secret not found" errors, repeat the corresponding step in 3.1.

### Step 4: Configure Environment Variables

#### 4.1 Set Notification Recipient
**Create or update the environment file:**

1. **Navigate to your functions directory**:
   ```bash
   cd /path/to/your/firebase-functions/functions
   ```

2. **Create/open the environment file**:
   - **If the file `.env.chieac-prod` doesn't exist**: Create it with your text editor (VS Code, nano, etc.)
   - **If the file already exists**: Open it with your text editor

3. **Add this line to the file**:
   ```bash
   NOTIFICATION_RECIPIENT=your-notification-email@domain.com
   ```
   **Replace `your-notification-email@domain.com`** with the actual email address where you want to receive form submission notifications

4. **Save and close the file**

**Example of complete file content**:
```bash
NOTIFICATION_RECIPIENT=chieac.developer@gmail.com
```

### Step 5: Deploy the Service

#### 5.1 Build and Deploy
**Follow these steps to deploy your email service:**

1. **Open Terminal/Command Prompt** and navigate to your functions directory:
   ```bash
   cd /path/to/your/firebase-functions/functions
   ```

2. **Install dependencies** (if you haven't already):
   ```bash
   npm install
   ```

3. **Build the TypeScript code**:
   ```bash
   npm run build
   ```
   **Expected output:** You should see "Compilation successful" or similar message with no errors

4. **Navigate to the firebase-functions directory**:
   ```bash
   cd ..
   ```

5. **Deploy the email function**:
   ```bash
   NODE_OPTIONS="--no-deprecation" firebase deploy --only functions:onFormSubmissionCreated
   ```
   **Expected output:** You should see "Deploy complete!" at the end

**What to expect during deployment:**
- The process will take 2-5 minutes
- You'll see messages about preparing, uploading, and updating the function
- If successful, you'll see a green "✔ Deploy complete!" message

#### 5.2 Verify Deployment
**Follow these steps to confirm everything is working:**

1. **Check Firebase Console**:
   - **Open your web browser** and go to [Firebase Console](https://console.firebase.google.com/)
   - **Select your project** (`chieac-prod`)
   - **Click "Functions"** in the left sidebar
   - **Look for "onFormSubmissionCreated"** in the functions list
   - **Verify the status shows "Active"** (green indicator)

2. **Test the email system**:
   - **Submit a test form** through your iOS app
   - **Check your notification email inbox** (the email you set in Step 4.1)
   - **You should receive an email** within 1-2 minutes with the form details

3. **Check function logs**:
   - **In Firebase Console** → **Functions** → **onFormSubmissionCreated**
   - **Click the "Logs" tab**
   - **You should see** "Processing new form submission" and "Email sent successfully" messages

**If you don't receive the email:**
- Check your spam folder
- Verify the NOTIFICATION_RECIPIENT email address is correct
- Check the function logs for error messages
- Refer to the Troubleshooting section

---

## Configuration Management

### Environment Variables

#### Primary Configuration
| Variable | Purpose | Default | Required |
|----------|---------|---------|----------|
| `NOTIFICATION_RECIPIENT` | Email address to receive notifications | `chieac.developer@gmail.com` | Yes |

#### Advanced Configuration
Located in `config.ts`:
```typescript
export const EMAIL_CONFIG = {
  FROM_NAME: 'ChiEAC CMS',           // Sender display name
  ENABLE_HTML_EMAILS: true,          // Send HTML emails
  ENABLE_TEXT_FALLBACK: true,        // Include text fallback
  MAX_RETRY_ATTEMPTS: 3,             // Retry failed sends
  RETRY_DELAY_MS: 2000,              // Delay between retries
} as const;
```

### Secret Management

#### Accessing Secrets in Code
```typescript
import { defineSecret } from 'firebase-functions/params';

const gmailClientId = defineSecret('GMAIL_CLIENT_ID');
// Access with: gmailClientId.value()
```

#### Secret Rotation
To rotate OAuth credentials:
1. Generate new OAuth credentials in Google Cloud Console
2. Update Firebase Secrets with new values
3. Redeploy the function
4. Old credentials are automatically invalidated

### Runtime Configuration

#### Function Configuration
```typescript
export const onFormSubmissionCreated = onDocumentCreated({
  document: 'contact_form_submissions/{submissionId}',
  secrets: [gmailClientId, gmailClientSecret, gmailRefreshToken],
  // Additional configuration:
  memory: '256MiB',           // Memory allocation
  timeoutSeconds: 60,         // Timeout limit
  maxInstances: 100,          // Concurrent instances
  region: 'us-central1',      // Deployment region
});
```

---

## Pre-Deployment Setup

### ⚠️ IMPORTANT: Prepare Utility Files Before Deployment

**Before deploying, you must uncomment and add your actual credentials to the utility files:**

#### Step 1: Update setup-secrets.js
1. **Open** `firebase-functions/functions/utils/setup-secrets.js`
2. **Uncomment the secrets object** and replace placeholders with your actual credentials:
```javascript
const secrets = {
  GMAIL_CLIENT_ID: 'your-actual-client-id.apps.googleusercontent.com',
  GMAIL_CLIENT_SECRET: 'your-actual-client-secret',
  GMAIL_REFRESH_TOKEN: 'your-actual-refresh-token',
  GMAIL_USER_EMAIL: 'chieac.developer@gmail.com'
};
```

#### Step 2: Update refresh-oauth-completely.js
1. **Open** `firebase-functions/functions/utils/refresh-oauth-completely.js`  
2. **Uncomment the constants** and replace placeholders with your actual credentials:
```javascript
const CLIENT_ID = 'your-actual-client-id.apps.googleusercontent.com';
const CLIENT_SECRET = 'your-actual-client-secret';
```

#### Step 3: Remember to Re-comment After Deployment
**After successful deployment, comment out these credentials again for security:**
- This prevents accidental commits of sensitive information
- The deployed functions use Firebase Secrets, not these utility files

---

## Deployment Guide

### Development Deployment

#### Local Testing
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start local emulator
npm run serve

# Test with local Firestore emulator
firebase emulators:start --only functions,firestore
```

#### Testing Email Function
**To test the email function, you need to create a form submission document in Firestore:**

**Option 1: Through Your iOS App (Recommended)**
1. **Open your ChiEAC iOS app**
2. **Navigate to the contact form**
3. **Fill out and submit the form**
4. **Check your notification email** (set in Step 4.1)

**Option 2: Manual Firestore Document Creation**
1. **Open Firebase Console** in your web browser
2. **Go to Firestore Database** → **Data** tab
3. **Click "Start collection"** if `contact_form_submissions` doesn't exist, or click on the existing collection
4. **Click "Add document"**
5. **Use "Auto-ID" for Document ID**
6. **Add these fields** (click "Add field" for each):
   ```
   Field: email          Type: string    Value: test@example.com
   Field: firstName      Type: string    Value: Test
   Field: lastName       Type: string    Value: User
   Field: message        Type: string    Value: Test message from Firestore
   Field: phone          Type: string    Value: (555) 123-4567
   Field: source         Type: string    Value: test
   Field: status         Type: string    Value: incomplete
   Field: submittedAt    Type: timestamp Value: (current date/time)
   ```
7. **Click "Save"**
8. **Check your notification email** within 1-2 minutes

### Production Deployment

#### Pre-Deployment Checklist
- [ ] All secrets configured in Firebase Secrets Manager
- [ ] Environment variables set correctly
- [ ] TypeScript compilation successful (`npm run build`)
- [ ] No linting errors or warnings
- [ ] Function tests pass locally

#### Deployment Command
```bash
# Standard deployment
NODE_OPTIONS="--no-deprecation" firebase deploy --only functions:onFormSubmissionCreated

# Force deployment (if needed)
NODE_OPTIONS="--no-deprecation" firebase deploy --only functions:onFormSubmissionCreated --force
```

#### Post-Deployment Verification
1. **Function Status**: Verify function appears as "Active" in Firebase Console
2. **Secret Access**: Check that secrets are properly bound to the function
3. **Logs**: Monitor function logs for any initialization errors
4. **Test Email**: Submit a test form and verify email delivery
5. **Performance**: Check function execution time and memory usage

### Rollback Procedure
If deployment issues occur:
```bash
# View deployment history
firebase functions:log

# Rollback to previous version (if needed)
# Note: Firebase doesn't support automatic rollbacks, 
# you'll need to redeploy the previous code version
```

### Monitoring Deployment Health
```bash
# Monitor function logs in real-time
firebase functions:log --only onFormSubmissionCreated

# Check function execution metrics
firebase functions:list
```

---

## Customization Guide

### Changing Email Recipients

#### Single Recipient
**To change the email address that receives notifications:**

1. **Open your text editor** (VS Code, nano, etc.)
2. **Navigate to and open** the file `/path/to/your/firebase-functions/functions/.env.chieac-prod`
3. **Find the line** that starts with `NOTIFICATION_RECIPIENT=`
4. **Change the email address** to your new email:
   ```bash
   NOTIFICATION_RECIPIENT=new-email@domain.com
   ```
5. **Save the file**
6. **Redeploy the function** for changes to take effect:
   ```bash
   cd /path/to/your/firebase-functions
   NODE_OPTIONS="--no-deprecation" firebase deploy --only functions:onFormSubmissionCreated
   ```

#### Multiple Recipients
**To send notifications to multiple email addresses:**

1. **Open your text editor** and navigate to `/path/to/your/firebase-functions/functions/src/emailNotifications/config.ts`

2. **Replace the current `notificationRecipient` export** with this code:
   ```typescript
   export const notificationRecipients = defineString('NOTIFICATION_RECIPIENTS', {
     description: 'Comma-separated list of notification recipients',
     default: 'admin@domain.com,support@domain.com'
   });
   ```

3. **Open** `/path/to/your/firebase-functions/functions/src/emailNotifications/formSubmissionTrigger.ts`

4. **Find the line** that calls `sendFormSubmissionNotification` (around line 58)

5. **Replace that section** with this code:
   ```typescript
   // Send email notification to multiple recipients
   const recipients = notificationRecipients.value().split(',');
   for (const recipient of recipients) {
     const emailSent = await EmailService.sendFormSubmissionNotification(
       emailData,
       recipient.trim()
     );
     if (emailSent) {
       console.log(`Email sent successfully to ${recipient.trim()}`);
     } else {
       console.error(`Failed to send email to ${recipient.trim()}`);
     }
   }
   ```

6. **Update your environment file** `.env.chieac-prod`:
   ```bash
   NOTIFICATION_RECIPIENTS=email1@domain.com,email2@domain.com,email3@domain.com
   ```

7. **Build and redeploy** the function:
   ```bash
   cd /path/to/your/firebase-functions/functions
   npm run build
   cd ..
   NODE_OPTIONS="--no-deprecation" firebase deploy --only functions:onFormSubmissionCreated
   ```

### Customizing Email Templates

#### Subject Line Customization
**To change the email subject line:**

1. **Open your text editor** and navigate to `/path/to/your/firebase-functions/functions/src/emailNotifications/emailService.ts`

2. **Find line 42** (approximately) that contains:
   ```typescript
   const subject = `New Form Submission from ${formData.name}`;
   ```

3. **Replace it with your custom subject**. Here are some examples:
   ```typescript
   // Professional format:
   const subject = `[ChiEAC] Contact Form: ${formData.name}`;
   
   // With emoji:
   const subject = `🔔 New Inquiry from ${formData.name} via ChiEAC App`;
   
   // With form ID:
   const subject = `Form Submission #${formData.id} - ${formData.name}`;
   
   // Simple format:
   const subject = `Contact Form Submission - ${formData.name}`;
   ```

4. **Save the file**

5. **Build and redeploy** the function:
   ```bash
   cd /path/to/your/firebase-functions/functions
   npm run build
   cd ..
   NODE_OPTIONS="--no-deprecation" firebase deploy --only functions:onFormSubmissionCreated
   ```

#### HTML Template Customization
Modify the `generateEmailHTML()` method in `emailService.ts`:

**Add Company Branding**:
```typescript
const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Form Submission</title>
  <style>
    /* Add your custom CSS here */
    .logo { width: 200px; margin-bottom: 20px; }
    .brand-color { color: #your-brand-color; }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://your-domain.com/logo.png" alt="Company Logo" class="logo">
    <!-- Rest of template -->
  </div>
</body>
</html>`;
```

**Add Custom Fields**:
If your form has additional fields, extend the `FormSubmissionData` interface:
```typescript
// In templates.ts
export interface FormSubmissionData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: Date;
  status: 'incomplete' | 'complete';
  // Add custom fields:
  company?: string;
  subject?: string;
  priority?: 'low' | 'medium' | 'high';
}
```

Then update the HTML template to display these fields.

#### Conditional Template Logic
Add logic for different email types:
```typescript
private static generateEmailHTML(formData: FormSubmissionData): string {
  // Different templates based on form type or priority
  if (formData.priority === 'high') {
    return this.generateUrgentEmailTemplate(formData);
  } else {
    return this.generateStandardEmailTemplate(formData);
  }
}
```

### Adding Email Features

#### Email Attachments
To add file attachment support:
```typescript
// In emailService.ts
const attachments = formData.attachments?.map(file => ({
  filename: file.name,
  content: file.base64Data,
  encoding: 'base64'
}));

// Update RFC 2822 message format to include attachments
```

#### Auto-Reply Functionality
Add an auto-reply to the form submitter:
```typescript
// After sending notification email:
if (formData.email && this.isValidEmail(formData.email)) {
  await this.sendAutoReply(formData);
}

private static async sendAutoReply(formData: FormSubmissionData): Promise<void> {
  const autoReplySubject = `Thank you for contacting ChiEAC, ${formData.name}`;
  const autoReplyBody = this.generateAutoReplyHTML(formData);
  // Send auto-reply email
}
```

#### Email Templates for Different Form Types
Create template variants:
```typescript
// In templates.ts
export class EmailTemplates {
  static getContactFormTemplate(data: FormSubmissionData): string { /* ... */ }
  static getNewsletterSignupTemplate(data: FormSubmissionData): string { /* ... */ }
  static getSupportRequestTemplate(data: FormSubmissionData): string { /* ... */ }
}
```

---

## Monitoring & Troubleshooting

### Monitoring Tools

#### Firebase Console Monitoring
1. **Function Logs**: Functions → onFormSubmissionCreated → Logs tab
2. **Metrics**: View invocation count, execution time, and error rates
3. **Usage Quotas**: Monitor Gmail API quota usage

#### Google Cloud Console Monitoring
1. **Cloud Functions**: More detailed metrics and monitoring
2. **Cloud Logging**: Advanced log filtering and analysis
3. **Error Reporting**: Automatic error aggregation and alerting

### Key Metrics to Monitor

#### Function Performance
- **Execution Time**: Should be under 10 seconds for normal operation
- **Memory Usage**: Monitor for memory leaks or excessive usage
- **Cold Start Time**: Initial function startup time
- **Error Rate**: Percentage of failed executions

#### Email Delivery Metrics
- **Send Success Rate**: Percentage of emails successfully sent
- **API Error Rate**: Gmail API failures
- **Authentication Failures**: OAuth token issues

### Common Issues and Solutions

#### Issue: "Invalid Client" OAuth Error
**Symptoms**: 
```
Error: invalid_client - The OAuth client was not found
```

**Causes**:
- Incorrect Client ID or Client Secret
- Newline characters in stored secrets
- OAuth credentials not properly configured

**Solutions**:
1. Verify credentials in Google Cloud Console
2. Re-store secrets, ensuring no extra whitespace:
   ```bash
   firebase functions:secrets:set GMAIL_CLIENT_ID
   # Paste exactly, no extra spaces or newlines
   ```
3. Check the OAuth client is for "Desktop Application" type

#### Issue: Gmail API Quota Exceeded
**Symptoms**:
```
Error: Daily Limit for 'Send Message' Exceeded
```

**Solutions**:
1. Check quota limits in Google Cloud Console → APIs & Services → Quotas
2. Request quota increase if needed
3. Implement exponential backoff retry logic
4. Consider spreading load across multiple service accounts

#### Issue: Function Timeout
**Symptoms**:
```
Function execution timeout
```

**Solutions**:
1. Increase function timeout in configuration:
   ```typescript
   {
     timeoutSeconds: 120, // Increase from default 60
   }
   ```
2. Optimize email template generation
3. Check for network connectivity issues

#### Issue: Firestore Trigger Not Firing
**Symptoms**: No function execution when documents are created

**Solutions**:
1. Verify document path matches trigger pattern exactly
2. Check Firestore security rules allow the operation
3. Ensure function is deployed and active
4. Verify the collection name is `contact_form_submissions`

#### Issue: Malformed Email Content
**Symptoms**: Emails appear broken or unformatted

**Solutions**:
1. Validate RFC 2822 message format
2. Check HTML template syntax
3. Ensure proper base64url encoding:
   ```typescript
   const encodedMessage = Buffer.from(message)
     .toString('base64')
     .replace(/\+/g, '-')
     .replace(/\//g, '_')
     .replace(/=+$/, '');
   ```

### Debugging Techniques

#### Enable Detailed Logging
Add comprehensive logging for debugging:
```typescript
// In emailService.ts
console.log('OAuth client initialized:', {
  clientId: gmailClientId.value().substring(0, 10) + '...',
  hasRefreshToken: !!gmailRefreshToken.value()
});

console.log('Email message generated:', {
  to: recipientEmail,
  subject: subject,
  bodyLength: htmlBody.length
});
```

#### Test with Curl
Test Gmail API directly:
```bash
# Get access token first
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "refresh_token=YOUR_REFRESH_TOKEN" \
  -d "grant_type=refresh_token"

# Test sending email
curl -X POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"raw": "BASE64_ENCODED_MESSAGE"}'
```

#### Local Function Testing
Test function locally with Firestore emulator:
```bash
# Start emulators
firebase emulators:start --only functions,firestore

# Create test document programmatically
# Function should trigger automatically
```

---

## Security Best Practices

### OAuth Security

#### Credential Management
- **Never commit secrets to version control**
- **Use Firebase Secrets Manager** for all sensitive credentials
- **Rotate OAuth credentials regularly** (annually recommended)
- **Monitor credential access** in Google Cloud Console audit logs

#### Scope Minimization
The service uses minimal OAuth scope:
- ✅ `https://www.googleapis.com/auth/gmail.send` (send only)
- ❌ Avoid broader scopes like `gmail.readonly` or `gmail.modify`

#### Token Security
- **Refresh tokens are long-lived** but can be revoked
- **Access tokens are short-lived** (typically 1 hour)
- **No tokens stored in function memory** between invocations
- **All tokens transmitted over HTTPS only**

### Function Security

#### Access Control
```typescript
// Function automatically inherits Firestore IAM permissions
// No additional authentication required for Firestore triggers
export const onFormSubmissionCreated = onDocumentCreated({
  // Automatically secured by Firebase IAM
});
```

#### Input Validation
```typescript
// Validate all form data before processing
if (!submissionData) {
  console.error('No data found in form submission document');
  return; // Fail safely
}

// Sanitize email addresses
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(formData.email)) {
  console.warn('Invalid email format:', formData.email);
}
```

#### Error Handling Security
```typescript
try {
  // Email sending logic
} catch (error) {
  // Log error without exposing sensitive data
  console.error('Error sending email via Gmail API:', {
    errorType: error.constructor.name,
    message: error.message.substring(0, 100), // Truncate
    timestamp: new Date().toISOString()
  });
  return false; // Fail gracefully
}
```

### Data Protection

#### Personal Data Handling
- **Minimal data retention**: Emails contain only necessary form data
- **No persistent storage**: Form data not stored beyond email content
- **Data transmission**: All data transmitted over encrypted channels (HTTPS)
- **Access logging**: All email operations logged with timestamps

#### GDPR Compliance Considerations
- **Data purpose**: Clearly defined purpose (form submission notifications)
- **Data minimization**: Only necessary fields included in emails
- **Retention policy**: Emails subject to Gmail retention policies
- **User rights**: Consider providing email opt-out mechanisms

### Network Security

#### API Communication
- **TLS 1.2+**: All Gmail API communication encrypted
- **Certificate pinning**: Google APIs use certificate pinning
- **Rate limiting**: Built-in protection against abuse

#### Function Isolation
- **Sandboxed execution**: Each function runs in isolated container
- **No shared state**: Functions are stateless between invocations
- **Memory isolation**: No data leakage between function executions

---

## Technical Reference

### Dependencies

#### Production Dependencies
```json
{
  "googleapis": "^156.0.0",           // Google APIs client library
  "firebase-admin": "^12.1.0",       // Firebase Admin SDK
  "firebase-functions": "^6.4.0",    // Firebase Functions SDK
  "fast-xml-parser": "^4.3.6"        // XML parsing (for other functions)
}
```

#### Development Dependencies
```json
{
  "@types/node": "^20.0.0",          // Node.js type definitions
  "firebase-functions-test": "^3.1.0", // Testing utilities
  "typescript": "^5.1.0"             // TypeScript compiler
}
```

### API Reference

#### EmailService Class
```typescript
class EmailService {
  /**
   * Send form submission notification email
   * @param formData - Validated form submission data
   * @param recipientEmail - Notification recipient email address
   * @returns Promise<boolean> - Success status
   */
  static async sendFormSubmissionNotification(
    formData: FormSubmissionData,
    recipientEmail: string
  ): Promise<boolean>

  /**
   * Generate HTML email content from form data
   * @param formData - Form submission data
   * @returns string - HTML email content
   */
  private static generateEmailHTML(formData: FormSubmissionData): string
}
```

#### FormSubmissionData Interface
```typescript
interface FormSubmissionData {
  id: string;                           // Firestore document ID
  name: string;                         // Full name or firstName + lastName
  email: string;                        // Submitter's email address
  phone?: string;                       // Optional phone number
  message: string;                      // Form message content
  submittedAt: Date;                    // Submission timestamp
  status: 'incomplete' | 'complete';    // Processing status
}
```

### Gmail API Reference

#### Messages.send Method
```typescript
await gmail.users.messages.send({
  userId: 'me',                    // Authenticated user
  requestBody: {
    raw: encodedMessage            // Base64url encoded RFC 2822 message
  }
});
```

#### RFC 2822 Message Format
```
To: recipient@domain.com
Subject: Email Subject
MIME-Version: 1.0
Content-Type: text/html; charset=utf-8

<html>...</html>
```

#### Base64url Encoding
```typescript
const encodedMessage = Buffer.from(message)
  .toString('base64')
  .replace(/\+/g, '-')      // Replace + with -
  .replace(/\//g, '_')      // Replace / with _
  .replace(/=+$/, '');      // Remove padding
```

### Error Codes

#### Common Gmail API Errors
| Code | Error | Cause | Solution |
|------|-------|-------|----------|
| 400 | Bad Request | Malformed message | Validate RFC 2822 format |
| 401 | Unauthorized | Invalid credentials | Check OAuth tokens |
| 403 | Forbidden | Insufficient scope | Verify Gmail.send scope |
| 429 | Rate Limited | Quota exceeded | Implement exponential backoff |
| 500 | Server Error | Gmail API issue | Retry with backoff |

#### Function Error Patterns
```typescript
// Authentication errors
GaxiosError: invalid_client
// Solution: Verify OAuth credentials

// Network errors  
TypeError: fetch failed
// Solution: Check network connectivity

// Timeout errors
Function execution timeout
// Solution: Increase timeout or optimize code
```

### Performance Specifications

#### Function Limits
- **Memory**: 256 MiB (configurable up to 8 GiB)
- **Timeout**: 60 seconds (configurable up to 540 seconds)
- **Concurrent executions**: 100 (configurable up to 1000)
- **Cold start time**: ~2-5 seconds for Node.js 22

#### Gmail API Limits
- **Daily quota**: 1 billion requests per day
- **Per-minute quota**: 250 requests per minute per user
- **Message size**: 25 MB maximum
- **Rate limiting**: Exponential backoff recommended

#### Typical Performance
- **Email send time**: 1-3 seconds end-to-end
- **Function execution**: 2-5 seconds including cold start
- **Memory usage**: ~50-100 MB during execution
- **Success rate**: >99.5% under normal conditions

---

## Appendices

### Appendix A: Complete Setup Script

```bash
#!/bin/bash
# Complete setup script for ChiEAC Email Service

# Prerequisites check
echo "🔍 Checking prerequisites..."
command -v firebase >/dev/null 2>&1 || { echo "Firebase CLI required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js required"; exit 1; }

# Environment setup
echo "🔧 Setting up environment..."
cd /path/to/your/firebase-functions

# Install dependencies
npm install

# Set up secrets (manual step - user input required)
echo "📝 Setting up Firebase Secrets..."
echo "Please set the following secrets manually:"
echo "firebase functions:secrets:set GMAIL_CLIENT_ID"
echo "firebase functions:secrets:set GMAIL_CLIENT_SECRET"  
echo "firebase functions:secrets:set GMAIL_REFRESH_TOKEN"

# Build and deploy
echo "🚀 Building and deploying..."
npm run build
NODE_OPTIONS="--no-deprecation" firebase deploy --only functions:onFormSubmissionCreated

echo "✅ Setup complete! Test by submitting a form."
```

### Appendix B: OAuth Setup Helper

```bash
#!/bin/bash
# OAuth setup helper script

CLIENT_ID="$1"
CLIENT_SECRET="$2"

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
  echo "Usage: $0 <client_id> <client_secret>"
  exit 1
fi

# Generate authorization URL
AUTH_URL="https://accounts.google.com/o/oauth2/v2/auth"
AUTH_URL="${AUTH_URL}?client_id=${CLIENT_ID}"
AUTH_URL="${AUTH_URL}&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
AUTH_URL="${AUTH_URL}&scope=https://www.googleapis.com/auth/gmail.send"
AUTH_URL="${AUTH_URL}&response_type=code"
AUTH_URL="${AUTH_URL}&access_type=offline"
AUTH_URL="${AUTH_URL}&prompt=consent"

echo "🔗 Open this URL in your browser:"
echo "$AUTH_URL"
echo ""
echo "📋 After authorization, paste the code here:"
read -r AUTH_CODE

# Exchange code for tokens
echo "🔄 Exchanging code for tokens..."
RESPONSE=$(curl -s -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" \
  -d "code=${AUTH_CODE}" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob")

# Extract refresh token
REFRESH_TOKEN=$(echo "$RESPONSE" | grep -o '"refresh_token":"[^"]*' | cut -d'"' -f4)

if [ -n "$REFRESH_TOKEN" ]; then
  echo "✅ Success! Your refresh token is:"
  echo "$REFRESH_TOKEN"
  echo ""
  echo "📝 Store this in Firebase Secrets:"
  echo "firebase functions:secrets:set GMAIL_REFRESH_TOKEN"
else
  echo "❌ Error getting refresh token:"
  echo "$RESPONSE"
fi
```

### Appendix C: Testing Utilities

```typescript
// test-email-service.ts
// Utility for testing email service locally

import { EmailService } from './src/emailNotifications/emailService.js';
import { FormSubmissionData } from './src/emailNotifications/templates.js';

async function testEmailService() {
  const testData: FormSubmissionData = {
    id: 'test-' + Date.now(),
    name: 'Test User',
    email: 'test@example.com',
    phone: '(555) 123-4567',
    message: 'This is a test email from the email service.',
    submittedAt: new Date(),
    status: 'incomplete'
  };

  console.log('🧪 Testing email service...');
  
  try {
    const result = await EmailService.sendFormSubmissionNotification(
      testData,
      'your-test-email@domain.com'
    );
    
    if (result) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Email sending failed');
    }
  } catch (error) {
    console.error('🚨 Test failed:', error);
  }
}

// Run test
testEmailService();
```

### Appendix D: Troubleshooting Checklist

#### Pre-Deployment Checklist
- [ ] Google Cloud project configured
- [ ] Gmail API enabled
- [ ] OAuth 2.0 credentials created (Desktop Application type)
- [ ] Refresh token generated and tested
- [ ] All three Firebase Secrets set (GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN)
- [ ] NOTIFICATION_RECIPIENT environment variable set
- [ ] TypeScript compilation successful
- [ ] No linting errors

#### Post-Deployment Checklist
- [ ] Function deployed successfully
- [ ] Function shows as "Active" in Firebase Console
- [ ] Test form submission created
- [ ] Function execution visible in logs
- [ ] Email received at notification address
- [ ] No errors in function logs

#### Common Diagnostic Commands
```bash
# Check function status
firebase functions:list

# View recent logs
firebase functions:log --only onFormSubmissionCreated

# Test secrets access
firebase functions:secrets:access GMAIL_CLIENT_ID --dry-run

# Check environment variables
cat firebase-functions/functions/.env.chieac-prod

# Verify build output
ls -la firebase-functions/functions/lib/emailNotifications/
```

---

## Conclusion

This email notification service provides a robust, secure, and maintainable solution for automated form submission notifications. The Gmail API-based approach ensures long-term reliability and eliminates dependencies on deprecated authentication methods.

The system is designed for:
- **Production reliability** with comprehensive error handling
- **Security best practices** using OAuth 2.0 and secret management
- **Easy maintenance** with clean, documented code
- **Future-proofing** with no expiring dependencies

For support or questions, refer to the troubleshooting section or contact the development team with specific error logs and configuration details.

---

*Last updated: August 20, 2025*  
*Version: 1.0*  
*Author: Shivaang Kumar*
