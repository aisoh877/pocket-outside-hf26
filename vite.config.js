import { defineConfig } from 'vite';
import { assetPaths } from './src/paths.js';
const { home: base } = assetPaths(process.env.SITE_BASE_PATH || '/');
export default defineConfig({ base, server: { fs: { strict: true } }, build: { target: 'es2022', chunkSizeWarningLimit: 1500 } });
