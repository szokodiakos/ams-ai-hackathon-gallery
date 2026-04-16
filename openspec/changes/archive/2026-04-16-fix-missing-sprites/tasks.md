## 1. E2E Asset Validation Test

- [x] 1.1 Add Playwright E2E test in `e2e/game-assets.spec.ts` that navigates to each game page, intercepts same-origin network requests, and fails on any 404 response
- [x] 1.2 Run the new test to identify the exact URLs returning 404 for `eat-that` and `particle-panic`

## 2. Fix Missing Assets

- [x] 2.1 Investigate the broken asset URLs and determine root cause (missing files in `public/games/` or broken refresh-games copy logic)
- [x] 2.2 Fix the missing assets — add files to `public/games/` or fix `scripts/refresh-games-lib.ts` copy logic
- [x] 2.3 Re-run the asset validation test to confirm 404s are resolved

## 3. Verification

- [x] 3.1 Run full E2E test suite and verify all tests pass
- [x] 3.2 Run build (`npm run build`) and verify it succeeds
