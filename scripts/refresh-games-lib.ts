import { execFileSync } from "child_process";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  cpSync,
  readdirSync,
  statSync,
} from "fs";
import { join } from "path";

const EXCLUDE_EXACT = new Set([
  ".git",
  "node_modules",
  "package.json",
  "package-lock.json",
  ".gitignore",
  ".github",
  ".eslintrc.json",
  ".prettierrc",
  "tsconfig.json",
  "vite.config.ts",
  "vite.config.js",
]);

const EXCLUDE_PATTERNS = [/^readme/i, /^licen[sc]e/i];

export function shouldExcludeFromCopy(entry: string): boolean {
  if (EXCLUDE_EXACT.has(entry)) return true;
  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(entry));
}

export interface ShaMap {
  [gameId: string]: string;
}

export type GameResult =
  | { status: "updated"; gameId: string; oldSha: string | null; newSha: string }
  | { status: "current"; gameId: string }
  | { status: "failed"; gameId: string; error: string };

export function readShaFile(shaFilePath: string): ShaMap {
  if (!existsSync(shaFilePath)) return {};
  return JSON.parse(readFileSync(shaFilePath, "utf-8"));
}

export function writeShaFile(shaFilePath: string, shas: ShaMap): void {
  writeFileSync(shaFilePath, JSON.stringify(shas, null, 2) + "\n");
}

export function cloneRepo(repoUrl: string, destDir: string): void {
  console.log(`  Cloning ${repoUrl}...`);
  execFileSync("git", ["clone", "--depth", "1", repoUrl, destDir], {
    stdio: "inherit",
  });
}

export function fetchRepo(repoDir: string): void {
  console.log(`  Fetching latest changes...`);
  execFileSync("git", ["fetch", "--depth", "1", "origin"], {
    cwd: repoDir,
    stdio: "inherit",
  });
}

export function getDefaultBranch(repoDir: string): string {
  try {
    const ref = execFileSync(
      "git",
      ["symbolic-ref", "refs/remotes/origin/HEAD"],
      { cwd: repoDir, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    ).trim();
    return ref.replace("refs/remotes/origin/", "");
  } catch {
    try {
      execFileSync("git", ["rev-parse", "--verify", "origin/main"], {
        cwd: repoDir,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      return "main";
    } catch {
      return "master";
    }
  }
}

export function getHeadSha(repoDir: string, branch: string): string {
  return execFileSync("git", ["rev-parse", `origin/${branch}`], {
    cwd: repoDir,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

export function resetToBranch(repoDir: string, branch: string): void {
  execFileSync("git", ["reset", "--hard", `origin/${branch}`], {
    cwd: repoDir,
    stdio: "inherit",
  });
}

export function hasBuildScript(repoDir: string): boolean {
  const pkgPath = join(repoDir, "package.json");
  if (!existsSync(pkgPath)) return false;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  return Boolean(pkg.scripts?.build);
}

export function buildGame(repoDir: string): void {
  console.log(`  Installing dependencies...`);
  const lockfilePath = join(repoDir, "package-lock.json");
  if (existsSync(lockfilePath)) {
    execFileSync("npm", ["ci"], { cwd: repoDir, stdio: "inherit" });
  } else {
    execFileSync("npm", ["install"], { cwd: repoDir, stdio: "inherit" });
  }
  console.log(`  Building...`);
  execFileSync("npm", ["run", "build"], { cwd: repoDir, stdio: "inherit" });
}

function saveThumbnail(destDir: string): Buffer | null {
  const thumbnailPath = join(destDir, "thumbnail.png");
  if (existsSync(thumbnailPath)) {
    return readFileSync(thumbnailPath) as Buffer;
  }
  return null;
}

function restoreThumbnail(
  destDir: string,
  thumbnailBuffer: Buffer | null
): void {
  if (thumbnailBuffer) {
    writeFileSync(join(destDir, "thumbnail.png"), thumbnailBuffer);
  }
}

// Directories that should never be copied as extra assets from the repo root
const BUILD_ARTIFACT_DIRS = new Set([
  "dist",
  "node_modules",
  ".git",
  ".github",
  ".claude",
  "src",
  "docs",
  "test",
  "tests",
  "e2e",
  "__tests__",
]);

/**
 * Copy asset directories from the repo root that aren't in dist/ but are
 * referenced by the game's JS. Some games (e.g. particle-panic) keep static
 * assets at the repo root outside of Vite's public/ directory.
 * If a directory exists in both dist/ and the repo root (e.g. assets/),
 * the contents are merged without overwriting dist files.
 */
export function copyExtraAssets(repoDir: string, destDir: string): void {
  const repoEntries = readdirSync(repoDir);

  for (const entry of repoEntries) {
    if (shouldExcludeFromCopy(entry)) continue;
    if (BUILD_ARTIFACT_DIRS.has(entry)) continue;

    const fullPath = join(repoDir, entry);
    if (!statSync(fullPath).isDirectory()) continue;

    // Check if any JS file in dest references this directory
    const jsFiles = findJsFiles(destDir);
    const isReferenced = jsFiles.some((jsFile) => {
      const content = readFileSync(jsFile, "utf-8");
      return (
        content.includes(`"/${entry}/`) ||
        content.includes(`'/${entry}/`) ||
        content.includes(`\`/${entry}/`)
      );
    });

    if (isReferenced) {
      const destPath = join(destDir, entry);
      if (existsSync(destPath)) {
        // Merge: copy subdirectories/files that don't already exist in dest
        const repoSubEntries = readdirSync(fullPath);
        for (const sub of repoSubEntries) {
          const destSubPath = join(destPath, sub);
          if (!existsSync(destSubPath)) {
            console.log(`  Copying extra asset: ${entry}/${sub}`);
            cpSync(join(fullPath, sub), destSubPath, { recursive: true });
          }
        }
      } else {
        console.log(`  Copying extra asset directory: ${entry}/`);
        cpSync(fullPath, destPath, { recursive: true });
      }
    }
  }
}

function findJsFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findJsFiles(fullPath));
    } else if (entry.name.endsWith(".js")) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Rewrite absolute asset paths in JS files to relative paths.
 * Games built with Vite use absolute paths (e.g. "/bg.png") which break
 * when served under /games/<id>/. This converts them to relative paths
 * (e.g. "./bg.png") so they resolve correctly.
 */
export function rewriteAssetPaths(destDir: string): void {
  const topEntries = readdirSync(destDir);
  const jsFiles = findJsFiles(destDir);

  if (jsFiles.length === 0) return;

  // Build a list of top-level files and directories to match against
  const assetNames = topEntries.filter(
    (e) => e !== "index.html" && !e.startsWith(".")
  );

  for (const jsFile of jsFiles) {
    let content = readFileSync(jsFile, "utf-8");
    let modified = false;

    for (const name of assetNames) {
      // Replace "/name" with "./name" in string literals (both quote styles)
      // Matches: "/assets/..." or "/bg.png" etc.
      const patterns = [
        { search: `"/${name}`, replace: `"./${name}` },
        { search: `'/${name}`, replace: `'./${name}` },
        { search: `\`/${name}`, replace: `\`./${name}` },
      ];
      for (const { search, replace } of patterns) {
        if (content.includes(search)) {
          content = content.split(search).join(replace);
          modified = true;
        }
      }
    }

    if (modified) {
      writeFileSync(jsFile, content);
      console.log(`  Rewrote asset paths in: ${jsFile.replace(destDir + "/", "")}`);
    }
  }
}

export function copyBuiltGame(repoDir: string, destDir: string): void {
  const distDir = join(repoDir, "dist");
  if (!existsSync(distDir)) {
    throw new Error("Build completed but dist/ directory not found");
  }

  const thumbnailBuffer = saveThumbnail(destDir);

  rmSync(destDir, { recursive: true, force: true });
  mkdirSync(destDir, { recursive: true });
  cpSync(distDir, destDir, { recursive: true });

  // Copy asset directories from repo root that aren't in dist but are referenced
  copyExtraAssets(repoDir, destDir);

  // Rewrite absolute paths to relative so games work under /games/<id>/
  rewriteAssetPaths(destDir);

  restoreThumbnail(destDir, thumbnailBuffer);
}

export function copyStaticGame(repoDir: string, destDir: string): void {
  const thumbnailBuffer = saveThumbnail(destDir);

  rmSync(destDir, { recursive: true, force: true });
  mkdirSync(destDir, { recursive: true });

  const entries = readdirSync(repoDir);
  for (const entry of entries) {
    if (shouldExcludeFromCopy(entry)) continue;
    cpSync(join(repoDir, entry), join(destDir, entry), { recursive: true });
  }

  restoreThumbnail(destDir, thumbnailBuffer);
}

export function processGame(
  gameId: string,
  repoUrl: string,
  storedSha: string | undefined,
  reposDir: string,
  publicGamesDir: string
): GameResult {
  const repoDir = join(reposDir, gameId);
  const destDir = join(publicGamesDir, gameId);

  try {
    if (!existsSync(repoDir)) {
      cloneRepo(repoUrl, repoDir);
    } else {
      fetchRepo(repoDir);
    }

    const branch = getDefaultBranch(repoDir);
    const currentSha = getHeadSha(repoDir, branch);

    if (storedSha === currentSha) {
      console.log(`  Already up to date (${currentSha.slice(0, 7)})`);
      return { status: "current", gameId };
    }

    console.log(
      `  Update available: ${storedSha ? storedSha.slice(0, 7) : "(none)"} -> ${currentSha.slice(0, 7)}`
    );

    resetToBranch(repoDir, branch);

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

export function regenerateThumbnails(rootDir: string): void {
  const scriptPath = join(rootDir, "scripts", "generate-thumbnails.ts");
  if (!existsSync(scriptPath)) {
    console.log(
      "\nSkipping thumbnail regeneration: generate-thumbnails.ts not found"
    );
    return;
  }

  console.log("\nRegenerating thumbnails for updated games...");
  try {
    execFileSync("npx", ["tsx", scriptPath], {
      cwd: rootDir,
      stdio: "inherit",
    });
    console.log("Thumbnail regeneration complete.");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Warning: Thumbnail regeneration failed: ${message}`);
    console.error(
      "You can regenerate thumbnails manually with: npm run generate-thumbnails"
    );
  }
}
