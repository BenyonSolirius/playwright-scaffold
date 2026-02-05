# Playwright Automation Standards & Best Practices

## 1. Overview

This document defines the structure, conventions, and best practices for implementing and maintaining automated tests using Playwright. It aims to ensure **test reliability, maintainability, scalability, and consistency** across the automation suite.

---

## 2. Architecture & Folder Structure

Our testing frameworks reside within the **NX Mono-repo**. Adhering to the following structure ensures that projects remain scalable and navigable.

**Path:** `apps/e2e/project-name-e2e/`

| Folder   | Purpose                                                 |
| :------- | :------------------------------------------------------ |
| `tests/` | The **Presentation Layer**. Purely readable test flows. |
| `pages/` | Page Object Models (POM) and `components/` subfolder.   |
| `lib/`   | Library wrappers (API, environment loaders, fixtures).  |
| `utils/` | Business logic, math, or date helpers.                  |
| `data/`  | Test data objects and TypeScript types.                 |

---

## 3. Naming Conventions

Consistency in naming is mandatory for automated linting and discovery.

| Entity                | Convention           | Example                         |
| :-------------------- | :------------------- | :------------------------------ |
| **Classes (POM)**     | PascalCase           | `LoginPage`                     |
| **Variables/Methods** | camelCase            | `submitForm()`                  |
| **Constants**         | SCREAMING_SNAKE_CASE | `DEFAULT_TIMEOUT`               |
| **Files**             | kebab-case.type.ts   | `login.page.ts`, `auth.spec.ts` |

---

## 4. The "Presentation Layer" (Tests)

Tests should read like a user story. Logic, selectors, and complex loops **do not belong here**.

- **Rule:** Only use Page Methods and Assertions.
- **Rule:** Use Playwright Fixtures to instantiate pages automatically.

### ❌ The Wrong Way

Avoid CSS selectors and hardcoded logic in tests.

```ts
test('login test', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#username').fill('user1'); // NO: Selector leakage
  await page.click('button.submit');
  await expect(page.locator('.welcome')).toBeVisible();
});
```

### ✅ The Right Way

```ts
import { test } from '../lib/test.fixture';

test('user can login with valid credentials', async ({ loginPage, homePage }) => {
  await loginPage.goto();
  await loginPage.login({ username: 'user1' }); // Parameterized method
  await homePage.verifyWelcomeMessage();
});
```

---

## 5. Page Object Model (POM) & Components

Pages should contain interactions. If a UI element (like a Header) appears on multiple pages, abstract it into a **Component**.

- **Parameterized Methods:** Avoid creating `loginWithEmail`, `loginWithSocial`. Use one method with options.
- **JSDocs:** Always document parameters for IDE intellisense.

```ts
/**
 * Logs a user into the application.
 * @param options - Login credentials. Defaults to standard user
 */
  async login(options = { username: 'default_user', password: 'Password123' }) {
  await this.usernameInput.fill(options.username);
  await this.passwordInput.fill(options.password);
  await this.loginButton.click();
  }
```

---

## 6. Environment & Configuration

Never use `process.env` directly in your code. This bypasses validation and leads to silent failures.

### Environment Wrapper (`lib/env.lib.ts`)

We use **Zod** to validate environment variables at runtime.

```ts
import { z } from 'zod';

const envSchema = z.object({
  BASE_URL: z.string().url().default('http://localhost:4100'),
  API_URL: z.string().url(),
  RETRY_COUNT: z.coerce.number().default(2),
});

// Throws error immediately if validation fails
export const ENV = envSchema.parse(process.env);
```

---

## 7. Abstraction of Logic (Utils)

If you need to calculate a date, parse a string, or perform math, move it to `utils/`.

```ts
// utils/dates.util.ts
export class DatesUtil {
  static getRetirementDate(dob: string): string {
    // complex logic here
    return formattedDate;
  }
}
```

---

## 8. Playwright Fixtures

Fixtures provide a clean way to share page objects and setup logic without `beforeEach` clutter.

**Example Setup (`lib/test.fixture.ts`):**

```ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type MyFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
```

---

## 9. Linting & ESLint Rules

Our `.eslintrc.json` enforces these standards. Key rules include:

- **No Floating Promises:** You must `await` all Playwright actions.
- **No process.env:** You must use the `ENV` wrapper.
- **Restricted Imports:** Use `node:path` instead of `path`.

---

## 10. Test Data Management

Data should be typed and centralized.

- **File:** `data/user.data.ts`
- **Types:** `data/types.ts`

```ts
import { UserData } from './types';

export const VALID_USER: UserData = {
  username: 'test_user',
  email: 'test@example.com',
};
```

---

## 11. Traceability & Test Coverage

We use a standardized JSDoc `@tests` tagging system to link code to project requirements.

### Implementation Example

```ts
/**
 * @tests User Story 12345: Frontend - Feature Name - Feature Description
 * @tests User Story 67890: Frontend - Feature Name - Feature Description
 */
test.describe('Feature Name', () => {
  test('should be functional', async ({ loginPage }) => {
    // Test implementation...
  });
});
```

---

## Summary Checklist for PR Reviews

Before approving a Pull Request, ensure:

- [ ] **Environment:** No `process.env` is used; use `ENV` from `lib/env.lib.ts`.
- [ ] **Separation of Concerns:** No CSS/XPath selectors exist in the `tests/` folder.
- [ ] **Naming:** File names follow `name.type.ts` (e.g., `header.component.ts`).
- [ ] **Documentation:** All page methods include JSDoc parameter documentation.
- [ ] **Abstraction:** Logic is moved to `utils/`.
- [ ] **Coverage:** The test file includes the `@tests` JSDoc block.
