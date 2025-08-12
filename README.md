# Open Clock Web

A modern web renderer for the [OpenClockStandard][] format. Upload .ocs files to preview analog clocks with real-time updates, custom fonts, and interactive controls.

## Features
- ✅ **OCS File Rendering** - Full support for OpenClockStandard format
- ✅ **Real-time Clock Display** - Live time updates with smooth animations  
- ✅ **Custom Time Control** - Set specific times for preview
- ✅ **Dark/Light Mode** - Theme switching with persistent preferences
- ✅ **Font Management** - Upload and cache custom fonts
- ✅ **Asset Error Handling** - User-friendly warnings for missing assets
- ✅ **Fullscreen Mode** - Immersive clock viewing experience
- ✅ **Sample Clock Library** - Built-in examples to explore

## Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Yarn](https://yarnpkg.com/) package manager

### Setup
```bash
git clone <repository-url>
cd open-clock-web
yarn install
```

### Commands
- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn lint` - Run ESLint and TypeScript checks
- `yarn test` - Run test suite

### Architecture
See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed development guidelines and project structure.

## Further info

Contact [mlc][].

[openclockstandard]: https://github.com/orff/OpenClockStandard/
[node.js]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[jtd-codegen]: https://jsontypedef.com/docs/jtd-codegen/#installing-jtd-codegen
[mlc]: https://github.com/mlc/
