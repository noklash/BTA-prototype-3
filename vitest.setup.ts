import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// `globals: false` is enabled in vitest.config.ts, so React Testing Library's
// automatic cleanup hook is not registered for us.
afterEach(() => {
  cleanup()
})
