import '@testing-library/jest-dom'
import React from 'react'

// Mock next/navigation
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
}

const mockUseRouter = () => mockRouter

vi.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock localStorage (only in browser environment)
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

// Only define localStorage if window is available (jsdom environment)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
  })
}

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return React.createElement('a', { href }, children)
  },
}))

// Reset mocks before each test
beforeEach(() => {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear()
  }
  vi.clearAllMocks()
})
