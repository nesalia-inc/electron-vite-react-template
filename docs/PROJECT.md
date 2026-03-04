# Electron + Vite Template Specification

## Overview

This document defines the specifications for an Electron desktop application template using Vite as the build tool.

## Technology Stack

| Category | Technology |
|----------|------------|
| UI Framework | React |
| Language | TypeScript |
| Build Tool (Renderer) | Vite |
| Packaging | electron-vite |
| State Management | TanStack Query + Zustand |
| Routing | TanStack Router |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Testing | Vitest |
| Logging | electron-log |
| IPC Pattern | orpc |

## Architecture

### Project Structure

```
electron-template/
├── electron/
│   ├── main/           # Main process
│   │   ├── index.ts    # Entry point
│   │   ├── ipc/       # IPC handlers
│   │   └── preload/   # Preload scripts
│   └── shared/        # Shared types between main/renderer
├── src/
│   ├── components/    # React components (including shadcn)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and helpers
│   ├── routes/        # TanStack Router routes
│   ├── stores/        # Zustand stores
│   ├── App.tsx        # Root component
│   └── main.tsx       # Renderer entry point
├── package.json
├── electron.vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── vitest.config.ts
```

### Process Model

- **Main Process**: Handles window management, native APIs, file system operations, and IPC communication
- **Preload Script**: Exposes safe APIs to renderer via contextBridge
- **Renderer Process**: React application running in Chromium

## Core Features

### IPC Communication

Communication between main and renderer processes uses `orpc` for type-safe IPC:

- Shared procedures between main and renderer
- Full type inference on both sides
- Simple function-based API

```typescript
// Main process
const procedures = {
  greet: () => 'Hello from main!',
};

// Renderer (auto-typed)
const { greet } = useElectronProcedures();
const result = await greet();
```

### State Management

- **Zustand**: Global client state (user preferences, UI state)
- **TanStack Query**: Server state (API calls, caching, synchronization)
- **TanStack Router**: Type-safe routing with file-based routing support

### UI Components

- **shadcn/ui**: Accessible, customizable component library built on Radix UI
- Components installed individually as needed
- Follows Tailwind CSS best practices

### Logging

- `electron-log` for main and preload processes
- Console logging in renderer (can be connected to main process logs)
- Log files stored in user data directory

### Styling

- Tailwind CSS for utility-first styling
- Dark/Light mode support via CSS variables
- shadcn/ui components use Tailwind CSS with CSS variables for theming

## Development Workflow

### Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production

# Electron
npm run electron:dev # Run Electron in dev mode
npm run electron:build # Build Electron app

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
```

### Environment Variables

```
VITE_DEV_SERVER_URL  # Development server URL
NODE_ENV             # Environment (development/production)
```

## Build Configuration

### electron-vite

Configuration handles:
- Main process build
- Preload script build
- Renderer build (Vite)
- Asset handling

### Packaging

Output formats:
- Windows: NSIS installer, portable exe
- macOS: DMG, zip
- Linux: AppImage, deb

## Testing Strategy

- Vitest for unit and integration tests
- Component testing with React Testing Library
- IPC communication tests (main process)

## Security Considerations

- Context isolation enabled
- Node integration disabled in renderer
- orpc handles IPC communication safely via preload
- CSP headers configured

## Future Considerations

- Auto-update mechanism (electron-updater)
- ESLint + Prettier configuration
- CI/CD pipeline
- Database integration (SQLite via better-sqlite3)
