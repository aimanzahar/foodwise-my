import { test, expect } from "@playwright/test";

/**
 * Register a new user and verify the app boots into the dashboard
 * (no infinite loading spinner).
 */
test("register → lands on dashboard without infinite loading", async ({ page, context }) => {
  const uniqueEmail = `test-${Date.now()}@example.com`;

  // Go to the auth page
  await page.goto("/auth");

  // Switch to register mode (default is login)
  await page.getByRole("button", { name: "Daftar" }).click();

  // Fill credentials
  await page.getByPlaceholder("Email").fill(uniqueEmail);
  await page.getByPlaceholder("Kata laluan").fill("hunter22");

  // Intercept the register API call so we can inspect cookies
  const registerPromise = page.waitForResponse(
    (r) => r.url().includes("/api/auth/register") && r.request().method() === "POST",
  );

  // Submit
  await page.getByRole("button", { name: "Daftar" }).click();

  const registerResponse = await registerPromise;
  expect(registerResponse.status()).toBe(201);

  // Check that a session cookie was actually set by the server
  const headers = await registerResponse.allHeaders();
  console.log("Set-Cookie header:", headers["set-cookie"] ?? "(none)");

  // Check browser cookies
  const cookies = await context.cookies();
  const sessionCookie = cookies.find((c) => c.name === "foodwise_session");
  console.log("Browser session cookie:", sessionCookie ? "present" : "MISSING", sessionCookie ?? "");

  // Wait for the bootstrap call
  const bootstrapPromise = page.waitForResponse(
    (r) => r.url().includes("/api/app/bootstrap"),
    { timeout: 10_000 },
  );

  const bootstrapResponse = await bootstrapPromise;
  console.log("Bootstrap status:", bootstrapResponse.status());

  // Verify bootstrap succeeded
  expect(bootstrapResponse.status()).toBe(200);

  // After a successful bootstrap the spinner should disappear and
  // we should see the dashboard content (e.g. bottom nav).  Give it a
  // generous timeout in case the data takes a moment to render.
  await expect(page.getByText("Dashboard")).toBeVisible({ timeout: 15_000 });
});
