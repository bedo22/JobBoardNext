import { test, expect } from '@playwright/test';

// NOTE: Run the app locally (npm run build && npm start) before running tests
// or set PLAYWRIGHT_BASE_URL to your deployed URL.

test('home page renders and has the hero heading', async ({ page }) => {
  const baseURL = test.info().project.use.baseURL!;
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(baseURL);
  await expect(page.getByRole('heading', { name: /find your dream job/i })).toBeVisible();

  // Allow any non-critical warnings, but assert no console errors
  expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
});
