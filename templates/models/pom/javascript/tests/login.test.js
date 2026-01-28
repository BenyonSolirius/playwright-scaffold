import { test, expect } from '../fixtures/test.fixture';
import { admin } from '../data/example';

test.describe('Login', () => {
  // Tests should import page objects from the fixtures directly.
  test('should login successfully with valid credentials', async ({ loginPage, dashboardPage }) => {
    // Use endpoints as oppose to static urls.
    // This allows the tests to be dynamic based on the configuration set.
    await loginPage.navigate('/login');

    // Avoid hard coding test data.
    await loginPage.login(admin.username, admin.password);

    // Using variables to explain your code is always better than comments.
    // However, writing comments is always welcomed.
    // Avoid explaining WHAT the code does and focus on WHY the code does what it does.
    const welcome = await dashboardPage.welcomeMessage;
    expect(welcome).toContain('Welcome, testuser');
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.navigate('/login');
    await loginPage.login('wronguser', 'wrongpass');

    const error = await loginPage.errorMessage;
    expect(error).toContain('Invalid username or password');
  });
});
