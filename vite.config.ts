import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Critical: Fallback to process.env.API_KEY to ensure it works even if not in .env file (e.g. system env)
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
      // Robustly check for Base URL in various formats, default to empty string to avoid 'undefined' issues
      'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || env.VITE_API_BASE_URL || process.env.API_BASE_URL || '')
    }
  };
});