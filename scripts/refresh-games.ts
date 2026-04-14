import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";
import { games } from "../src/data/games";
import {
  readShaFile,
  writeShaFile,
  processGame,
  regenerateThumbnails,
  type GameResult,
} from "./refresh-games-lib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const REPOS_DIR = join(ROOT_DIR, ".game-repos");
const PUBLIC_GAMES_DIR = join(ROOT_DIR, "public", "games");
const SHA_FILE = join(__dirname, "game-shas.json");

function main(): void {
  console.log("Refreshing games from source repositories...\n");

  mkdirSync(REPOS_DIR, { recursive: true });

  const shas = readShaFile(SHA_FILE);
  const results: GameResult[] = [];

  for (const game of games) {
    if (!game.repoUrl) continue;
    console.log(`[${game.id}] ${game.title}`);
    const result = processGame(
      game.id,
      game.repoUrl,
      shas[game.id],
      REPOS_DIR,
      PUBLIC_GAMES_DIR
    );
    results.push(result);

    if (result.status === "updated") {
      shas[game.id] = result.newSha;
      writeShaFile(SHA_FILE, shas);
    }

    console.log();
  }

  const updated = results.filter((r) => r.status === "updated") as Extract<
    GameResult,
    { status: "updated" }
  >[];
  const current = results.filter((r) => r.status === "current");
  const failed = results.filter((r) => r.status === "failed") as Extract<
    GameResult,
    { status: "failed" }
  >[];

  console.log("=".repeat(50));
  console.log("SUMMARY");
  console.log("=".repeat(50));

  if (updated.length > 0) {
    console.log(`\nUpdated (${updated.length}):`);
    for (const r of updated) {
      console.log(
        `  ${r.gameId}: ${r.oldSha ? r.oldSha.slice(0, 7) : "(new)"} -> ${r.newSha.slice(0, 7)}`
      );
    }
  }

  if (current.length > 0) {
    console.log(`\nAlready current (${current.length}):`);
    for (const r of current) {
      console.log(`  ${r.gameId}`);
    }
  }

  if (failed.length > 0) {
    console.log(`\nFailed (${failed.length}):`);
    for (const r of failed) {
      console.log(`  ${r.gameId}: ${r.error}`);
    }
  }

  if (updated.length === 0 && failed.length === 0) {
    console.log("\nAll games are up to date!");
  }

  // Regenerate thumbnails for updated games
  if (updated.length > 0) {
    regenerateThumbnails(ROOT_DIR);
  }

  if (failed.length > 0) {
    process.exit(1);
  }
}

main();
