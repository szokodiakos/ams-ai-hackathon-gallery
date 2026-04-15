## Why

Games "EAT That!" and "Particle Panic" have sprites returning 404 errors, making them unplayable. The existing E2E tests only verify iframe loading — they don't check for failed network requests inside the game. This needs fixing so players can actually enjoy these games. (GitHub issue #18)

## What Changes

- Add a Playwright E2E test that intercepts network requests inside each game's iframe and fails on any 404 response (same-origin only, excluding external CDNs)
- Investigate and fix the missing assets for `eat-that` and `particle-panic` — either add missing files to `public/games/` or fix the `refresh-games` copy logic in `scripts/refresh-games-lib.ts`

## Capabilities

### New Capabilities
- `game-asset-validation`: E2E test that verifies all game assets load without 404 errors across all games

### Modified Capabilities

## Impact

- `e2e/` — New Playwright test file for asset validation
- `public/games/eat-that/` — Missing sprite/asset files to be added or fixed
- `public/games/particle-panic/` — Missing sprite/asset files to be added or fixed
- `scripts/refresh-games-lib.ts` — Potentially fix copy logic if it's not preserving all assets
