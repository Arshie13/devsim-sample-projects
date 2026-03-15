// @ts-nocheck
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';

if (typeof window !== 'undefined') {
  // Mock window.location
  const mockLocation = {
    href: 'http://localhost:5173/',
    pathname: '/',
    search: '',
    origin: 'http://localhost:5173',
  };

  Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
  });

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock IntersectionObserver
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: vi.fn(),
    callback: null,
  })),
});

// Mock ResizeObserver
Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(globalThis, 'localStorage', {
  writable: true,
  configurable: true,
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(globalThis, 'sessionStorage', {
  writable: true,
  configurable: true,
  value: sessionStorageMock,
});

// Global beforeAll hook
beforeAll(async () => {
  // Set up any global test resources
});

// Global afterEach hook
afterEach(async () => {
  // Clean up after each test
  vi.clearAllMocks();
});

// Global afterAll hook
afterAll(async () => {
  // Clean up global test resources
});
