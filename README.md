# Electron + Vite + React Template

A modern Electron desktop application template with Vite, React, and TypeScript.

## Features

- **Electron** - Desktop application framework
- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **TanStack Router** - Type-safe routing
- **shadcn/ui** - Accessible UI components (Button, DropdownMenu)
- **Tailwind CSS** - Utility-first CSS framework
- **Theme Support** - Native system theme detection (dark/light)
- **i18n** - Internationalization with react-i18next (English & French)
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **GitHub Actions** - CI/CD pipeline

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/nesalia-inc/electron-vite-react-template.git

# Install dependencies
pnpm install

# Approve build scripts (for electron)
pnpm approve-builds
```

### Development

```bash
# Start development server
pnpm dev
```

The app will open at `http://127.0.0.1:8888`

### Build

```bash
# Build for production
pnpm build
```

### Testing

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

### Linting

```bash
# Run linter
pnpm lint

# Run type checking
pnpm typecheck
```

## Project Structure

```
src/
├── main/              # Electron main process
│   └── index.ts       # Main process entry point
├── preload/           # Preload scripts
│   └── index.ts       # Preload script entry point
└── renderer/          # React application
    ├── src/
    │   ├── components/    # React components
    │   │   └── ui/        # shadcn/ui components
    │   ├── hooks/         # Custom React hooks
    │   ├── i18n/          # Internationalization
    │   ├── lib/           # Utilities
    │   ├── stores/        # Zustand stores
    │   └── main.tsx       # Renderer entry point
    └── index.html         # HTML entry point
```

## Configuration

### electron.vite.config.ts

Configuration for electron-vite build tool.

### tailwind.config.js

Tailwind CSS configuration with custom theme variables.

### tsconfig.json

TypeScript configuration (node + web split).

### vitest.config.ts

Vitest testing configuration.

## Theme Support

The template includes a theme provider that supports:

- **Light** - Light mode
- **Dark** - Dark mode
- **System** - Follows system preference

The theme automatically detects system theme changes in real-time.

## Internationalization

The template supports multiple languages:

- English (en)
- French (fr)

The language is automatically detected from the system locale.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Electron |
| Build Tool | Vite |
| UI | React |
| Language | TypeScript |
| State | TanStack Query + Zustand |
| Routing | TanStack Router |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| i18n | react-i18next |
| Testing | Vitest |
| Linting | ESLint |

## License

MIT

## Author

Nesalia
