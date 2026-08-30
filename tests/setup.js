import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Stub RouterLink so tests don't need vue-router
config.global.stubs = {
  RouterLink: { template: '<a><slot /></a>' }
}

// Mock localStorage for unit tests
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})