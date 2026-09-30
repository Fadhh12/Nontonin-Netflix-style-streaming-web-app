import { test, expect } from "@playwright/test";

// SRS AC4-adjacent end-to-end flow: register -> create a profile -> select it
// -> add a title to My List -> see it on /my-list.
test("register, create a profile, and add a title to My List", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;

  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Kata sandi", { exact: true }).fill("abcd1234");
  await page.getByLabel("Konfirmasi kata sandi").fill("abcd1234");
  await page.getByRole("button", { name: "Daftar" }).click();

  await expect(page).toHaveURL(/\/profiles$/, { timeout: 10_000 });

  await page.getByRole("button", { name: "Tambah profil" }).click();
  await page.getByLabel("Nama profil").fill("E2E Tester");
  await page.getByRole("button", { name: "Simpan" }).click();

  const profileButton = page.getByRole("button", { name: "E2E Tester" });
  await expect(profileButton).toBeVisible({ timeout: 10_000 });
  await profileButton.click();

  await expect(page).toHaveURL(/\/browse$/, { timeout: 10_000 });

  const firstCard = page.locator('a[href^="/title/"]').first();
  await firstCard.waitFor({ state: "visible", timeout: 15_000 });
  await firstCard.click();

  const listButton = page.getByRole("button", { name: /^(List|Di List)$/ });
  await expect(listButton).toBeVisible();
  await listButton.click();
  await expect(listButton).toHaveText("Di List", { timeout: 10_000 });

  await page.goto("/my-list");
  await expect(page.locator('a[href^="/title/"]').first()).toBeVisible({ timeout: 10_000 });
});
