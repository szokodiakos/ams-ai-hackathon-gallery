## Why

Games in the gallery are served as static files in `public/games/{id}/`, manually copied from their source repositories. When game teams push updates, the gallery becomes stale with no way to detect or pull changes. A refresh script automates keeping the gallery in sync with upstream game repos. (GitHub issue #10)

## What Changes

- Add a `scripts/refresh-games.ts` script that:
  - Reads game repository URLs from `src/data/games.ts`
  - Clones or pulls each game repo into a local cache directory (`.game-repos/`)
  - Tracks per-game commit SHAs in `scripts/game-shas.json`
  - Compares each repo's current main branch HEAD against the stored SHA
  - For changed games: detects build system, builds if needed, copies output to `public/games/{id}/`
  - Regenerates thumbnails for updated games
  - Reports which games were updated and which were already current
- Add `refresh-games` npm script to `package.json`
- Add `.game-repos/` to `.gitignore`

### Acceptance Criteria

- Running `npm run refresh-games` updates all stale game files in `public/games/`
- Games with no upstream changes are skipped
- `scripts/game-shas.json` accurately tracks the last-pulled commit per game
- Both Vite-based and plain static games are handled correctly
- Script exits with clear reporting of what was updated

## Capabilities

### New Capabilities
- `game-refresh`: Script to detect and pull upstream game repository changes into the gallery's static game files

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- New files: `scripts/refresh-games.ts`, `scripts/game-shas.json`
- Modified files: `package.json` (new script), `.gitignore` (cache dir)
- Runtime dependencies: `git` CLI must be available
- Updates `public/games/` directory contents when games have changed
