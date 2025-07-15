import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import cssnano from 'cssnano';
import emitEJS from 'rollup-plugin-emit-ejs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import sizes from 'rollup-plugin-sizes';
import { terser } from 'rollup-plugin-terser';
import postcssEnv from 'postcss-preset-env';
import fs from 'fs';
import path from 'path';

const DEV = process.env.NODE_ENV === 'development';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const postCssPlugins = [postcssEnv];

if (!DEV) {
  postCssPlugins.push(cssnano({ preset: 'default' }));
}

// Custom plugin to copy files
function copyFiles() {
  return {
    name: 'copy-files',
    writeBundle() {
      // Function to copy directory recursively
      const copyDir = (src, dest) => {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);

          if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };

      // Copy public folder to dist
      if (fs.existsSync('public')) {
        copyDir('public', 'dist');
      }

      // Copy fonts folder to dist/fonts
      if (fs.existsSync('fonts')) {
        copyDir('fonts', path.join('dist', 'fonts'));
      }

      console.log('Static files copied successfully');
    },
  };
}

const plugins = [
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  nodeResolve({ extensions }),
  commonjs(),
  json(),
  babel({
    extensions,
    babelHelpers: 'runtime',
  }),
  postcss({
    extract: true,
    writeDefinitions: true,
    plugins: postCssPlugins,
  }),
  emitEJS({ src: 'src' }),
  copyFiles(),
  sizes(),
];

if (DEV) {
  plugins.push(
    serve({
      contentBase: ['dist', 'fonts', 'public'],
      open: true,
    })
  );
} else {
  plugins.push(terser());
}

export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: DEV ? 'inline' : true,
    entryFileNames: '[name].[hash].js',
  },
  plugins,
};
