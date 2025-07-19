# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
npm run dev
# or
yarn dev

# Production build
npm run build
# or  
yarn build

# Start production server
npm run start
# or
yarn start

# Linting
npm run lint
# or
yarn lint
```

The development server runs on http://localhost:3000.

## Architecture Overview

This is a Next.js 13+ application with Firebase integration for authentication and data storage, using the App Router pattern.

### Core Technologies
- **Next.js 15.3.4** with App Router
- **React 19** with TypeScript
- **Firebase 11** for authentication and Firestore database  
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library with Radix UI primitives

### Project Structure
- `src/app/` - App Router pages and layouts using Next.js 13+ conventions
- `src/components/ui/` - shadcn/ui components (Button, etc.)
- `src/context/` - React contexts, primarily AuthContext for Firebase auth
- `src/firebase/` - Firebase configuration and service functions
  - `config.ts` - Firebase app initialization
  - `auth/` - Authentication functions (signIn, signup)
  - `firestore/` - Database operations (addData, getData)
- `src/lib/` - Utilities including `utils.ts` for className merging

### Authentication Flow
The app uses Firebase Auth with a React Context pattern:
1. `AuthContext` wraps the entire app in `layout.tsx`
2. Authentication state is managed via `onAuthStateChanged` listener
3. Auth functions in `src/firebase/auth/` handle sign-in/sign-up operations
4. Pages like `/signin` and `/signup` provide auth UI

### Firebase Configuration
Environment variables are required for Firebase:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Component System
- Uses shadcn/ui with `components.json` configuration
- Components are located in `@/components/ui/` 
- Class variance authority (cva) for component variants
- Tailwind merge via `cn()` utility function for className handling
- Lucide React for icons

### Development Notes
- TypeScript is configured with strict settings
- ESLint with Next.js config for code quality
- The project follows Next.js 13+ App Router conventions
- Firebase services are initialized once and exported for reuse
- Authentication context provides loading states during auth resolution