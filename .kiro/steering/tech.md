# Technology Stack

## Build System & Package Management
- **Package Manager**: Yarn (NOT npm) - always use `yarn` commands
- **Build Tool**: Rollup with custom configuration
- **Development Server**: Rollup serve plugin with live reload
- **Bundling**: ESM format with hash-based filenames for production

## Core Technologies
- **Framework**: React 18.2.0 with TypeScript
- **Time Handling**: @js-joda/core for precise time management and timezone support
- **Schema Validation**: JSON Type Definition (JTD) with code generation
- **Styling**: PostCSS with preset-env, modular CSS files
- **Font Loading**: WebFontLoader for dynamic font management

## Development Tools
- **Linting**: ESLint with Airbnb TypeScript config + Prettier
- **Testing**: Jest with React Testing Library
- **Type Checking**: TypeScript with strict mode
- **Git Hooks**: Husky with lint-staged for pre-commit checks
- **Schema Generation**: jtd-codegen for TypeScript types from JSON schemas

## Common Commands
```bash
# Development
yarn dev              # Start dev server with watch mode
yarn build           # Production build
yarn lint            # Run ESLint and TypeScript checks

# Schema Management  
yarn gen-schema      # Regenerate TypeScript types from JTD schema

# Setup
yarn install         # Install dependencies
```

## Browser Support
Targets 95% US coverage, excludes IE 11, supports Firefox ESR and modern mobile browsers (Android 5+).

## Key Dependencies
- React ecosystem with hooks and context
- @js-joda for timezone-aware time handling
- base64-arraybuffer for asset processing
- number-to-words for text formatting
- pure-react-carousel for UI components