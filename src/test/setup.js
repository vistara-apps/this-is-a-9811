import '@testing-library/jest-dom'

// Mock environment variables for tests
global.process = {
  env: {
    NODE_ENV: 'test',
    VITE_OPENAI_API_KEY: 'test-key',
    VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
  }
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock crypto for security utilities
global.crypto = {
  getRandomValues: vi.fn(() => new Uint8Array(32)),
  subtle: {
    importKey: vi.fn(),
    encrypt: vi.fn(),
    decrypt: vi.fn(),
    deriveBits: vi.fn(),
  }
}

// Mock MediaRecorder for audio recording tests
global.MediaRecorder = vi.fn(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}))

// Mock navigator.mediaDevices
global.navigator = {
  ...global.navigator,
  mediaDevices: {
    getUserMedia: vi.fn(() => Promise.resolve({})),
  }
}
