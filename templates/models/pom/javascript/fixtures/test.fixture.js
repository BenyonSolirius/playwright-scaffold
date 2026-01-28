import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

// Extend the base test with our fixtures
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

// Export the same expect from Playwright for convenience
export { expect } from '@playwright/test';

// If the whole of playwright test is re-exported, you only need to import one module.
// But this isn't always needed, use your initative on this one.
export * from '@playwright/test';
