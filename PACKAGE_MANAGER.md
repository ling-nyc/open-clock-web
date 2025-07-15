# Package Manager

This project uses **Yarn** as its package manager, not npm.

## Quick Start

```bash
yarn install
yarn dev
```

## Why Yarn?

- Better handling of peer dependencies (like the React version conflict with pure-react-carousel)
- Lockfile format that works better with this project's dependencies
- Configured via `.yarnrc.yml`

## Commands

- `yarn install` - Install dependencies
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run linting

**Important:** Do not use `npm install` or other npm commands with this project.