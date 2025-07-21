# Project Structure

## Root Directory
- `src/` - Main source code
- `public/` - Static assets (fonts, sample clocks)
- `schemas/` - JSON Type Definition schemas for OpenClockStandard
- `hands/` - SVG hand assets for clock rendering
- `dist/` - Build output (generated)

## Source Organization (`src/`)

### Core Application
- `index.tsx` - Entry point with CSS imports and React root
- `TimeContext.tsx` - Global time state management with custom/live time support
- `parser.ts` - Clock file parsing utilities
- `fonts.ts` & `fonts.css` - Font loading and management
- `hands.svg` - SVG sprite for clock hands

### Components (`src/components/`)
- `App.tsx` - Main application component
- `TimeCustomizer.tsx` - Time control panel (live/custom time)
- `SampleDropdown.tsx` - Sample clock file selector
- `FontCacheMenu.tsx` - Font management interface
- `Toast.tsx` & `ToastContainer.tsx` - Notification system
- `EntryArea.tsx` - File upload/drag-drop area
- `DarkModeToggle.tsx` - Theme switcher
- `FontUploadModal.tsx` - Font upload dialog
- `Fullscreenable.tsx` - Fullscreen wrapper
- `MultipleClocks.tsx` - Multi-clock display

### Clock Rendering (`src/Clock/`)
- `index.tsx` - Main clock renderer
- `Layer.tsx` - Base layer component
- `TextLayer.tsx` - Text rendering layer
- `ImageLayer.tsx` - Image rendering layer
- `HandLayer/` - Clock hand rendering components
- `LayerProps.ts` - Shared layer type definitions
- `useAssets.ts` - Asset loading hook
- `useFontCheck.ts` - Font availability checking
- `AssetWarningContext.tsx` - Asset error handling
- `clock.css` - Clock-specific styles

### Styling (`src/styles/`)
- `style.css` - Global application styles
- `components/` - Component-specific CSS modules:
  - `time-customizer.css`
  - `preview.css`
  - `sample-dropdown.css`
  - `toast.css`
  - `font-cache.css`
  - `modal.css`
  - And others for each UI component

### Generated Code
- `src/open-clock/` - Auto-generated TypeScript types from JTD schema
- `src/font-names.json` - Generated font list

## Key Patterns
- **CSS Organization**: Modular CSS files imported in index.tsx with descriptive comments
- **Context Usage**: TimeContext for global time state, AssetWarningContext for error handling
- **Hook Pattern**: Custom hooks for asset loading, font checking, time management
- **Layer Architecture**: Extensible layer system for different clock elements
- **Schema-Driven**: TypeScript types generated from JSON schemas for type safety