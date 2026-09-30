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

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const trailerButton = page.getByRole("button", { name: "Putar Trailer" });
  await trailerButton.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Real TMDB data: either a playable trailer or the explicit unavailable
  // state — both are valid, a raw error/blank modal is not.
  const hasVideo = await dialog.locator("iframe").count();
  if (hasVideo === 0) {
    await expect(dialog.getByText("Trailer belum tersedia")).toBeVisible();
  }

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trailerButton).toBeFocused();
});
