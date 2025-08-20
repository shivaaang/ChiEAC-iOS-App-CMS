# ChiEAC CMS - Content Management System

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.1-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-teal.svg)](https://tailwindcss.com/)

A React-based content management system built with TypeScript, Firebase, and Tailwind CSS. Provides modular architecture for team management, article content operations, and administrative functionality.

## Architecture Overview

### Technology Stack
- **Frontend**: React 19.1 with TypeScript 5.8, Vite 7.1 build system
- **Backend**: Firebase Firestore, Authentication, and Hosting
- **Styling**: Tailwind CSS v4.1 with custom design system
- **State Management**: Custom hooks with React state patterns
- **Routing**: React Router with protected route guards

### Core Modules

**TeamManager**: Complete team and member management system with CRUD operations, drag-and-drop reordering, confirmation workflows, and expert mode for direct Firestore field editing.

**ArticlesManager**: Article content management with pagination, inline editing, tag management, and comprehensive change tracking with confirmation dialogs.

**Shared Components**: Reusable UI components, form elements, confirmation dialogs, and layout systems with consistent styling patterns.

## Installation

### Prerequisites
- Node.js 18+ with npm or yarn
- Firebase project with Firestore and Authentication enabled
- Modern browser supporting ES2022

### Setup Process

1. **Clone and install dependencies**
   ```bash
   git clone [repository-url]
   cd cms-chieac
   npm install
   ```

2. **Configure Firebase**
   Create `.env` file with Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. **Initialize Firestore collections**
   Required collections: `teams`, `team_members`, `articles`, `core_work`, `impact_stats`, `programs`

4. **Development server**
   ```bash
   npm run dev
   ```

## Development Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # ESLint code analysis
npx tsc --noEmit     # TypeScript type checking
```

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx                    # Main application layout
│   ├── TeamManager/                  # Team management module
│   │   ├── TeamManager.tsx          # Main component
│   │   ├── components/              # UI components
│   │   ├── hooks/                   # State management hooks
│   │   ├── types.ts                 # TypeScript definitions
│   │   └── index.ts                 # Module exports
│   └── ArticlesManager/             # Article management module
│       ├── ArticlesManager.tsx      # Main component
│       ├── components/              # UI components
│       ├── hooks/                   # State management hooks
│       ├── types.ts                 # TypeScript definitions
│       └── index.ts                 # Module exports
├── pages/                           # Route components
├── config/                          # Firebase configuration
├── types/                           # Global type definitions
└── assets/                          # Static assets
```

## Component Architecture

### TeamManager Module
- **Modular Design**: Separate components for teams view, members view, forms, and dialogs
- **State Management**: useTeamManager hook for data operations, useTeamHandlers for event handling, useConfirmationHandlers for dialog workflows
- **Expert Mode**: Direct Firestore field editing with warning dialogs for advanced users
- **Drag-and-Drop**: Reordering functionality with confirmation workflows

### ArticlesManager Module
- **CRUD Operations**: Full create, read, update, delete functionality for articles
- **Pagination System**: Configurable page size with navigation controls
- **Inline Editing**: Form-based editing with change tracking and confirmation
- **Tag Management**: Dynamic tag addition and removal with validation

## Data Models

### Core Interfaces

```typescript
interface Team {
  id: string;
  team_name: string;
  team_code: string;
  team_description: string;
  order: number;
}

interface TeamMember {
  id: string;
  member_name: string;
  member_title: string;
  member_team: string;
  member_summary: string;
  member_summary_short: string;
  member_image_link?: string;
  order: number;
}

interface Article {
  id: string;
  title: string;
  publishedAt: Date;
  imageLink?: string;
  mediumLink?: string;
  articleTags: string[];
}
```

## Firebase Configuration

### Firestore Collections

**teams**: Team documents with name, code, description, and ordering
**team_members**: Member documents with team associations and metadata  
**articles**: Article documents with publication data and tag arrays
**core_work**: Core work items with descriptions and ordering
**impact_stats**: Statistical data with numbers and labels
**programs**: Educational programs with details and metadata

### Security Rules
Implement Firestore security rules to restrict access to authenticated users and appropriate read/write permissions based on user roles.

### Authentication
Firebase Authentication with email/password provider. Protected routes ensure authenticated access to all CMS functionality.

## Styling System

### Design Tokens
- **Primary Colors**: Orange (#f97316) and Amber (#f59e0b)
- **Background**: Slate color scale (#0f172a to #1e293b)
- **Interactive States**: Orange/amber variants with opacity levels
- **Typography**: System font stack with consistent sizing scale

### Component Patterns
- Consistent spacing using Tailwind's spacing scale
- Backdrop blur effects for modal overlays
- Gradient backgrounds for visual hierarchy
- Border radius standards for component consistency

## Deployment

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Environment Configuration
Production deployment requires environment variables configured in Firebase hosting settings or through deployment environment.

---

**Built with ❤️ for ChiEAC** | Professional CMS Solution | React + TypeScript + Firebase
