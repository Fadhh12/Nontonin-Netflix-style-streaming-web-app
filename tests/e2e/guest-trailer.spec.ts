import { test, expect } from "@playwright/test";

// SRS AC2 + AC1: guest browses without login, opens a title, and can play
// (or gets a clear "not available" state for) its trailer.
test("guest browses, opens a title, and can try to play its trailer", async ({ page }) => {
  await page.goto("/browse");

  // AC1: hero and rows render without any login prompt.
  await expect(page.getByRole("link", { name: /Putar Trailer/i }).first()).toBeVisible({
    timeout: 15_000,
  });

  // Open the first title from the Trending row via its card link.
  const firstCard = page.locator('a[href^="/title/"]').first();
  await firstCard.waitFor({ state: "visible", timeout: 15_000 });
  await firstCard.click();
  await page.waitForURL(/\/title\//, { timeout: 15_000 });

  // T2.2: opened via a card click, so this is the intercepted modal (S07),
  // not a full navigation — /browse stays mounted underneath it.
  const detailDialog = page.getByRole("dialog", { name: "Detail judul" });
  await expect(detailDialog).toBeVisible();
  await expect(detailDialog.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Trending hari ini")).toBeVisible();

  const trailerButton = page.getByRole("button", { name: "Putar Trailer" });
  await trailerButton.click();

  const trailerDialog = page.getByRole("dialog", { name: /^Trailer / });
  await expect(trailerDialog).toBeVisible();

  // Real TMDB data: either a playable trailer or the explicit unavailable
  // state — both are valid, a raw error/blank modal is not.
  const hasVideo = await trailerDialog.locator("iframe").count();
  if (hasVideo === 0) {
    await expect(trailerDialog.getByText("Trailer belum tersedia")).toBeVisible();
  }

  // Esc closes only the trailer (topmost), not the detail modal under it.
  await page.keyboard.press("Escape");
  await expect(trailerDialog).not.toBeVisible();
  await expect(trailerButton).toBeFocused();
  await expect(detailDialog).toBeVisible();

  // A second Esc then closes the detail modal, returning to /browse.
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/browse$/);
});
