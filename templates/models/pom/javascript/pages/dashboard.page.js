export class DashboardPage {
  constructor(page) {
    this.page = page;
  }

  // --------------------
  // Locators
  // --------------------
  // Private selectors encapsulate page structure and prevent test code from depending on implementation details.
  // Prefixing with `#` makes them private, so they are not usable or visible from outside of the class.
  #welcomeMessage = '#welcomeMsg';
  #logoutButton = '#logoutBtn';

  // --------------------
  // Public actions
  // --------------------
  // Methods exposed to tests should represent user behaviours rather than raw interactions.
  // Combine low-level interactions internally if needed.

  /**
   * Retrieves the welcome message text displayed on the dashboard.
   * Behaviour-driven getter that exposes page data, not locators.
   */
  get welcomeMessage() {
    return this.page.textContent(this.#welcomeMessage);
  }

  /**
   * Logs the user out by clicking the logout button.
   * Encapsulates the interaction so tests only express intent.
   */
  async logout() {
    await this.page.click(this.#logoutButton);
  }
}
