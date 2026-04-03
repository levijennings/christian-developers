import { expect, afterEach, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  })),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
    },
    from: vi.fn(),
  })),
}));

// Mock Stripe
vi.mock('stripe', () => ({
  default: vi.fn(() => ({
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
    charges: {
      retrieve: vi.fn(),
    },
  })),
}));

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({})),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.STRIPE_SECRET_KEY = 'sk_test_123456789';

// Global test utilities
global.fetch = vi.fn();

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
