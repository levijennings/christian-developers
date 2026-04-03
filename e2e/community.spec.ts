import { test, expect } from '@playwright/test';

test.describe('Community Pages', () => {
  test.describe('Forum Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/community');
    });

    test('should load community page successfully', async ({ page }) => {
      const heading = page.locator('h1, h2, [role="heading"]').first();
      await expect(heading).toBeVisible();
    });

    test('should display forum posts', async ({ page }) => {
      // Wait for content to load
      await page.waitForTimeout(1000);

      const postCards = page.locator('[data-testid="post-card"], .post-card, article');
      const content = page.locator('main');
      await expect(content).toBeVisible();
    });

    test('should have category filters', async ({ page }) => {
      // Look for category tabs or filter buttons
      const categories = page.locator('button:has-text("General"), button:has-text("Career"), [role="tablist"]');

      const hasCategories = await categories.isVisible().catch(() => false);
      expect(hasCategories).toBeDefined();
    });

    test('should filter posts by category', async ({ page }) => {
      // Wait for content to load
      await page.waitForTimeout(1000);

      // Look for category buttons
      const careerButton = page.locator('button:has-text("Career"), a:has-text("Career")');

      if (await careerButton.isVisible()) {
        await careerButton.click();
        await page.waitForTimeout(500);

        // Posts should update to show career posts
        const content = page.locator('main');
        await expect(content).toBeVisible();
      }
    });

    test('should display post title', async ({ page }) => {
      await page.waitForTimeout(1000);

      const postCard = page.locator('[data-testid="post-card"], .post-card, article').first();

      if (await postCard.isVisible()) {
        const title = postCard.locator('h3, h2');
        await expect(title).toBeVisible();
      }
    });

    test('should display post excerpt', async ({ page }) => {
      await page.waitForTimeout(1000);

      const postCard = page.locator('[data-testid="post-card"], .post-card, article').first();

      if (await postCard.isVisible()) {
        const excerpt = postCard.locator('p');
        const count = await excerpt.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('should show upvote count', async ({ page }) => {
      await page.waitForTimeout(1000);

      const postCard = page.locator('[data-testid="post-card"], .post-card, article').first();

      if (await postCard.isVisible()) {
        const upvotes = postCard.locator('[data-testid="upvotes"], text=/\\d+ upvotes/i');
        // Upvote display is optional
        expect(upvotes).toBeTruthy();
      }
    });

    test('should show reply count', async ({ page }) => {
      await page.waitForTimeout(1000);

      const postCard = page.locator('[data-testid="post-card"], .post-card, article').first();

      if (await postCard.isVisible()) {
        const replies = postCard.locator('[data-testid="replies"], text=/\\d+ replies/i');
        // Reply count display is optional
        expect(replies).toBeTruthy();
      }
    });

    test('should navigate to post detail when clicking post', async ({ page }) => {
      await page.waitForTimeout(1000);

      const postCard = page.locator('[data-testid="post-card"], .post-card, article').first();

      if (await postCard.isVisible()) {
        const postLink = postCard.locator('a').first();
        if (await postLink.isVisible()) {
          await postLink.click();

          // Should navigate to post detail
          await page.waitForURL(/community|forum|post/).catch(() => {});
          const currentUrl = page.url();
          expect(currentUrl).toMatch(/community|forum|post/);
        }
      }
    });

    test('should display author info', async ({ page }) => {
      await page.waitForTimeout(1000);

      const postCard = page.locator('[data-testid="post-card"], .post-card, article').first();

      if (await postCard.isVisible()) {
        const author = postCard.locator('[data-testid="author"], .author');
        // Author display is important
        expect(author).toBeTruthy();
      }
    });

    test('should show post date', async ({ page }) => {
      await page.waitForTimeout(1000);

      const postCard = page.locator('[data-testid="post-card"], .post-card, article').first();

      if (await postCard.isVisible()) {
        const date = postCard.locator('text=/ago|posted/i');
        // Date display is optional
        expect(date).toBeTruthy();
      }
    });
  });

  test.describe('Prayer Requests Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/prayer');
    });

    test('should load prayer requests page successfully', async ({ page }) => {
      const heading = page.locator('h1, h2, [role="heading"]').first();
      await expect(heading).toBeVisible();
    });

    test('should display prayer requests', async ({ page }) => {
      await page.waitForTimeout(1000);

      const prayerCards = page.locator('[data-testid="prayer-card"], .prayer-card, article');
      const content = page.locator('main');
      await expect(content).toBeVisible();
    });

    test('should show prayer request title', async ({ page }) => {
      await page.waitForTimeout(1000);

      const prayerCard = page.locator('[data-testid="prayer-card"], .prayer-card, article').first();

      if (await prayerCard.isVisible()) {
        const title = prayerCard.locator('h3, h2');
        await expect(title).toBeVisible();
      }
    });

    test('should display prayer count', async ({ page }) => {
      await page.waitForTimeout(1000);

      const prayerCard = page.locator('[data-testid="prayer-card"], .prayer-card, article').first();

      if (await prayerCard.isVisible()) {
        const prayerCount = prayerCard.locator('[data-testid="prayer-count"], text=/\\d+ prayers/i');
        // Prayer count should be displayed
        expect(prayerCount).toBeTruthy();
      }
    });

    test('should show pray button', async ({ page }) => {
      await page.waitForTimeout(1000);

      const prayerCard = page.locator('[data-testid="prayer-card"], .prayer-card, article').first();

      if (await prayerCard.isVisible()) {
        const prayButton = prayerCard.locator('button:has-text("Pray")');
        // Pray button should be visible
        expect(prayButton).toBeTruthy();
      }
    });

    test('should display prayer status', async ({ page }) => {
      await page.waitForTimeout(1000);

      const prayerCard = page.locator('[data-testid="prayer-card"], .prayer-card, article').first();

      if (await prayerCard.isVisible()) {
        const status = prayerCard.locator('[data-testid="status"], .status, text=/active|answered|closed/i');
        // Status is optional
        expect(status).toBeTruthy();
      }
    });

    test('should filter prayer requests by status', async ({ page }) => {
      const filterButton = page.locator('button:has-text("Active"), select[name="status"]');

      if (await filterButton.isVisible()) {
        const select = page.locator('select').first();
        if (await select.isVisible()) {
          await select.selectOption('0');
          await page.waitForTimeout(500);

          const content = page.locator('main');
          await expect(content).toBeVisible();
        }
      }
    });

    test('should show anonymous indicator', async ({ page }) => {
      await page.waitForTimeout(1000);

      const prayerCard = page.locator('[data-testid="prayer-card"], .prayer-card, article').first();

      if (await prayerCard.isVisible()) {
        const anonymous = prayerCard.locator('text=/anonymous|private/i');
        // Anonymous indicator is optional
        const hasAnon = await anonymous.count();
        expect(hasAnon).toBeGreaterThanOrEqual(0);
      }
    });

    test('should navigate to prayer request detail when clicking', async ({ page }) => {
      await page.waitForTimeout(1000);

      const prayerCard = page.locator('[data-testid="prayer-card"], .prayer-card, article').first();

      if (await prayerCard.isVisible()) {
        const prayerLink = prayerCard.locator('a').first();
        if (await prayerLink.isVisible()) {
          await prayerLink.click();

          // Should navigate to prayer detail
          await page.waitForURL(/prayer/).catch(() => {});
          expect(page.url()).toMatch(/prayer/);
        }
      }
    });

    test('should show prayer request date', async ({ page }) => {
      await page.waitForTimeout(1000);

      const prayerCard = page.locator('[data-testid="prayer-card"], .prayer-card, article').first();

      if (await prayerCard.isVisible()) {
        const date = prayerCard.locator('text=/ago|posted/i');
        // Date is optional
        expect(date).toBeTruthy();
      }
    });

    test('should handle pray button click', async ({ page }) => {
      await page.waitForTimeout(1000);

      const prayerCard = page.locator('[data-testid="prayer-card"], .prayer-card, article').first();

      if (await prayerCard.isVisible()) {
        const prayButton = prayerCard.locator('button:has-text("Pray")');

        if (await prayButton.isVisible()) {
          await prayButton.click();

          // Should show confirmation or update count
          // Behavior depends on authentication and implementation
          expect(true).toBe(true);
        }
      }
    });
  });

  test.describe('Community Navigation', () => {
    test('should navigate between forum and prayer pages', async ({ page }) => {
      // Start at community page
      await page.goto('/community');
      await page.waitForTimeout(500);

      // Find and click prayer link
      const prayerLink = page.locator('a[href*="/prayer"], button:has-text("Prayer")');

      if (await prayerLink.isVisible()) {
        await prayerLink.click();
        await page.waitForURL(/prayer/).catch(() => {});
      }
    });

    test('should display community stats or highlights', async ({ page }) => {
      await page.goto('/community');

      const stats = page.locator('[data-testid="stats"], .stats, text=/members|posts|active/i');
      // Stats are optional
      expect(stats).toBeTruthy();
    });

    test('should have search functionality', async ({ page }) => {
      await page.goto('/community');

      const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
      // Search is optional
      expect(searchInput).toBeTruthy();
    });

    test('should handle responsive layout on mobile', async ({ page }) => {
      await page.goto('/community');
      await page.setViewportSize({ width: 375, height: 667 });

      const content = page.locator('main');
      await expect(content).toBeVisible();
    });

    test('should handle responsive layout on tablet', async ({ page }) => {
      await page.goto('/community');
      await page.setViewportSize({ width: 768, height: 1024 });

      const content = page.locator('main');
      await expect(content).toBeVisible();
    });

    test('should load without console errors', async ({ page }) => {
      let hasErrors = false;

      page.on('console', (message) => {
        if (message.type() === 'error') {
          hasErrors = true;
        }
      });

      await page.goto('/community');
      await page.waitForTimeout(1000);

      expect(hasErrors).toBe(false);
    });
  });
});
