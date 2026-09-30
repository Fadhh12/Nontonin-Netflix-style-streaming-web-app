import { test, expect } from "@playwright/test";

// SRS AC3: typing pauses for the debounce, one request fires, results show.
test("search returns real results and navigates to a title", async ({ page }) => {
  await page.goto("/search");

  const input = page.getByPlaceholder("Cari film atau series...");
  await input.fill("spider");

  // 400ms debounce (SRS FR-S1) + network round trip.
  await expect(page.getByRole("heading", { name: "Hasil pencarian" })).toBeVisible({
    timeout: 10_000,
  });

  const results = page.locator('a[href^="/title/"]');
  await expect(results.first()).toBeVisible();

  await results.first().click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("shows the empty state for a query with no matches", async ({ page }) => {
  await page.goto("/search");

  const input = page.getByPlaceholder("Cari film atau series...");
  // Long, unlikely-to-exist title keeps this from ever flaking on a real hit.
  await input.fill("zzzzznonexistenttitlezzzzz12345");

  await expect(
    page.getByText('Tidak ada hasil untuk "zzzzznonexistenttitlezzzzz12345"'),
  ).toBeVisible({ timeout: 10_000 });
});
