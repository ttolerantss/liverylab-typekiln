import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-font': ['opentype.js', 'svg-pathdata'],
          'vendor-utils': ['jszip', 'zustand'],
        },
      },
    },
  },
})
