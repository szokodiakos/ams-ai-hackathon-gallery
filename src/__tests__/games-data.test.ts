import { describe, it, expect } from "vitest";
import { games, getGameById } from "@/data/games";

describe("games data", () => {
  it("contains exactly 8 games", () => {
    expect(games).toHaveLength(8);
  });

  it("each game has required fields", () => {
    for (const game of games) {
      expect(game.id).toBeTruthy();
      expect(game.title).toBeTruthy();
      expect(game.teamName).toBeTruthy();
      expect(game.description).toBeTruthy();
      expect(game.repoUrl).toBeTruthy();
      expect(typeof game.comingSoon).toBe("boolean");
    }
  });

  it("all game IDs are unique", () => {
    const ids = games.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getGameById returns the correct game", () => {
    const game = getGameById("gravity-well");
    expect(game).toBeDefined();
    expect(game!.id).toBe("gravity-well");
    expect(game!.teamName).toBe("Botfathers");
  });

  it("getGameById returns undefined for unknown ID", () => {
    expect(getGameById("nonexistent")).toBeUndefined();
  });
});
