import { config } from '@vue/test-utils'

// Global test configuration
config.global.stubs = {
  // Stub RouterLink if using Vue Router
  RouterLink: true
}