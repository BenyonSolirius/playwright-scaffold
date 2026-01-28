import type { Page } from '@playwright/test';

type LoginParameters = {
  toggleRememberMe: boolean;
};

export class LoginPage {
  constructor(private readonly page: Page) {}

  // --------------------
  // Locators
  // --------------------
  // All selectors should be private to encapsulate page details.
  // Prefixing with `_` helps avoid conflicts with public getters or methods.
  private _usernameInput = '#username';
  private _passwordInput = '#password';
  private _loginButton = '#loginBtn';
  private _errorMessage = '.error-msg';
  private _rememberMe = '.remember-me';

  // --------------------
  // Navigation
  // --------------------
  // Navigates to the specified URL.
  async navigate(url: string) {
    await this.page.goto(url);
  }

  // --------------------
  // Private interactions
  // --------------------
  // Behaviour-driven actions that manipulate the page.
  // These are private because they are intended for internal use within the page object.
  private async enterUsername(username: string) {
    await this.page.fill(this._usernameInput, username);
  }

  private async enterPassword(password: string) {
    await this.page.fill(this._passwordInput, password);
  }

  private async clickLogin() {
    await this.page.click(this._loginButton);
  }

  private async clickRememberMe() {
    await this.page.click(this._rememberMe);
  }

  // --------------------
  // Public actions
  // --------------------
  // Methods exposed to tests should represent user actions.
  // Combine private interactions to model realistic user behaviour.
  public async login(username: string, password: string, parameters?: LoginParameters) {
    // Destructure parameters with defaults. If `parameters` is undefined, default to `{ toggleRememberMe: true }`.
    const { toggleRememberMe = true } = parameters ?? {};

    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();

    if (toggleRememberMe) {
      await this.clickRememberMe();
    }
  }

  // --------------------
  // Getters
  // --------------------
  // Expose page data, not locators. Behaviour-driven accessors preferred.
  get errorMessage(): Promise<string | null> {
    return this.page.textContent(this._errorMessage);
  }
}
