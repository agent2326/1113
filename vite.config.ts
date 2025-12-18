
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  define: {
    // API_KEY must be obtained exclusively from the environment variable process.env.API_KEY
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});
