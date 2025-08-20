# ChiEAC Firebase Functions

A professional, serverless backend system for the ChiEAC Content Management System, built with Firebase Functions v2, TypeScript, and Node.js 22.

## 🚀 Quick Start

```bash
# Install dependencies
cd firebase-functions/functions
npm install

# Deploy all functions
cd firebase-functions
NODE_OPTIONS="--no-deprecation" firebase deploy --only functions
```

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Deployed Functions](#deployed-functions)
4. [Documentation](#documentation)
5. [Development Setup](#development-setup)
6. [Project Structure](#project-structure)
7. [Production Status](#production-status)
8. [Quick Testing](#quick-testing)

---

## Overview

### What This System Provides

The ChiEAC Firebase Functions system provides two core services:

1. **📰 Article Management System**: Automated Medium RSS feed processing and synchronization
2. **📧 Email Notification System**: Professional email notifications using Gmail OAuth 2.0

### Key Features

- **Serverless Architecture**: Built on Firebase Functions v2 with automatic scaling
- **Production Ready**: Comprehensive error handling, monitoring, and professional structure
- **TypeScript**: Full type safety with modular architecture
- **OAuth Security**: Gmail API integration with refresh token management
- **Real-time Processing**: Firestore triggers for immediate email notifications
- **Automated Scheduling**: Hourly article ingestion with smart duplicate prevention

---

## System Architecture

### High-Level Overview
```
Medium RSS Feed → Article Processing → Firestore Database → CMS Display
Form Submissions → Email Triggers → Gmail API → Professional Notifications
```

### Detailed Project Structure
```
firebase-functions/
├── functions/
│   ├── src/
│   │   ├── articleManager/          # Article & Medium RSS management
│   │   │   ├── index.ts            # Module exports
│   │   │   ├── types.ts            # Article-specific types
│   │   │   ├── mediumProcessor.ts  # RSS feed processing
│   │   │   └── firestoreSync.ts    # Firestore operations
│   │   ├── emailNotifications/      # Email notification system
│   │   │   ├── index.ts            # Module exports
│   │   │   ├── types.ts            # Email-specific types
│   │   │   ├── config.ts           # Email configuration
│   │   │   ├── emailService.ts     # Gmail API service
│   │   │   ├── templates.ts        # Email templates
│   │   │   └── formSubmissionTrigger.ts  # Firestore triggers
│   │   ├── shared/                  # Shared utilities & types
│   │   │   ├── index.ts            # Shared exports
│   │   │   └── types.ts            # Common type definitions
│   │   └── index.ts                # Main function exports
│   ├── utils/                       # Development & setup utilities
│   │   ├── refresh-oauth-completely.js  # OAuth refresh script
│   │   ├── setup-oauth.js              # OAuth setup script
│   │   ├── manage-email-config.js      # Email config management
│   │   └── setup-secrets.js            # Firebase secrets setup
│   ├── lib/                         # Compiled JavaScript (auto-generated)
│   ├── .env.chieac-prod            # Environment variables
│   ├── package.json                # Dependencies
│   └── tsconfig.json               # TypeScript configuration
├── README.md                        # Main project documentation
├── README_Articles.md               # Article system documentation
├── README_Email.md                  # Email system documentation
└── firebase.json                    # Firebase configuration
```

---

## Deployed Functions

| Function | Type | Purpose | Status |
|----------|------|---------|--------|
| **hourlyMediumIngest** | Scheduled | Fetches Medium articles every hour | ✅ Active |
| **fetchMediumNow** | HTTP | Manual article fetch trigger | ✅ Active |
| **getIngestStatus** | HTTP | Article system health check | ✅ Active |
| **onFormSubmissionCreated** | Firestore Trigger | Send emails on form submission | ✅ Active |

### Function URLs
- **Status Check**: `https://us-central1-chieac-prod.cloudfunctions.net/getIngestStatus`
- **Manual Fetch**: `https://us-central1-chieac-prod.cloudfunctions.net/fetchMediumNow`
- **Form Emails**: Triggered automatically on Firestore writes

---

## Documentation

### 📚 Specialized Documentation

| Document | Coverage | Use When |
|----------|----------|----------|
| **[📰 README_Articles.md](./README_Articles.md)** | Complete article management system | Setting up Medium RSS, troubleshooting articles, customizing processing |
| **[📧 README_Email.md](./README_Email.md)** | Complete email notification system | Setting up Gmail OAuth, configuring emails, troubleshooting delivery |

### 🎯 Quick Reference

**For Article Issues** → [📰 README_Articles.md](./README_Articles.md)
- RSS feed problems
- Article processing errors
- Firestore sync issues
- Performance optimization

**For Email Issues** → [📧 README_Email.md](./README_Email.md)
- OAuth setup and refresh
- Email delivery problems
- Template customization
- Gmail API configuration

---

## Development Setup

### Prerequisites
- Node.js 22+
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Firestore enabled
- Gmail OAuth credentials (for email features)

### Quick Setup
```bash
# 1. Clone and setup
cd firebase-functions/functions
npm install

# 2. Configure Firebase
firebase login
firebase use chieac-prod

# 3. Build and deploy
npm run build
cd ../
NODE_OPTIONS="--no-deprecation" firebase deploy --only functions
```

### Environment Variables
```bash
# Gmail OAuth (required for emails)
# See README_Email.md for complete setup
```

---

## Project Structure

### 🏗️ Module Organization

#### **articleManager/** - Medium RSS Processing
```
articleManager/
├── mediumProcessor.ts      # RSS feed fetching & parsing
├── firestoreSync.ts        # Database synchronization
├── types.ts               # Article-specific interfaces
└── index.ts               # Module exports
```

**Key Features**:
- Hourly automated processing
- Smart duplicate prevention
- Image extraction from HTML
- Tag normalization
- Distributed locking system

#### **emailNotifications/** - Gmail Integration
```
emailNotifications/
├── emailService.ts         # Gmail API integration
├── templates.ts           # Professional email templates
├── formSubmissionTrigger.ts # Firestore triggers
├── config.ts              # OAuth configuration
└── index.ts               # Module exports
```

**Key Features**:
- Gmail OAuth 2.0 with refresh tokens
- Professional HTML/text email templates
- Chicago timezone handling
- Automatic phone field formatting
- Real-time Firestore triggers

#### **shared/** - Common Utilities
```
shared/
├── types.ts               # Common TypeScript interfaces
└── index.ts               # Shared exports
```

**Purpose**: Common utilities and types used across modules for consistent interfaces and shared functionality.

#### **utils/** - Development Tools
```
utils/
├── refresh-oauth-completely.js  # OAuth token refresh
├── setup-oauth.js              # Initial OAuth setup
├── manage-email-config.js      # Email configuration
└── setup-secrets.js            # Firebase secrets management
```

**Purpose**: Development and setup utilities (not deployed) for OAuth management, configuration setup, and development helpers.

### 📦 Benefits of This Structure

1. **Modularity**: Each feature is self-contained in its own folder
2. **Scalability**: Easy to add new modules without affecting existing code
3. **Maintainability**: Clear separation of concerns and responsibilities
4. **Type Safety**: Proper TypeScript organization with module-specific types
5. **Clean Imports**: Clear import paths and proper module exports
6. **Professional Standards**: Follows Node.js and Firebase best practices

### 🔧 Development Workflow

#### Adding New Features
1. **Article Management**: Work in `articleManager/` folder
2. **Email Features**: Work in `emailNotifications/` folder
3. **Shared Code**: Add common utilities to `shared/` folder
4. **Setup Scripts**: Use utilities in `utils/` folder
5. **Main Exports**: Update `src/index.ts` for new functions

#### Adding New Modules
1. Create new folder under `src/`
2. Add `index.ts` for module exports
3. Add `types.ts` for module-specific types
4. Implement functionality in separate files
5. Export from main `src/index.ts`
6. Update documentation

---

## Production Status

### 🟢 System Health
- **Article Processing**: ✅ Hourly ingestion active
- **Email Notifications**: ✅ Real-time delivery active
- **Error Monitoring**: ✅ Comprehensive logging
- **Performance**: ✅ All functions under 60s execution time

### 📊 Current Metrics
- **RSS Feed**: `https://chieac.medium.com/feed`
- **Processing Rate**: ~1.5 articles/second
- **Email Delivery**: ~2-5 seconds per email
- **Memory Usage**: 100-200 MiB typical
- **Function Regions**: us-central1

### 🔧 Monitoring
```bash
# Check system health
curl https://us-central1-chieac-prod.cloudfunctions.net/getIngestStatus

# View function logs
firebase functions:log --limit 50

# Check specific function
firebase functions:log --only hourlyMediumIngest
```

---

## Quick Testing

### 🧪 Test Commands

#### Article System
```bash
# Check article system health
curl https://us-central1-chieac-prod.cloudfunctions.net/getIngestStatus

# Trigger manual article fetch
curl -X POST https://us-central1-chieac-prod.cloudfunctions.net/fetchMediumNow \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Test RSS feed directly
curl https://chieac.medium.com/feed | head -50
```

#### Email System
```bash
# Test OAuth token (requires setup)
node utils/refresh-oauth-completely.js

# Check email configuration
firebase functions:config:get

# Test form submission (create test document in Firestore)
```

### 📈 Expected Responses

#### ✅ Healthy Status Response
```json
{
  "success": true,
  "message": "Medium ingest functions are healthy",
  "timestamp": "2025-08-20T20:47:46.813Z",
  "functions": {
    "hourlyMediumIngest": "Scheduled every 60 minutes",
    "fetchMediumNow": "Available for manual triggers",
    "getIngestStatus": "Available for status checks"
  }
}
```

#### ✅ Successful Article Fetch
```json
{
  "success": true,
  "message": "Medium RSS ingest completed successfully",
  "data": {
    "added": 10,
    "updated": 2,
    "total": 12
  },
  "skipped": false
}
```

---

## Support & Troubleshooting

### 🆘 Common Issues

| Issue | Quick Fix | Detailed Guide |
|-------|-----------|----------------|
| Article processing fails | Check RSS feed availability | [📰 README_Articles.md](./README_Articles.md#troubleshooting) |
| Email delivery problems | Refresh OAuth tokens | [📧 README_Email.md](./README_Email.md#troubleshooting) |
| Function timeout errors | Check memory allocation | [📰 README_Articles.md](./README_Articles.md#performance-optimization) |
| Deployment failures | Clear build cache | Check build logs and retry deployment |

### 📞 Getting Help

1. **Check Status**: Run health check commands above
2. **Review Logs**: Use `firebase functions:log` 
3. **Consult Documentation**: Use specialized README files
4. **Check Function Console**: Firebase Console → Functions

---

## Development Workflow

### 🔄 Making Changes

#### Article System Changes
1. Edit files in `articleManager/`
2. Run `npm run build` to compile
3. Deploy with `firebase deploy --only functions:hourlyMediumIngest,functions:fetchMediumNow,functions:getIngestStatus`
4. Test with status endpoint

#### Email System Changes  
1. Edit files in `emailNotifications/`
2. Run `npm run build` to compile
3. Deploy with `firebase deploy --only functions:onFormSubmissionCreated`
4. Test with form submission

#### Adding New Features
1. Create new module in `src/`
2. Add exports to `src/index.ts`
3. Update documentation
4. Deploy and test

### 🏗️ Professional Standards
- **TypeScript**: Full type safety with proper interfaces
- **Modular Design**: Clear separation of concerns between modules
- **Error Handling**: Comprehensive try-catch blocks with proper logging
- **Documentation**: Keep README files updated with changes
- **Testing**: Use provided utility scripts for validation
- **Deployment**: Always build before deploying to catch compilation errors

---

## License & Contact

**Project**: ChiEAC Content Management System  
**Version**: 2.0 - Professional Architecture  
**Last Updated**: August 20, 2025  
**Author**: Shivaang Kumar  

For technical support, consult the specialized documentation linked above or review function logs for specific error details.

---

*This README serves as the central hub for ChiEAC Firebase Functions. For detailed technical information, please refer to the specialized documentation files linked throughout this document.*
