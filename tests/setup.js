import { config } from '@vue/test-utils'
import { vi } from 'vitest'

config.global.stubs = {
  RouterLink: { template: '<a><slot /></a>' }
}

window.alert = vi.fn()