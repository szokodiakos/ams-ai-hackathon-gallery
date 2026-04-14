import { execSync } from "child_process";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  cpSync,
  readdirSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { games } from "../src/data/games";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const REPOS_DIR = join(ROOT_DIR, ".game-repos");
const PUBLIC_GAMES_DIR = join(ROOT_DIR, "public", "games");
const SHA_FILE = join(__dirname, "game-shas.json");

const EXCLUDE_FROM_COPY = new Set([
  ".git",
  "node_modules",
  "package.json",
  "package-lock.json",
  ".gitignore",
  ".github",
  "README.md",
  "readme.md",
  "LICENSE",
  "license",
  ".eslintrc.json",
  ".prettierrc",
  "tsconfig.json",
  "vite.config.ts",
  "vite.config.js",
]);

interface ShaMap {
  [gameId: string]: string;
}

type GameResult =
  | { status: "updated"; gameId: string; oldSha: string | null; newSha: string }
  | { status: "current"; gameId: string }
  | { status: "failed"; gameId: string; error: string };

function exec(cmd: string, cwd?: string): string {
  return execSync(cmd, { cwd, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function readShaFile(): ShaMap {
  if (!existsSync(SHA_FILE)) return {};
  return JSON.parse(readFileSync(SHA_FILE, "utf-8"));
}

function writeShaFile(shas: ShaMap): void {
  writeFileSync(SHA_FILE, JSON.stringify(shas, null, 2) + "\n");
}

function cloneRepo(repoUrl: string, destDir: string): void {
  console.log(`  Cloning ${repoUrl}...`);
  execSync(`git clone --depth 1 "${repoUrl}" "${destDir}"`, { stdio: "inherit" });
}

function fetchRepo(repoDir: string): void {
  console.log(`  Fetching latest changes...`);
  execSync("git fetch origin", { cwd: repoDir, stdio: "inherit" });
}

function getDefaultBranch(repoDir: string): string {
  try {
    const ref = exec("git symbolic-ref refs/remotes/origin/HEAD", repoDir);
    return ref.replace("refs/remotes/origin/", "");
  } catch {
    // Fallback: try common branch names
    try {
      exec("git rev-parse --verify origin/main", repoDir);
      return "main";
    } catch {
      return "master";
    }
  }
}

function getHeadSha(repoDir: string, branch: string): string {
  return exec(`git rev-parse origin/${branch}`, repoDir);
}

function resetToBranch(repoDir: string, branch: string): void {
  execSync(`git reset --hard origin/${branch}`, { cwd: repoDir, stdio: "inherit" });
}

function hasBuildScript(repoDir: string): boolean {
  const pkgPath = join(repoDir, "package.json");
  if (!existsSync(pkgPath)) return false;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  return Boolean(pkg.scripts?.build);
}

function buildGame(repoDir: string): void {
  console.log(`  Installing dependencies...`);
  const lockfilePath = join(repoDir, "package-lock.json");
  const installCmd = existsSync(lockfilePath) ? "npm ci" : "npm install";
  execSync(installCmd, { cwd: repoDir, stdio: "inherit" });
  console.log(`  Building...`);
  execSync("npm run build", { cwd: repoDir, stdio: "inherit" });
}

function copyBuiltGame(repoDir: string, destDir: string): void {
  const distDir = join(repoDir, "dist");
  if (!existsSync(distDir)) {
    throw new Error("Build completed but dist/ directory not found");
  }

  // Save thumbnail if it exists
  const thumbnailPath = join(destDir, "thumbnail.png");
  const thumbnailExists = existsSync(thumbnailPath);
  let thumbnailBuffer: Buffer | null = null;
  if (thumbnailExists) {
    thumbnailBuffer = readFileSync(thumbnailPath) as Buffer;
  }

  // Clear destination and copy dist contents
  rmSync(destDir, { recursive: true, force: true });
  mkdirSync(destDir, { recursive: true });
  cpSync(distDir, destDir, { recursive: true });

  // Restore thumbnail
  if (thumbnailBuffer) {
    writeFileSync(thumbnailPath, thumbnailBuffer);
  }
}

function copyStaticGame(repoDir: string, destDir: string): void {
  // Save thumbnail if it exists
  const thumbnailPath = join(destDir, "thumbnail.png");
  const thumbnailExists = existsSync(thumbnailPath);
  let thumbnailBuffer: Buffer | null = null;
  if (thumbnailExists) {
    thumbnailBuffer = readFileSync(thumbnailPath) as Buffer;
  }

  // Clear destination
  rmSync(destDir, { recursive: true, force: true });
  mkdirSync(destDir, { recursive: true });

  // Copy files, excluding non-game files
  const entries = readdirSync(repoDir);
  for (const entry of entries) {
    if (EXCLUDE_FROM_COPY.has(entry)) continue;
    cpSync(join(repoDir, entry), join(destDir, entry), { recursive: true });
  }

  // Restore thumbnail
  if (thumbnailBuffer) {
    writeFileSync(thumbnailPath, thumbnailBuffer);
  }
}

function processGame(
  gameId: string,
  repoUrl: string,
  storedSha: string | undefined
): GameResult {
  const repoDir = join(REPOS_DIR, gameId);
  const destDir = join(PUBLIC_GAMES_DIR, gameId);

  try {
    // Clone or fetch
    if (!existsSync(repoDir)) {
      cloneRepo(repoUrl, repoDir);
    } else {
      fetchRepo(repoDir);
    }

    // Detect default branch and get current SHA
    const branch = getDefaultBranch(repoDir);
    const currentSha = getHeadSha(repoDir, branch);

    // Compare SHAs
    if (storedSha === currentSha) {
      console.log(`  Already up to date (${currentSha.slice(0, 7)})`);
      return { status: "current", gameId };
    }

    console.log(
      `  Update available: ${storedSha ? storedSha.slice(0, 7) : "(none)"} -> ${currentSha.slice(0, 7)}`
    );

    // Reset to latest
    resetToBranch(repoDir, branch);

    // Build or copy
    if (hasBuildScript(repoDir)) {
      console.log(`  Detected build script, building...`);
      buildGame(repoDir);
      copyBuiltGame(repoDir, destDir);
    } else {
      console.log(`  No build script, copying static files...`);
      copyStaticGame(repoDir, destDir);
    }

    return {
      status: "updated",
      gameId,
      oldSha: storedSha ?? null,
      newSha: currentSha,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "failed", gameId, error: message };
  }
}

function main(): void {
  console.log("Refreshing games from source repositories...\n");

  mkdirSync(REPOS_DIR, { recursive: true });

  const shas = readShaFile();
  const results: GameResult[] = [];

  for (const game of games) {
    if (!game.repoUrl) continue;
    console.log(`[${game.id}] ${game.title}`);
    const result = processGame(game.id, game.repoUrl, shas[game.id]);
    results.push(result);

    // Update SHA on success
    if (result.status === "updated") {
      shas[game.id] = result.newSha;
      writeShaFile(shas);
    }

    console.log();
  }

  // Summary
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

  if (failed.length > 0) {
    process.exit(1);
  }
}

main();
