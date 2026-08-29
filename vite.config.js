import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true
    // setupFiles removed - not needed for basic tests
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})