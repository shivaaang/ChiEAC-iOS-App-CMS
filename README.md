# ChiEAC CMS - Content Management System

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.0-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-teal.svg)](https://tailwindcss.com/)

A sophisticated, modern content management system for ChiEAC, featuring advanced team management, content operations, and a professional dark-themed interface with comprehensive CRUD capabilities.

## 🌟 Features Overview

| Module | Description |
|--------|-------------|
| **Team Management** | Advanced team and member management with split-view layouts |
| **Core Work Management** | Drag-and-drop reorderable core work items |
| **Impact Stats Management** | Statistical data management with real-time updates |
| **Programs Management** | Educational programs and course management |
| **Articles Management** | Content management for articles and publications |
| **Authentication System** | Firebase-powered secure authentication |

## Team Management System

The Team Management module includes:

### Core Features
- **Split-Layout Views**: 70-30 team view, 60-40 member view
- **Visual Selection States**: Orange/amber theming with hover effects
- **Clickable Cards**: Interactive cards with visual indicators
- **Member Count Display**: Real-time member counts per team
- **Confirmation Dialogs**: Delete confirmations with impact details

### Interface Features
- **Responsive Layouts**: Grid systems that adapt to selections
- **Visual Indicators**: Arrows and action hints for user guidance
- **Consistent Styling**: Orange-amber color scheme throughout
- **Smooth Transitions**: 300ms animations for state changes
- **Typography System**: Consistent font hierarchy

### Functionality
- **Dual-Panel System**: Team and member detail panels
- **State Management**: Proper state handling when switching contexts
- **Drag-and-Drop**: Reorderable items with Firebase sync
- **Real-Time Updates**: Changes reflected immediately
- **Expert Mode**: Direct Firestore field editing

## 🛠 Technical Architecture

### Core Technologies
```typescript
Frontend Stack:
├── React 18.3         // React with modern features
├── TypeScript 5.0+    // Type safety and modern JavaScript  
├── Vite 5.0          // Build tool with HMR
├── Tailwind CSS v4   // Utility-first CSS framework
└── React Router 6    // Client-side routing

Backend & Services:
├── Firebase v10      // Firebase SDK
├── Firestore        // NoSQL database
├── Firebase Auth     // Authentication system
└── Firebase Hosting  // Deployment platform

Libraries:
├── @hello-pangea/dnd // Drag-and-drop functionality
├── React Beautiful DnD // Reordering interactions
└── Custom Hooks      // Reusable state management
```

### Design System
```css
/* ChiEAC Professional Color Palette */
Primary Colors:
├── Orange: #f97316 (orange-500)
├── Amber: #f59e0b (amber-500)  
├── Slate: #0f172a (slate-900)
└── Gradient: from-orange-500/20 to-amber-500/20

Interactive States:
├── Hover: border-orange-500/40
├── Selected: border-orange-500/50
├── Shadow: shadow-orange-500/20
└── Backdrop: backdrop-blur-sm
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project with Firestore and Auth enabled
- Modern browser with ES2022 support

### 1. Clone and Install
```bash
git clone [repository-url]
cd cms-chieac
npm install
```

### 2. Firebase Configuration
Create your Firebase configuration in `src/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 3. Firestore Collections Setup
The CMS expects these Firestore collections:

```typescript
// Collection Structure
├── teams/                    // Team documents
│   ├── {teamId}
│   │   ├── team_name: string
│   │   ├── team_code: string  
│   │   ├── team_description: string
│   │   └── order: number
│
├── teamMembers/              // Team member documents  
│   ├── {memberId}
│   │   ├── member_name: string
│   │   ├── member_title: string
│   │   ├── member_team: string
│   │   ├── member_bio: string
│   │   ├── member_image_url: string
│   │   └── order: number
│
├── home_coreWork/           // Core work items
├── home_impactStats/        // Impact statistics
├── programs/                // Educational programs
└── medium_articles/         // Articles and content
```

### 4. Development Commands
```bash
# Start development server with HMR
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and format
npm run lint
npm run format
```

## 📁 Project Architecture

```
src/
├── components/              # Reusable UI components
│   ├── Layout.tsx          # Main application layout
│   └── ui/                 # Shared UI components
│
├── pages/                  # Page-level components
│   ├── Dashboard.tsx       # Analytics dashboard
│   ├── TeamManager.tsx     # Advanced team management
│   ├── CoreWorkManager.tsx # Core work operations
│   ├── ProgramsManager.tsx # Programs management
│   └── ArticlesManager.tsx # Content management
│
├── types/                  # TypeScript definitions
│   └── index.ts           # All data models and interfaces
│
├── config/                 # Configuration files
│   └── firebase.ts        # Firebase initialization
│
├── hooks/                  # Custom React hooks
│   ├── useTeams.ts        # Team management state
│   └── useFirestore.ts    # Firestore operations
│
├── utils/                  # Utility functions
│   ├── validation.ts      # Form validation helpers
│   └── constants.ts       # App-wide constants
│
└── styles/                 # Global styles and Tailwind config
    ├── globals.css        # Global CSS variables
    └── components.css     # Component-specific styles
```

## 🎨 Team Management Features Deep Dive

### Split-Layout System
```typescript
// Dynamic layout calculations
const teamLayoutClass = `${selectedTeamForView || teamRightPanelMode ? 'w-[70%]' : 'w-full'}`;
const memberLayoutClass = `${selectedMemberForView || rightPanelMode ? 'w-[60%]' : 'w-full max-w-4xl'}`;
```

### Visual Selection States
```typescript
// Professional selection styling
const teamCardClass = isSelected 
  ? 'border-orange-500/50 shadow-2xl shadow-orange-500/20 bg-gradient-to-br from-slate-900/80 to-slate-800/60'
  : 'border-slate-700/50 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/15';
```

### State Management
```typescript
// Advanced state management for complex workflows
const [selectedTeamForView, setSelectedTeamForView] = useState<Team | null>(null);
const [selectedMemberForView, setSelectedMemberForView] = useState<TeamMember | null>(null);
const [teamRightPanelMode, setTeamRightPanelMode] = useState<'view' | 'edit' | null>(null);
const [rightPanelMode, setRightPanelMode] = useState<'view' | 'edit' | null>(null);
```

## 📊 Data Models

### Team Interface
```typescript
interface Team {
  id: string;
  team_name: string;
  team_code: string;
  team_description: string;
  order: number;
}
```

### Team Member Interface
```typescript
interface TeamMember {
  id: string;
  member_name: string;
  member_title: string;
  member_team: string;
  member_bio: string;
  member_image_url: string;
  order: number;
}
```

## 🔐 Authentication & Security

- **Firebase Authentication**: Secure email/password authentication
- **Protected Routes**: Route guards prevent unauthorized access
- **Session Management**: Automatic session handling with refresh
- **Secure API**: All Firestore operations are authenticated

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Environment Variables
```env
# .env.production
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

**Built with ❤️ for ChiEAC** | Professional CMS Solution | React + TypeScript + Firebase
