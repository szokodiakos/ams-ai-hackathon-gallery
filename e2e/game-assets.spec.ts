import { test, expect } from "@playwright/test";

const GAMES = [
  { id: "gravity-well", title: "Gravity Well" },
  { id: "particle-panic", title: "Particle Panic" },
  { id: "moonshot", title: "Moonshot" },
  { id: "boat-race", title: "Boat Race" },
  { id: "colony-clash", title: "Colony Clash" },
  { id: "grachten-hopper", title: "Grachten Hopper" },
  { id: "arcane-akash", title: "Arcane Akash" },
  { id: "eat-that", title: "Eat That!" },
];

test.describe("Game asset loading", () => {
  for (const game of GAMES) {
    test(`${game.title} loads without 404 asset errors`, async ({ page }) => {
      const failedRequests: string[] = [];
      const baseURL = new URL(
        page.context().pages()[0]?.url() || "http://localhost:3000"
      );
      const origin = baseURL.origin || "http://localhost:3000";

      // Listen for failed responses before navigating
      page.on("response", (response) => {
        const url = response.url();
        // Only check same-origin requests (skip external CDNs like Google Fonts)
        if (url.startsWith(origin) && response.status() === 404) {
          failedRequests.push(url);
        }
      });

      await page.goto(`/games/${game.id}`);

      // Wait for the iframe to be visible
      const iframe = page.locator('[data-testid="game-iframe"]');
      await expect(iframe).toBeVisible();

      // Access the iframe's page to monitor its network requests too
      const frame = page.frame({ url: new RegExp(`/games/${game.id}/`) });
      if (frame) {
        // Frame requests are already captured by the page-level listener
        // Wait for the game to finish loading its assets
        await frame.waitForLoadState("networkidle");
      } else {
        // Fallback: wait for network idle on the main page
        await page.waitForLoadState("networkidle");
      }

      // Give extra time for any lazy-loaded assets
      await page.waitForTimeout(2000);

      expect(
        failedRequests,
        `404 errors found for ${game.title}:\n${failedRequests.join("\n")}`
      ).toHaveLength(0);
    });
  }
});
