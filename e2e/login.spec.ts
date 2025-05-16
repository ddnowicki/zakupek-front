import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test.describe("Login functionality", () => {
  test("should display login form", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Check if form elements are visible
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.navigateToRegister();

    // Check if we've navigated to the register page
    await expect(page).toHaveURL(/.*\/register/);
  });

  // Add more tests for actual login flow once backend is connected
  // These tests would typically be in the format:
  // test('should login with valid credentials', ...
  // test('should show error for invalid credentials', ...
});
