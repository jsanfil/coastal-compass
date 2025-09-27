import { beforeAll, vi } from 'vitest'

// Mock environment variables
beforeAll(() => {
    vi.stubEnv('RAPIDAPI_KEY', 'test-rapidapi-key')
    vi.stubEnv('RAPIDAPI_HOST', 'test-rapidapi-host')
    vi.stubEnv('OPENROUTER_API_KEY', 'test-openrouter-key')
})

// Mock fetch globally
global.fetch = vi.fn()

// Mock console methods to reduce noise during testing
global.console = {
    ...console,
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
}
