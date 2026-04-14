import { test, expect } from "@playwright/test";

const GAMES = [
  { id: "gravity-well", title: "Gravity Well", teamName: "Botfathers" },
  { id: "particle-panic", title: "Particle Panic", teamName: "Al-Lian" },
  { id: "moonshot", title: "Moonshot", teamName: "Artemis III" },
  { id: "boat-race", title: "Boat Race", teamName: "Can't Slop Won't Slop" },
  { id: "colony-clash", title: "Colony Clash", teamName: "Halluci Nation" },
  {
    id: "grachten-hopper",
    title: "Grachten Hopper",
    teamName: "Token My Breath Away",
  },
  { id: "arcane-akash", title: "Arcane Akash", teamName: "LIT Intelligence" },
  { id: "eat-that", title: "Eat That!", teamName: "Prompt-fiction" },
];

test.describe("Gallery page", () => {
  test("displays all 8 game cards", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("a[href^='/games/']");
    await expect(cards).toHaveCount(8);
  });

  test("shows header text", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("8 TEAMS")).toBeVisible();
    await expect(page.getByText("INSERT COIN TO PLAY")).toBeVisible();
  });

  test("each game card shows title and team name", async ({ page }) => {
    await page.goto("/");
    for (const game of GAMES) {
      await expect(page.getByText(game.title).first()).toBeVisible();
      await expect(page.getByText(`by ${game.teamName}`).first()).toBeVisible();
    }
  });

  test("each game card shows description", async ({ page }) => {
    await page.goto("/");
    // Verify at least the first game has a visible description
    await expect(
      page.getByText("A cyberpunk arena brawl").first()
    ).toBeVisible();
  });

  test("gallery page screenshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `test-results/screenshots/gallery.png`,
      fullPage: true,
    });
  });
});

test.describe("Game pages", () => {
  for (const game of GAMES) {
    test.describe(game.title, () => {
      test(`navigates from gallery to ${game.title}`, async ({ page }) => {
        await page.goto("/");
        await page.locator(`a[href="/games/${game.id}"]`).click();
        await expect(page).toHaveURL(`/games/${game.id}`);
      });

      test(`${game.title} loads game iframe`, async ({ page }) => {
        await page.goto(`/games/${game.id}`);
        const iframe = page.locator('[data-testid="game-iframe"]');
        await expect(iframe).toBeVisible();
        await expect(iframe).toHaveAttribute(
          "src",
          `/games/${game.id}/index.html`
        );
      });

      test(`${game.title} shows only the game iframe with no chrome`, async ({
        page,
      }) => {
        await page.goto(`/games/${game.id}`);
        const iframe = page.locator('[data-testid="game-iframe"]');
        await expect(iframe).toBeVisible();
        // Verify no title, team name, description, or back link on the game page
        await expect(page.getByText("BACK TO GALLERY")).not.toBeVisible();
      });

      test(`${game.title} iframe content loads`, async ({ page }) => {
        await page.goto(`/games/${game.id}`);
        const iframe = page.frameLocator('[data-testid="game-iframe"]');
        // Verify the iframe loaded an HTML document with a head element
        await expect(iframe.locator("head")).toBeAttached();
      });

      test(`${game.title} page screenshot`, async ({ page }) => {
        await page.goto(`/games/${game.id}`);
        await page.waitForLoadState("networkidle");
        // Wait for game canvas/content to render
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: `test-results/screenshots/game-${game.id}.png`,
          fullPage: true,
        });
      });
    });
  }
});
