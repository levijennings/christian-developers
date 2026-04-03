# Christian Developers QA Test Suite

Complete testing framework for the Christian Developers Next.js 14 community platform with Supabase and Stripe integration.

## Overview

This test suite provides comprehensive coverage across:
- Unit tests with Vitest (80% coverage threshold)
- Component tests with React Testing Library
- End-to-end tests with Playwright
- API integration tests
- Type checking with TypeScript

## Quick Start

### Installation

```bash
cd /sessions/optimistic-sweet-carson/christian-developers

# Install all dependencies including testing tools
npm install
```

### Running Tests

```bash
# Run all unit tests once
npm run test:unit

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run E2E tests in debug mode (step through)
npm run test:e2e:debug

# Run E2E tests with UI (interactive mode)
npm run test:e2e:ui

# Run all tests sequentially
npm run test:all
```

## Test Structure

### Unit Tests & Validation Tests

Located in `src/__tests__/`:

#### Validation Tests (`lib/validations.test.ts`)
- Tests for all 12 Zod schemas
- Input validation and error handling
- Type coercion and default values
- Edge cases and boundary conditions

**Coverage:**
- jobListingSchema
- companySchema
- applicationSchema
- forumPostSchema
- forumReplySchema
- prayerRequestSchema
- mentorshipRequestSchema
- profileUpdateSchema
- paginationSchema
- upvoteSchema
- checkoutSchema
- mentorshipStatusSchema
- searchSchema

### API Tests

#### Jobs API (`api/jobs.test.ts`)
- List jobs with filters (type, experience, location, salary, tech stack)
- Create job (company owner only)
- Apply to job
- Free tier rate limiting (5 applications/month)
- Pagination and search functionality

#### Forum API (`api/forum.test.ts`)
- List posts with category filters
- Create post (authentication required)
- Create nested replies
- Upvote/downvote toggle
- Moderation and author permissions

#### Prayer API (`api/prayer.test.ts`)
- Create prayer requests (with anonymous option)
- Record prayers (one per user per request)
- Prayer count tracking
- Status management (active, answered, closed)
- Prayer request filtering and sorting

#### Mentorship API (`api/mentorship.test.ts`)
- Request mentorship from experienced developers
- Accept/decline requests (mentor only)
- Prevent self-mentoring
- Status management (pending, active, completed, cancelled)
- Matching and compatibility checks

### Component Tests

Located in `src/__tests__/components/`:

#### JobCard Component (`jobs/JobCard.test.tsx`)
- Rendering of job details
- User interactions (apply, save)
- Styling and responsiveness
- Accessibility features
- Edge cases (long titles, missing data)

#### ForumPostCard Component (`community/ForumPostCard.test.tsx`)
- Post title, excerpt, category, tags
- Upvote/downvote functionality
- Author information display
- Time formatting
- Responsive design
- Accessibility compliance

#### PrayerRequestCard Component (`community/PrayerRequestCard.test.tsx`)
- Prayer request display
- Prayer count and status indicators
- Pray button functionality
- Anonymous request handling
- Status management UI
- Prayer momentum tracking

### End-to-End Tests

Located in `e2e/`:

#### Home Page (`home.spec.ts`)
- Landing page loads successfully
- Navigation displays correctly
- Links to main sections work
- Responsive design (mobile, tablet, desktop)
- No console errors

#### Jobs Page (`jobs.spec.ts`)
- Jobs list displays
- Filtering by job type, location, experience level
- Search functionality
- Pagination
- Job detail navigation
- Apply button interactions
- Tech stack and salary display
- Faith alignment indicators

#### Community Page (`community.spec.ts`)
- Forum posts display
- Category filtering
- Prayer requests listing
- Prayer count and status display
- Navigation between sections
- Responsive layouts
- Search functionality

## Test Helpers and Utilities

### Mock Factories (`src/test/helpers.ts`)

Create consistent mock data for testing:

```typescript
import {
  createMockJob,
  createMockCompany,
  createMockProfile,
  createMockForumPost,
  createMockPrayerRequest,
  createMockMentorshipPair,
  generateUUID,
  wait,
} from '@/test/helpers';

// Create a mock job with overrides
const job = createMockJob({
  title: 'Custom Job Title',
  salary_min: 100000,
});

// Generate unique IDs
const userId = generateUUID();
```

### Supabase Mocks (`src/test/mocks/supabase.ts`)

Mock Supabase client for testing:

```typescript
import { createMockSupabaseClient, createMockQueryBuilder } from '@/test/mocks/supabase';

// Create a mock client
const supabase = createMockSupabaseClient({
  job_listings: [mockJob1, mockJob2],
  profiles: [mockProfile1, mockProfile2],
});

// Use with your tests
const { data } = await supabase.from('job_listings').select().limit(10);
```

### Global Setup (`src/test/setup.ts`)

Automatic setup for all tests:
- Jest-DOM matchers
- Next.js router/navigation mocks
- Supabase client mocks
- Stripe mocks
- Environment variables

## Coverage Configuration

Coverage is configured in `vitest.config.ts`:

- **Threshold:** 80% for lines, functions, branches, and statements
- **Reporter:** Text, JSON, HTML, and LCOV formats
- **Excludes:** Test files, node_modules, setup files

View coverage reports:
```bash
# Generate and open HTML report
npm run test:coverage
# Open coverage/index.html in browser
```

## CI/CD Integration

GitHub Actions workflow (`.github/workflows/ci.yml`) runs:

1. **Linting** - Code quality checks
2. **Unit Tests** - Vitest with coverage
3. **Type Checking** - TypeScript compilation
4. **E2E Tests** - Playwright suite
5. **Build** - Next.js production build
6. **Security Audit** - Dependency vulnerability scan

Tests run on:
- Node 18.x and 20.x
- Ubuntu latest
- All commits to main/develop branches
- All pull requests

## Configuration Files

### Vitest Configuration (`vitest.config.ts`)
- TypeScript support
- jsdom environment for DOM testing
- Path aliases (@/)
- Coverage with v8 provider
- 80% coverage threshold

### Playwright Configuration (`playwright.config.ts`)
- Multi-browser testing (Chromium, Firefox, WebKit)
- Mobile viewport testing (Pixel 5, iPhone 12)
- Screenshot and video on failure
- HTML reporter with artifacts
- Automatic server startup

## Best Practices

### Writing Tests

1. **Use descriptive test names**
   ```typescript
   it('should prevent user from mentoring themselves', () => {
     // Test logic
   });
   ```

2. **Organize with describe blocks**
   ```typescript
   describe('JobCard Component', () => {
     describe('Rendering', () => {
       it('should render job title', () => { });
     });
   });
   ```

3. **Create fixtures for common data**
   ```typescript
   const mockJob = createMockJob();
   const mockAuthor = createMockProfile();
   ```

4. **Test user behavior, not implementation**
   ```typescript
   // Good: Test what user sees
   await userEvent.click(applyButton);

   // Avoid: Testing internal state
   expect(component.state.applicationCount).toBe(1);
   ```

### Mocking External Services

1. **Always mock Supabase**
   ```typescript
   const supabase = createMockSupabaseClient();
   vi.mocked(createClient).mockReturnValue(supabase);
   ```

2. **Mock API responses consistently**
   ```typescript
   supabase.from('jobs').select.mockResolvedValue({
     data: [mockJob],
     error: null,
   });
   ```

3. **Test error scenarios**
   ```typescript
   supabase.from('jobs').select.mockRejectedValue(
     new Error('Database error')
   );
   ```

## Debugging Tests

### Vitest Debugging

```bash
# Run single test file
npm run test src/__tests__/lib/validations.test.ts

# Run tests matching pattern
npm run test -- --grep "should filter jobs"

# Run with logging
npm run test -- --reporter=verbose
```

### Playwright Debugging

```bash
# Interactive UI mode
npm run test:e2e:ui

# Debug mode (step through)
npm run test:e2e:debug

# Run single test file
npx playwright test e2e/home.spec.ts

# Run single test
npx playwright test e2e/home.spec.ts -g "should load landing page"
```

### View Test Reports

```bash
# After running E2E tests
npx playwright show-report

# View coverage HTML report
open coverage/index.html
```

## Common Issues and Solutions

### Tests failing locally but passing in CI

1. Check Node version (use nvm to match CI version)
2. Clear cache: `rm -rf node_modules .next && npm install`
3. Ensure environment variables are set
4. Check for timing issues (use `waitFor` instead of arbitrary delays)

### E2E tests timing out

1. Increase timeout: `test.setTimeout(60000)` for long operations
2. Ensure dev server is running: `npm run dev` in separate terminal
3. Check for missing `await` on async operations
4. Verify network connectivity for external APIs

### Coverage not meeting threshold

1. Run `npm run test:coverage` to see detailed report
2. Open `coverage/index.html` to find gaps
3. Write tests for uncovered lines/branches
4. Remember to test error paths, not just happy paths

## Test Data

All test data is self-contained with mock factories. No external databases needed.

Mock IDs follow UUID v4 format: `550e8400-e29b-41d4-a716-446655440001`

Timestamps use ISO 8601: `2024-01-15T10:30:00.000Z`

## Performance

Run tests with performance benchmarking:

```bash
npm run test:unit -- --reporter=verbose 2>&1 | grep "ms"
```

Typical performance:
- Validation tests: < 100ms
- Component tests: < 500ms each
- E2E tests: 2-5 seconds per test
- Full suite: ~5-10 minutes

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure coverage stays above 80%
3. Run full test suite: `npm run test:all`
4. Check E2E tests pass on all browsers
5. Verify no console errors

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Zod Validation](https://zod.dev/)

## Support

For test-related issues:
1. Check this guide first
2. Review test examples in `src/__tests__/`
3. Check GitHub Actions logs for CI failures
4. Run locally with `npm run test:e2e:debug` for E2E issues
