# Open Clock Web - Architecture Guide

## Overview
Open Clock Web is a React-based renderer for OpenClockStandard (.ocs) files. It displays analog clocks with multiple layers including backgrounds, text, hands, and images.

## Project Structure

```
src/
├── components/          # React UI components
│   ├── App.tsx         # Main application component
│   ├── EntryArea.tsx   # File upload/drag-drop area
│   ├── TimeCustomizer.tsx # Time control panel
│   └── ...
├── Clock/              # Clock rendering system
│   ├── index.tsx       # Main Clock component
│   ├── Layer.tsx       # Generic layer renderer
│   ├── TextLayer.tsx   # Text/DateTime layer renderer
│   ├── ImageLayer.tsx  # Image layer renderer
│   ├── HandLayer/      # Clock hand renderers
│   └── ...
├── open-clock/         # OCS schema and compatibility
├── styles/             # CSS files
└── ...
```

## Key Concepts

### 1. OCS File Processing Pipeline
1. **File Upload** → User drops .ocs file
2. **Parsing** → `parser.ts` validates JSON against schema
3. **Asset Decoding** → `useAssets.ts` converts base64 images to blob URLs
4. **Layer Rendering** → Each layer type renders independently
5. **SVG Output** → Final clock rendered as SVG

### 2. Layer System
Each OCS layer is rendered by a specific component:
- **TextLayer**: Handles text and date/time display
- **ImageLayer**: Renders background and foreground images
- **HandLayer**: Renders clock hands (SVG sprites or images)

### 3. Scaling Strategy
- **Layer Component**: Only handles rotation transforms
- **Individual Layers**: Handle their own scaling internally
  - TextLayer: Uses `scale` for fontSize calculation
  - ImageLayer: Uses `scale` for width/height calculation
  - HandLayer: Uses `scale` for hand sizing

### 4. Background vs Foreground Images
- **Background Images**: Fill entire viewBox, ignore positioning
- **Foreground Images**: Respect OCS scale and positioning

## Common Patterns

### Adding a New Layer Type
1. Create renderer component in `src/Clock/`
2. Add to `layerTypes` mapping in `Layer.tsx`
3. Handle scaling internally, not via SVG transforms

### Error Handling
- Use `useAssetWarnings` for missing assets
- Display user-friendly error messages
- Provide actionable solutions (e.g., font upload)

### State Management
- **TimeContext**: Global time state (live/custom)
- **AssetWarningContext**: Asset error tracking
- Local state for UI interactions

## Development Guidelines

### Do's
- ✅ Handle scaling in individual layer components
- ✅ Use TypeScript interfaces from `open-clock/index.ts`
- ✅ Test with sample OCS files in `public/sample-clocks/`
- ✅ Follow existing naming conventions

### Don'ts
- ❌ Apply SVG scale transforms in Layer component
- ❌ Use arbitrary scaling factors (like 0.8)
- ❌ Mix UI logic with rendering logic
- ❌ Ignore OCS specification properties

## Testing
- Unit tests in `src/__tests__/`
- Sample OCS files for integration testing
- Visual regression testing with different clock designs

## Build System
- **Rollup**: Bundling and development server
- **TypeScript**: Type checking and compilation
- **PostCSS**: CSS processing
- **Yarn**: Package management (NOT npm)