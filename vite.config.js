import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { API_BASE_URL } from './src/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: API_BASE_URL, 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/demo'),
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
