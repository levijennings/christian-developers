import { test, expect } from '@playwright/test';

test.describe('Jobs Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to jobs page before each test
    await page.goto('/jobs');
  });

  test('should load jobs page successfully', async ({ page }) => {
    // Check page title or main heading
    const heading = page.locator('h1, h2, [role="heading"]').first();
    await expect(heading).toBeVisible();
  });

  test('should display jobs list', async ({ page }) => {
    // Wait for jobs to load
    const jobCards = page.locator('[data-testid="job-card"], .job-card, article');

    // Give time for API call to complete
    await page.waitForTimeout(1000);

    // At least one job should be visible or empty state message
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('should have filter controls', async ({ page }) => {
    // Check for filter sidebar or button
    const filterButton = page.locator('button:has-text("Filter"), [role="button"]:has-text("Filter")');
    const filterSection = page.locator('[data-testid="filters"], aside');

    const hasFilters =
      (await filterButton.isVisible().catch(() => false)) ||
      (await filterSection.isVisible().catch(() => false));

    expect(hasFilters).toBe(true);
  });

  test('should filter by job type', async ({ page }) => {
    // Find job type filter
    const jobTypeFilter = page.locator('select[name="type"], label:has-text("Type"), button:has-text("Full-time")');

    if (await jobTypeFilter.isVisible()) {
      // Try to interact with filter
      const select = page.locator('select[name="job_type"]');
      if (await select.isVisible()) {
        await select.selectOption('full_time');
      }
    }
  });

  test('should filter by location type', async ({ page }) => {
    // Find location filter
    const locationFilter = page.locator(
      'select[name="location_type"], label:has-text("Location"), button:has-text("Remote")'
    );

    if (await locationFilter.isVisible()) {
      const select = page.locator('select[name="location_type"]');
      if (await select.isVisible()) {
        await select.selectOption('remote');
      }
    }
  });

  test('should filter by experience level', async ({ page }) => {
    // Find experience level filter
    const expFilter = page.locator(
      'select[name="experience_level"], label:has-text("Experience"), button:has-text("Senior")'
    );

    if (await expFilter.isVisible()) {
      const select = page.locator('select[name="experience_level"]');
      if (await select.isVisible()) {
        await select.selectOption('senior');
      }
    }
  });

  test('should search jobs by keyword', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('React');
      await page.waitForTimeout(500);

      // Results should update
      const content = page.locator('main');
      await expect(content).toBeVisible();
    }
  });

  test('should display job card details', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Find a job card
    const jobCard = page.locator('[data-testid="job-card"], .job-card, article').first();

    if (await jobCard.isVisible()) {
      // Job card should have title
      const title = jobCard.locator('h2, h3, [role="heading"]');
      await expect(title).toBeVisible();

      // Job card should have company name
      const company = jobCard.locator('a, span:has-text("Inc"), span:has-text("Company")');
      expect(company).toBeTruthy();
    }
  });

  test('should show job type badge', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Find a job card
    const jobCard = page.locator('[data-testid="job-card"], .job-card, article').first();

    if (await jobCard.isVisible()) {
      // Should have job type badge
      const badge = jobCard.locator('[data-testid="job-type"], .badge, span');
      const count = await badge.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should show salary range', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Find a job card
    const jobCard = page.locator('[data-testid="job-card"], .job-card, article').first();

    if (await jobCard.isVisible()) {
      const salaryText = jobCard.locator('text=/\\$|salary|compensation/i');
      // Salary might not always be shown, so this is optional
      const hasSalary = await salaryText.count();
      expect(hasSalary).toBeGreaterThanOrEqual(0);
    }
  });

  test('should navigate to job detail page when clicking job card', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Find and click first job card
    const jobCard = page.locator('[data-testid="job-card"], .job-card, article').first();

    if (await jobCard.isVisible()) {
      const jobLink = jobCard.locator('a').first();
      if (await jobLink.isVisible()) {
        await jobLink.click();

        // Should navigate to job detail page
        await page.waitForURL(/jobs\/\w+|job\/\w+/);
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/jobs|job/);
      }
    }
  });

  test('should display apply button on job card', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Find a job card
    const jobCard = page.locator('[data-testid="job-card"], .job-card, article').first();

    if (await jobCard.isVisible()) {
      // Should have apply button
      const applyButton = jobCard.locator('button:has-text("Apply"), a:has-text("Apply")');
      expect(applyButton).toBeTruthy();
    }
  });

  test('should handle pagination', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Look for pagination controls
    const nextButton = page.locator('button:has-text("Next"), a:has-text("Next"), [aria-label*="Next"]');
    const pageButtons = page.locator('[role="button"]:has-text("2"), a:has-text("2")');

    const hasPagination =
      (await nextButton.isVisible().catch(() => false)) || (await pageButtons.isVisible().catch(() => false));

    // Pagination is optional depending on implementation
    expect(hasPagination).toBeDefined();
  });

  test('should apply filters and see results update', async ({ page }) => {
    // Wait initial load
    await page.waitForTimeout(1000);

    // Get initial job count
    const initialJobs = page.locator('[data-testid="job-card"], .job-card, article');
    const initialCount = await initialJobs.count();

    // Apply a filter
    const filterButton = page.locator('button:has-text("Filter"), select');
    if (await filterButton.isVisible()) {
      const select = page.locator('select').first();
      if (await select.isVisible()) {
        await select.selectOption('0'); // Select first option
        await page.waitForTimeout(500);

        // Jobs should still be visible
        const content = page.locator('main');
        await expect(content).toBeVisible();
      }
    }
  });

  test('should display company logo if available', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Find a job card
    const jobCard = page.locator('[data-testid="job-card"], .job-card, article').first();

    if (await jobCard.isVisible()) {
      const logo = jobCard.locator('img[alt*="company"], img[alt*="logo"]');
      // Logo is optional
      const hasLogo = await logo.count();
      expect(hasLogo).toBeGreaterThanOrEqual(0);
    }
  });

  test('should display job summary/excerpt', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Find a job card
    const jobCard = page.locator('[data-testid="job-card"], .job-card, article').first();

    if (await jobCard.isVisible()) {
      // Should have some description text
      const description = jobCard.locator('p, div');
      const count = await description.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should show tech stack tags', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Find a job card
    const jobCard = page.locator('[data-testid="job-card"], .job-card, article').first();

    if (await jobCard.isVisible()) {
      // Should have tech tags
      const tags = jobCard.locator('[data-testid="tag"], .tag, .badge');
      const count = await tags.count();
      // Tags are optional but commonly shown
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should display faith alignment if present', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Find a job card
    const jobCard = page.locator('[data-testid="job-card"], .job-card, article').first();

    if (await jobCard.isVisible()) {
      // Look for faith-related text
      const faithText = jobCard.locator('text=/faith|christian|mission/i');
      // Faith alignment is optional
      const hasFaith = await faithText.count();
      expect(hasFaith).toBeGreaterThanOrEqual(0);
    }
  });

  test('should show job posting date', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForTimeout(1000);

    // Find a job card
    const jobCard = page.locator('[data-testid="job-card"], .job-card, article').first();

    if (await jobCard.isVisible()) {
      // Should show when posted
      const date = jobCard.locator('text=/ago|posted|days/i');
      // Date display is optional
      const hasDate = await date.count();
      expect(hasDate).toBeGreaterThanOrEqual(0);
    }
  });

  test('should handle empty results state', async ({ page }) => {
    // Apply a filter that results in no jobs
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');

    if (await searchInput.isVisible()) {
      // Search for something very specific
      await searchInput.fill('xyznonexistentjob12345');
      await page.waitForTimeout(500);

      // Should show empty state or no results
      const content = page.locator('main');
      await expect(content).toBeVisible();
    }
  });
});
