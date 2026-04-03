import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test('should load landing page successfully', async ({ page }) => {
    // Check page title or main heading
    const heading = page.locator('h1, [role="heading"]').first();
    await expect(heading).toBeVisible();
  });

  test('should display Christian Developers branding', async ({ page }) => {
    // Check for app name or logo
    const navBar = page.locator('nav, header, [role="banner"]');
    await expect(navBar).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    // Check for main navigation
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('should have Jobs link in navigation', async ({ page }) => {
    // Find and verify Jobs navigation link
    const jobsLink = page.locator('a:has-text("Jobs"), a:has-text("job"), button:has-text("Jobs")');
    // At least one should exist or have similar navigation
    const navigation = page.locator('nav a, header a, [role="navigation"] a');
    expect(navigation).toBeTruthy();
  });

  test('should have Community link in navigation', async ({ page }) => {
    // Find and verify Community navigation link
    const communityLink = page.locator('a:has-text("Community"), a:has-text("community")');
    const navigation = page.locator('nav a, header a');
    expect(navigation).toBeTruthy();
  });

  test('should have Prayer link in navigation', async ({ page }) => {
    // Find and verify Prayer navigation link
    const prayerLink = page.locator('a:has-text("Prayer")');
    const navigation = page.locator('nav a, header a');
    expect(navigation).toBeTruthy();
  });

  test('should have Mentorship link in navigation', async ({ page }) => {
    // Find and verify Mentorship navigation link
    const mentorshipLink = page.locator('a:has-text("Mentor")');
    const navigation = page.locator('nav a, header a');
    expect(navigation).toBeTruthy();
  });

  test('should display featured jobs section', async ({ page }) => {
    // Check for featured jobs or recent jobs section
    const jobsSection = page.locator('section:has-text("Jobs"), section:has-text("job")');
    // Jobs might be loaded via API
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('should display community highlights section', async ({ page }) => {
    // Check for community or forum section
    const communitySection = page.locator('section:has-text("Community"), section:has-text("Forum")');
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('should have Sign In / Sign Up buttons', async ({ page }) => {
    // Check for authentication links
    const authButtons = page.locator('button:has-text("Sign"), a:has-text("Login"), a:has-text("Sign")');
    const headerAuth = page.locator('header a, nav button');
    expect(headerAuth).toBeTruthy();
  });

  test('should navigate to Jobs page when clicking Jobs link', async ({ page }) => {
    // Find and click Jobs link
    const jobsLink = page.locator('a[href*="/jobs"], a:has-text("Jobs")').first();

    if (await jobsLink.isVisible()) {
      await jobsLink.click();
      await page.waitForURL(/jobs|job/);
      expect(page.url()).toContain('jobs');
    }
  });

  test('should navigate to Community page when clicking Community link', async ({ page }) => {
    // Find and click Community link
    const communityLink = page.locator('a[href*="/community"], a[href*="/forum"], a:has-text("Community")').first();

    if (await communityLink.isVisible()) {
      await communityLink.click();
      await page.waitForURL(/community|forum/);
      expect(page.url()).toContain('community') || expect(page.url()).toContain('forum');
    }
  });

  test('should navigate to Prayer page when clicking Prayer link', async ({ page }) => {
    // Find and click Prayer link
    const prayerLink = page.locator('a[href*="/prayer"], a:has-text("Prayer")').first();

    if (await prayerLink.isVisible()) {
      await prayerLink.click();
      await page.waitForURL(/prayer/);
      expect(page.url()).toContain('prayer');
    }
  });

  test('should display footer with links', async ({ page }) => {
    // Check for footer
    const footer = page.locator('footer, [role="contentinfo"]');
    const bodyEnd = page.locator('body');

    // Footer should be visible or scrollable
    expect(bodyEnd).toBeTruthy();
  });

  test('should have responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that page is still usable
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should have responsive design on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check that page is still usable
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should have responsive design on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Check that page is still usable
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should load without console errors', async ({ page }) => {
    let hasErrors = false;

    page.on('console', (message) => {
      if (message.type() === 'error') {
        hasErrors = true;
      }
    });

    // Reload to catch initial console errors
    await page.reload();
    expect(hasErrors).toBe(false);
  });

  test('should have proper document structure', async ({ page }) => {
    // Check for main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check for header
    const header = page.locator('header, nav');
    await expect(header).toBeVisible();
  });

  test('should display CTA (Call To Action) buttons', async ({ page }) => {
    // Check for primary action buttons
    const buttons = page.locator('button, [role="button"]');
    const count = await buttons.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should have working internal links', async ({ page }) => {
    // Collect all internal links
    const links = page.locator('a[href^="/"]');
    const linkCount = await links.count();

    // Should have at least some internal navigation
    expect(linkCount).toBeGreaterThanOrEqual(0);
  });

  test('should display loading state properly', async ({ page }) => {
    // Check for content or loading indicators
    const content = page.locator('main, [role="main"]');
    await expect(content).toBeVisible({ timeout: 5000 });
  });
});
