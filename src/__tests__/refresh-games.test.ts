import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "fs";
import { join } from "path";
import { execSync } from "child_process";
import {
  readShaFile,
  writeShaFile,
  hasBuildScript,
  copyStaticGame,
  copyBuiltGame,
  shouldExcludeFromCopy,
  cloneRepo,
  fetchRepo,
  getHeadSha,
} from "../../scripts/refresh-games-lib";

const TEST_DIR = join(__dirname, "..", "..", ".test-refresh-games");
const SHA_FILE = join(TEST_DIR, "game-shas.json");

function createTestRepo(name: string, files: Record<string, string>): string {
  const repoDir = join(TEST_DIR, "source-repos", name);
  mkdirSync(repoDir, { recursive: true });
  execSync("git init", { cwd: repoDir, stdio: "pipe" });
  execSync('git config user.email "test@test.com"', {
    cwd: repoDir,
    stdio: "pipe",
  });
  execSync('git config user.name "Test"', { cwd: repoDir, stdio: "pipe" });

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = join(repoDir, filePath);
    mkdirSync(join(fullPath, ".."), { recursive: true });
    writeFileSync(fullPath, content);
  }

  execSync("git add -A", { cwd: repoDir, stdio: "pipe" });
  execSync('git commit -m "initial"', { cwd: repoDir, stdio: "pipe" });

  return repoDir;
}

function getRepoSha(repoDir: string): string {
  return execSync("git rev-parse HEAD", {
    cwd: repoDir,
    encoding: "utf-8",
  }).trim();
}

describe("refresh-games SHA tracking", () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("returns empty object when SHA file does not exist", () => {
    const shas = readShaFile(SHA_FILE);
    expect(shas).toEqual({});
  });

  it("reads SHA file correctly", () => {
    const data = { "test-game": "abc123" };
    writeShaFile(SHA_FILE, data);
    const shas = readShaFile(SHA_FILE);
    expect(shas).toEqual(data);
  });

  it("detects stale SHA when commit differs", () => {
    const repo = createTestRepo("stale-game", {
      "index.html": "<html></html>",
    });
    const sha = getRepoSha(repo);

    writeShaFile(SHA_FILE, { "stale-game": "old-sha-that-does-not-match" });
    const shas = readShaFile(SHA_FILE);
    expect(shas["stale-game"]).not.toBe(sha);
  });

  it("detects current SHA when commit matches", () => {
    const repo = createTestRepo("current-game", {
      "index.html": "<html></html>",
    });
    const sha = getRepoSha(repo);

    writeShaFile(SHA_FILE, { "current-game": sha });
    const shas = readShaFile(SHA_FILE);
    expect(shas["current-game"]).toBe(sha);
  });
});

describe("refresh-games build detection", () => {
  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("detects repo with build script", () => {
    const repoDir = join(TEST_DIR, "buildable");
    mkdirSync(repoDir, { recursive: true });
    writeFileSync(
      join(repoDir, "package.json"),
      JSON.stringify({ scripts: { build: "vite build" } })
    );
    expect(hasBuildScript(repoDir)).toBe(true);
  });

  it("detects repo without build script", () => {
    const repoDir = join(TEST_DIR, "static");
    mkdirSync(repoDir, { recursive: true });
    writeFileSync(
      join(repoDir, "package.json"),
      JSON.stringify({ scripts: { start: "serve" } })
    );
    expect(hasBuildScript(repoDir)).toBe(false);
  });

  it("detects repo without package.json as static", () => {
    const repoDir = join(TEST_DIR, "no-pkg");
    mkdirSync(repoDir, { recursive: true });
    writeFileSync(join(repoDir, "index.html"), "<html></html>");
    expect(hasBuildScript(repoDir)).toBe(false);
  });
});

describe("refresh-games file exclusion", () => {
  it("excludes .git directory", () => {
    expect(shouldExcludeFromCopy(".git")).toBe(true);
  });

  it("excludes node_modules", () => {
    expect(shouldExcludeFromCopy("node_modules")).toBe(true);
  });

  it("excludes README in any case", () => {
    expect(shouldExcludeFromCopy("README.md")).toBe(true);
    expect(shouldExcludeFromCopy("readme.md")).toBe(true);
    expect(shouldExcludeFromCopy("Readme.md")).toBe(true);
    expect(shouldExcludeFromCopy("README")).toBe(true);
    expect(shouldExcludeFromCopy("readme.txt")).toBe(true);
  });

  it("excludes LICENSE in any case and spelling", () => {
    expect(shouldExcludeFromCopy("LICENSE")).toBe(true);
    expect(shouldExcludeFromCopy("license")).toBe(true);
    expect(shouldExcludeFromCopy("LICENSE.md")).toBe(true);
    expect(shouldExcludeFromCopy("LICENCE")).toBe(true);
    expect(shouldExcludeFromCopy("licence.txt")).toBe(true);
  });

  it("does not exclude game files", () => {
    expect(shouldExcludeFromCopy("index.html")).toBe(false);
    expect(shouldExcludeFromCopy("game.js")).toBe(false);
    expect(shouldExcludeFromCopy("style.css")).toBe(false);
  });
});

describe("refresh-games thumbnail preservation", () => {
  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("preserves thumbnail when copying static game files", () => {
    const sourceDir = join(TEST_DIR, "source");
    mkdirSync(sourceDir, { recursive: true });
    writeFileSync(join(sourceDir, "index.html"), "<html>new</html>");
    writeFileSync(join(sourceDir, "game.js"), "console.log('game')");

    const destDir = join(TEST_DIR, "dest");
    mkdirSync(destDir, { recursive: true });
    const thumbnailData = Buffer.from("fake-png-data");
    writeFileSync(join(destDir, "thumbnail.png"), thumbnailData);
    writeFileSync(join(destDir, "index.html"), "<html>old</html>");

    copyStaticGame(sourceDir, destDir);

    expect(readFileSync(join(destDir, "index.html"), "utf-8")).toBe(
      "<html>new</html>"
    );
    expect(
      readFileSync(join(destDir, "thumbnail.png")).equals(thumbnailData)
    ).toBe(true);
  });

  it("preserves thumbnail when copying built game", () => {
    const repoDir = join(TEST_DIR, "repo-with-dist");
    const distDir = join(repoDir, "dist");
    mkdirSync(distDir, { recursive: true });
    writeFileSync(join(distDir, "index.html"), "<html>built</html>");
    writeFileSync(join(distDir, "bundle.js"), "console.log('built')");

    const destDir = join(TEST_DIR, "dest-built");
    mkdirSync(destDir, { recursive: true });
    const thumbnailData = Buffer.from("fake-png-data");
    writeFileSync(join(destDir, "thumbnail.png"), thumbnailData);

    copyBuiltGame(repoDir, destDir);

    expect(readFileSync(join(destDir, "index.html"), "utf-8")).toBe(
      "<html>built</html>"
    );
    expect(
      readFileSync(join(destDir, "thumbnail.png")).equals(thumbnailData)
    ).toBe(true);
  });
});

describe("refresh-games clone and update integration", () => {
  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("clones a repo and extracts the correct SHA", () => {
    const sourceRepo = createTestRepo("clone-test", {
      "index.html": "<html>game</html>",
    });
    const expectedSha = getRepoSha(sourceRepo);

    const cloneDir = join(TEST_DIR, "cloned");
    cloneRepo(sourceRepo, cloneDir);

    const clonedSha = execSync("git rev-parse HEAD", {
      cwd: cloneDir,
      encoding: "utf-8",
    }).trim();

    expect(clonedSha).toBe(expectedSha);
  });

  it("detects updates after new commits in source repo", () => {
    const sourceRepo = createTestRepo("update-test", {
      "index.html": "<html>v1</html>",
    });
    const sha1 = getRepoSha(sourceRepo);

    // Clone the repo (full clone for testing fetch behavior)
    const cloneDir = join(TEST_DIR, "cloned-update");
    execSync(`git clone "${sourceRepo}" "${cloneDir}"`, { stdio: "pipe" });

    // Add a new commit to source
    writeFileSync(join(sourceRepo, "index.html"), "<html>v2</html>");
    execSync("git add -A", { cwd: sourceRepo, stdio: "pipe" });
    execSync('git commit -m "update"', { cwd: sourceRepo, stdio: "pipe" });
    const sha2 = getRepoSha(sourceRepo);

    expect(sha1).not.toBe(sha2);

    // Use the actual fetchRepo and getHeadSha functions
    fetchRepo(cloneDir);
    const fetchedSha = getHeadSha(cloneDir, "main");

    expect(fetchedSha).toBe(sha2);
    expect(fetchedSha).not.toBe(sha1);
  });
});
