import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Set root to current directory since files are flat
  define: {
    'process.env': {} // Mencegah crash "process is not defined" di browser
  },
  build: {
    outDir: 'dist',
  }
});