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

const TEST_DIR = join(__dirname, "..", "..", ".test-refresh-games");
const REPOS_DIR = join(TEST_DIR, "repos");
const PUBLIC_DIR = join(TEST_DIR, "public", "games");
const SHA_FILE = join(TEST_DIR, "game-shas.json");

function readShaFile(): Record<string, string> {
  if (!existsSync(SHA_FILE)) return {};
  return JSON.parse(readFileSync(SHA_FILE, "utf-8"));
}

function writeShaFile(shas: Record<string, string>): void {
  writeFileSync(SHA_FILE, JSON.stringify(shas, null, 2) + "\n");
}

function createTestRepo(name: string, files: Record<string, string>): string {
  const repoDir = join(TEST_DIR, "source-repos", name);
  mkdirSync(repoDir, { recursive: true });
  execSync("git init", { cwd: repoDir, stdio: "pipe" });
  execSync('git config user.email "test@test.com"', { cwd: repoDir, stdio: "pipe" });
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
  return execSync("git rev-parse HEAD", { cwd: repoDir, encoding: "utf-8" }).trim();
}

describe("refresh-games SHA tracking", () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
    mkdirSync(REPOS_DIR, { recursive: true });
    mkdirSync(PUBLIC_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("returns empty object when SHA file does not exist", () => {
    const shas = readShaFile();
    expect(shas).toEqual({});
  });

  it("reads SHA file correctly", () => {
    const data = { "test-game": "abc123" };
    writeShaFile(data);
    const shas = readShaFile();
    expect(shas).toEqual(data);
  });

  it("detects stale SHA when commit differs", () => {
    const repo = createTestRepo("stale-game", {
      "index.html": "<html></html>",
    });
    const sha = getRepoSha(repo);

    writeShaFile({ "stale-game": "old-sha-that-does-not-match" });
    const shas = readShaFile();
    expect(shas["stale-game"]).not.toBe(sha);
  });

  it("detects current SHA when commit matches", () => {
    const repo = createTestRepo("current-game", {
      "index.html": "<html></html>",
    });
    const sha = getRepoSha(repo);

    writeShaFile({ "current-game": sha });
    const shas = readShaFile();
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

    const pkg = JSON.parse(readFileSync(join(repoDir, "package.json"), "utf-8"));
    expect(Boolean(pkg.scripts?.build)).toBe(true);
  });

  it("detects repo without build script", () => {
    const repoDir = join(TEST_DIR, "static");
    mkdirSync(repoDir, { recursive: true });
    writeFileSync(
      join(repoDir, "package.json"),
      JSON.stringify({ scripts: { start: "serve" } })
    );

    const pkg = JSON.parse(readFileSync(join(repoDir, "package.json"), "utf-8"));
    expect(Boolean(pkg.scripts?.build)).toBe(false);
  });

  it("detects repo without package.json as static", () => {
    const repoDir = join(TEST_DIR, "no-pkg");
    mkdirSync(repoDir, { recursive: true });
    writeFileSync(join(repoDir, "index.html"), "<html></html>");

    expect(existsSync(join(repoDir, "package.json"))).toBe(false);
  });
});

describe("refresh-games thumbnail preservation", () => {
  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("preserves thumbnail when copying static game files", () => {
    // Set up source repo
    const sourceDir = join(TEST_DIR, "source");
    mkdirSync(sourceDir, { recursive: true });
    writeFileSync(join(sourceDir, "index.html"), "<html>new</html>");
    writeFileSync(join(sourceDir, "game.js"), "console.log('game')");

    // Set up destination with existing thumbnail
    const destDir = join(TEST_DIR, "dest");
    mkdirSync(destDir, { recursive: true });
    const thumbnailData = Buffer.from("fake-png-data");
    writeFileSync(join(destDir, "thumbnail.png"), thumbnailData);
    writeFileSync(join(destDir, "index.html"), "<html>old</html>");

    // Simulate the copy logic from the script
    const thumbnailPath = join(destDir, "thumbnail.png");
    const savedThumbnail = readFileSync(thumbnailPath);

    rmSync(destDir, { recursive: true, force: true });
    mkdirSync(destDir, { recursive: true });

    // Copy source files
    const { cpSync, readdirSync } = require("fs");
    for (const entry of readdirSync(sourceDir)) {
      cpSync(join(sourceDir, entry), join(destDir, entry), { recursive: true });
    }

    // Restore thumbnail
    writeFileSync(thumbnailPath, savedThumbnail);

    // Verify
    expect(readFileSync(join(destDir, "index.html"), "utf-8")).toBe("<html>new</html>");
    expect(readFileSync(join(destDir, "thumbnail.png")).equals(thumbnailData)).toBe(true);
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

    // Clone it
    const cloneDir = join(TEST_DIR, "cloned");
    execSync(`git clone --depth 1 "${sourceRepo}" "${cloneDir}"`, { stdio: "pipe" });

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

    // Clone
    const cloneDir = join(TEST_DIR, "cloned-update");
    execSync(`git clone "${sourceRepo}" "${cloneDir}"`, { stdio: "pipe" });

    // Add a new commit to source
    writeFileSync(join(sourceRepo, "index.html"), "<html>v2</html>");
    execSync("git add -A", { cwd: sourceRepo, stdio: "pipe" });
    execSync('git commit -m "update"', { cwd: sourceRepo, stdio: "pipe" });
    const sha2 = getRepoSha(sourceRepo);

    expect(sha1).not.toBe(sha2);

    // Fetch in clone
    execSync("git fetch origin", { cwd: cloneDir, stdio: "pipe" });
    const fetchedSha = execSync("git rev-parse origin/main", {
      cwd: cloneDir,
      encoding: "utf-8",
    }).trim();

    expect(fetchedSha).toBe(sha2);
    expect(fetchedSha).not.toBe(sha1);
  });
});
