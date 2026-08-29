import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['test/setup.js']  // <-- no ./ prefix
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})