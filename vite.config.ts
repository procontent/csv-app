import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime']
    }
  },
  resolve: {
    alias: {
      react: 'react',
      'react/jsx-runtime': 'react/jsx-runtime'
    }
  },
  server: {
    port: 5173,
  },
});
