import type { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  // --------------------
  // Locators
  // --------------------
  // Private selectors encapsulate page structure and prevent test code from depending on implementation details.
  // Prefixing with `_` differentiates them from public getters or methods.
  private _welcomeMessage = '#welcomeMsg';
  private _logoutButton = '#logoutBtn';

  // --------------------
  // Public actions
  // --------------------
  // Methods exposed to tests should represent user behaviours rather than raw interactions.
  // Combine low-level interactions internally if needed.

  /**
   * Retrieves the welcome message text displayed on the dashboard.
   * Behaviour-driven getter that exposes page data, not locators.
   */
  get welcomeMessage(): Promise<string | null> {
    return this.page.textContent(this._welcomeMessage);
  }

  /**
   * Logs the user out by clicking the logout button.
   * Encapsulates the interaction so tests only express intent.
   */
  async logout(): Promise<void> {
    await this.page.click(this._logoutButton);
  }
}
