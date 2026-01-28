export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  // --------------------
  // Locators
  // --------------------
  // All selectors should be private to encapsulate page details.
  // Prefixing with `#` makes them private, so they are not usable or visible from outside of the class.
  #usernameInput = '#username';
  #passwordInput = '#password';
  #loginButton = '#loginBtn';
  #errorMessage = '.error-msg';
  #rememberMe = '.remember-me';

  // --------------------
  // Navigation
  // --------------------
  // Navigates to the specified URL.
  async navigate(url) {
    await this.page.goto(url);
  }

  // --------------------
  // Private interactions
  // --------------------
  // Behaviour-driven actions that manipulate the page.
  // These are private because they are intended for internal use within the page object.
  async #enterUsername(username) {
    await this.page.fill(this.#usernameInput, username);
  }

  async #enterPassword(password) {
    await this.page.fill(this.#passwordInput, password);
  }

  async #clickLogin() {
    await this.page.click(this.#loginButton);
  }

  async #clickRememberMe() {
    await this.page.click(this.#rememberMe); // <- Note: this should probably be a different selector
  }

  // --------------------
  // Public actions
  // --------------------
  // Methods exposed to tests should represent user actions.
  // Combine private interactions to model realistic user behaviour.
  async login(username, password, parameters) {
    // Destructure parameters with defaults. If `parameters` is undefined, default to `{ toggleRememberMe: true }`.
    const { toggleRememberMe = true } = parameters ?? {};

    await this.#enterUsername(username);
    await this.#enterPassword(password);
    await this.#clickLogin();

    if (toggleRememberMe) {
      await this.#clickRememberMe();
    }
  }

  // --------------------
  // Getters
  // --------------------
  // Expose page data, not locators. Behaviour-driven accessors preferred.
  get errorMessage() {
    return this.page.textContent(this.#errorMessage);
  }
}
