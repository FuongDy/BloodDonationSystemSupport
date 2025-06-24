import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Giữ nguyên cấu hình server và proxy của bạn
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  resolve: {
    alias: [
      {
        // Use a regular expression to ensure we only match the exact 'mapbox-gl' module
        find: /^mapbox-gl$/,
        replacement: 'mapbox-gl/dist/mapbox-gl.js'
      }
    ]
  }
})