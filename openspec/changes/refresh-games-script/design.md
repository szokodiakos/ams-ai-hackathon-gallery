## Context

The gallery serves 8 games as static files from `public/games/{id}/`. Each game has a `repoUrl` in `src/data/games.ts` pointing to its source repository. Currently, game files are manually copied — there is no mechanism to detect or pull upstream changes.

Games fall into two build categories:
- **Vite-based** (eat-that, grachten-hopper, moonshot, particle-panic): produce hashed `assets/index-*.js` bundles via `npm run build`, output to `dist/`
- **Plain static** (arcane-akash, boat-race, colony-clash, gravity-well): source files are served directly, no build step needed

## Goals / Non-Goals

**Goals:**
- Automate detection of upstream game changes via git SHA comparison
- Support both Vite-based and plain static game repositories
- Produce clear reporting of which games were updated
- Regenerate thumbnails for updated games
- Be runnable as a single npm script

**Non-Goals:**
- CI/CD integration or automatic scheduled runs (can be added later)
- Handling private repositories or authentication beyond default git credentials
- Modifying game source code or patching games
- Supporting monorepo game structures (all current games are standalone repos)

## Decisions

### 1. TypeScript script using tsx

**Choice:** `scripts/refresh-games.ts` executed via `npx tsx`

**Alternatives considered:**
- Shell script: harder to parse `games.ts` data, less portable
- Node.js with esbuild: unnecessary complexity for a dev script

**Rationale:** Consistent with existing `scripts/generate-thumbnails.ts`. Can import `games` directly from `src/data/games.ts`.

### 2. Git clone cache in `.game-repos/`

**Choice:** Cache cloned repos in `.game-repos/{game-id}/` at project root, added to `.gitignore`.

**Alternatives considered:**
- System temp directory: lost between reboots, slower for repeat runs
- Inside `node_modules/.cache`: unconventional, could be cleared by `npm ci`

**Rationale:** Persistent local cache means subsequent runs only need `git fetch` + `git reset` instead of full clones. The `.game-repos/` name is descriptive and mirrors the project convention.

### 3. SHA tracking in `scripts/game-shas.json`

**Choice:** A JSON file mapping `{ [gameId]: commitSha }`, committed to the repo.

**Rationale:** Committing the SHA file means the gallery repo itself records which version of each game is deployed. This enables reproducibility — anyone checking out the gallery at a given commit knows exactly which game versions were included.

### 4. Build detection heuristic

**Choice:** Check for `package.json` with a `build` script in the repo root. If present, run `npm install && npm run build` and copy `dist/` contents. Otherwise, copy the entire repo (excluding `.git/`, `node_modules/`, etc.).

**Alternatives considered:**
- Per-game configuration in `games.ts`: requires maintaining extra metadata
- Always run build: breaks for repos without a build step

**Rationale:** Simple heuristic that works for all 8 current games. If a game has a `package.json` with a `build` script, it's a buildable project. Otherwise, it's plain static files.

### 5. Thumbnail regeneration via existing script

**Choice:** Call `generate-thumbnails.ts` logic for updated games only.

**Rationale:** Reuse existing infrastructure. The thumbnail script already knows how to screenshot games.

## Integration with existing code

- Imports `games` array from `src/data/games.ts` (same as `generate-thumbnails.ts`)
- Uses `child_process.execSync` for git and npm commands
- Writes to `public/games/{id}/` (same output location as current manual process)
- New npm script `refresh-games` in `package.json`

## Risks / Trade-offs

- **[Build environment differences]** → Games are built in the gallery maintainer's environment, not the game team's CI. Mitigation: use `npm ci` for deterministic installs where lockfile exists.
- **[Large repo clones on first run]** → First run clones all 8 repos. Mitigation: use `--depth 1` shallow clones, subsequent runs only fetch.
- **[Build failures in upstream repos]** → A broken game repo could fail the script. Mitigation: catch errors per-game and continue with others, reporting failures at the end.
- **[Default branch naming]** → Some repos may use `master` instead of `main`. Mitigation: detect default branch from `origin/HEAD` or try both.
