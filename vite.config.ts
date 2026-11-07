import react from '@vitejs/plugin-react';
import { URL, fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import localhostCerts from 'vite-plugin-localhost-certs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '',
  plugins: mode === 'tauri' ? [react()] : [localhostCerts(), react()],
  build: mode === 'tauri' ? { outDir: 'dist-tauri', copyPublicDir: false } : undefined,
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
  },
  server: {
    host: '0.0.0.0',
    port: 8888,
    strictPort: mode === 'tauri',
    watch: mode === 'tauri' ? { ignored: ['**/src-tauri/**'] } : undefined,
  },
}));
