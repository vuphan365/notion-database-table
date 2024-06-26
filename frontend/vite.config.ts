import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true }, // Change
  },
});
