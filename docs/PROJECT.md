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
| Styling | Tailwind CSS + CSS Variables |
| Theme | Native system theme (dark/light) |
| i18n | react-i18next |
| Testing | Vitest |
| Logging | electron-log |
| IPC Pattern | contextBridge + ipcRenderer |

## Architecture

### Project Structure

Following electron-vite recommended convention:

```
electron-vite-react-template/
├── src/
│   ├── main/
│   │   ├── index.ts    # Main process entry point
│   │   └── ...         # Main process modules
│   ├── preload/
│   │   ├── index.ts    # Preload script entry point
│   │   └── ...         # Preload modules
│   └── renderer/
│       ├── src/
│       │   ├── components/    # React components (including shadcn)
│       │   │   └── ui/       # shadcn/ui components
│       │   ├── hooks/         # Custom React hooks
│       │   ├── lib/           # Utilities and helpers
│       │   ├── routes/        # TanStack Router routes
│       │   ├── stores/        # Zustand stores
│       │   ├── i18n/          # i18n configuration and translations
│       │   ├── App.tsx        # Root component
│       │   └── main.tsx       # Renderer entry point
│       ├── index.html         # Renderer HTML entry
│       └── env.d.ts          # TypeScript declarations
├── tests/                    # Test files
│   ├── main/                # Main process tests
│   ├── preload/             # Preload script tests
│   └── renderer/            # Renderer tests
├── electron.vite.config.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.web.json
├── vitest.config.ts
└── .github/
    └── workflows/
        └── ci.yml           # CI: lint, type-check, test
```

**Default entry points (electron-vite auto-discovery):**
- Main process: `src/main/index.ts`
- Preload script: `src/preload/index.ts`
- Renderer: `src/renderer/index.html`

### Process Model

- **Main Process**: Handles window management, native APIs, file system operations, and IPC communication
- **Preload Script**: Exposes safe APIs to renderer via contextBridge
- **Renderer Process**: React application running in Chromium

## Core Features

### IPC Communication

Communication between main and renderer processes uses `contextBridge` pattern:

- Expose safe APIs to renderer via contextBridge
- Using @electron-toolkit/preload for Electron APIs
- Type-safe IPC with ipcRenderer.invoke

```typescript
// Preload
contextBridge.exposeInMainWorld('api', {
  getSystemTheme: () => ipcRenderer.invoke('get-system-theme')
})

// Renderer
const theme = await window.api.getSystemTheme()
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
- CSS variables for theming
- shadcn/ui components use Tailwind CSS with CSS variables

### Theme Support

Based on shadcn/ui theme provider:

- `ThemeProvider` component with system/dark/light modes
- `useTheme` hook for theme management
- `ModeToggle` component for user preference
- Native system theme detection via Electron `nativeTheme` API
- Real-time listener for OS theme changes
- Persist user preference in localStorage

### Internationalization (i18n)

- `react-i18next` for translations
- Support for multiple locales
- Language detection from system locale
- Lazy loading of translation files

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

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):

```yaml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
```

## Testing Strategy

- Vitest for unit and integration tests
- Component testing with React Testing Library
- IPC communication tests (main process)

## Security Considerations

- Context isolation enabled
- Node integration disabled in renderer
- contextBridge handles IPC communication safely via preload
- CSP headers configured

## Future Considerations

- Auto-update mechanism (electron-updater)
- ESLint + Prettier configuration
- CI/CD pipeline
- Database integration (SQLite via better-sqlite3)
