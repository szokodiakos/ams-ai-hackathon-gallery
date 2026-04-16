## 1. Setup

- [ ] 1.1 Add `.game-repos/` to `.gitignore`
- [ ] 1.2 Add `refresh-games` npm script to `package.json`

## 2. Core Script Implementation

- [ ] 2.1 Create `scripts/refresh-games.ts` with main entry point that imports games from `src/data/games.ts`
- [ ] 2.2 Implement repository clone/fetch logic: clone with `--depth 1` if not cached, fetch + reset if cached
- [ ] 2.3 Implement default branch detection using `git remote show origin` or `git symbolic-ref refs/remotes/origin/HEAD`
- [ ] 2.4 Implement SHA comparison: read `scripts/game-shas.json`, compare with current HEAD, skip unchanged games
- [ ] 2.5 Implement build detection: check `package.json` for `scripts.build`, run `npm install && npm run build` if present
- [ ] 2.6 Implement file copy: copy `dist/` for built games or repo root for static games to `public/games/{id}/`, preserving thumbnails
- [ ] 2.7 Write updated SHAs to `scripts/game-shas.json` after successful updates
- [ ] 2.8 Implement summary reporting: list updated, skipped, and failed games

## 3. Testing

- [ ] 3.1 Write unit tests for SHA comparison logic (stale, current, missing SHA file)
- [ ] 3.2 Write unit tests for build detection heuristic
- [ ] 3.3 Write integration test verifying end-to-end script behavior with a mock git repo

## 4. Finalize

- [ ] 4.1 Run the script against real game repos to verify it works
- [ ] 4.2 Commit all changes and create PR
