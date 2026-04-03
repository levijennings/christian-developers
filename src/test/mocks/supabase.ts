import { vi } from 'vitest';

/**
 * Mock Supabase client for testing
 */
export const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
  from: vi.fn((table: string) => mockQueryBuilder(table)),
};

/**
 * Mock query builder for fluent Supabase queries
 */
function mockQueryBuilder(tableName: string) {
  return {
    select: vi.fn(function () {
      this._select = true;
      return this;
    }),
    insert: vi.fn(function () {
      this._insert = true;
      return this;
    }),
    update: vi.fn(function () {
      this._update = true;
      return this;
    }),
    delete: vi.fn(function () {
      this._delete = true;
      return this;
    }),
    eq: vi.fn(function () {
      return this;
    }),
    neq: vi.fn(function () {
      return this;
    }),
    gt: vi.fn(function () {
      return this;
    }),
    gte: vi.fn(function () {
      return this;
    }),
    lt: vi.fn(function () {
      return this;
    }),
    lte: vi.fn(function () {
      return this;
    }),
    or: vi.fn(function () {
      return this;
    }),
    contains: vi.fn(function () {
      return this;
    }),
    range: vi.fn(function () {
      return this;
    }),
    order: vi.fn(function () {
      return this;
    }),
    single: vi.fn(function () {
      return Promise.resolve({ data: null, error: null });
    }),
    limit: vi.fn(function () {
      return this;
    }),
    count: vi.fn(function () {
      return this;
    }),
  };
}

/**
 * Create a query builder with mock data
 */
export function createMockQueryBuilder<T>(data: T[] = [], error: any = null) {
  return {
    select: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    insert: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    update: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    delete: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    eq: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    neq: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    gt: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    gte: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    lt: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    lte: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    or: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    contains: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    range: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    order: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    limit: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    count: vi.fn(function () {
      return createMockQueryBuilder(data, error);
    }),
    single: vi.fn(function () {
      return Promise.resolve({
        data: data && data.length > 0 ? data[0] : null,
        error,
      });
    }),
  };
}

/**
 * Mock Supabase client with data
 */
export function createMockSupabaseClient(defaultData: Record<string, any[]> = {}) {
  return {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    },
    from: vi.fn((table: string) => {
      const data = defaultData[table] || [];
      return createMockQueryBuilder(data);
    }),
  };
}
