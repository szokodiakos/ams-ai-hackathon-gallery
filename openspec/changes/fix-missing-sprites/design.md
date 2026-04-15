## Context

The AMS AI Hackathon Gallery serves 8 games as static assets under `public/games/<id>/`. Games are built by different teams using various frameworks (Vite, Phaser, Three.js, vanilla Canvas). The `refresh-games` script clones upstream repos, builds them, and copies output to `public/games/`. Existing E2E tests (Playwright) verify that game iframes load but don't detect failed asset requests within the iframe.

Two games — "EAT That!" (`eat-that`) and "Particle Panic" (`particle-panic`) — have sprites returning 404 errors at runtime. The root cause is likely that the `refresh-games` script didn't copy all necessary assets from the upstream repos.

## Goals / Non-Goals

**Goals:**
- Add E2E test that catches 404 errors for game assets across all games
- Fix the specific broken assets for `eat-that` and `particle-panic`
- Ensure the `refresh-games` script correctly copies all game assets going forward

**Non-Goals:**
- Rewriting the refresh-games script architecture
- Testing external CDN resources (e.g., Google Fonts)
- Adding runtime error monitoring beyond 404 detection

## Decisions

### 1. Playwright network interception over static asset manifest parsing
**Choice:** Use Playwright's `page.route()` / response event listeners to intercept requests and detect 404s at runtime.
**Alternative considered:** Parse each game's HTML/JS to build a static list of required assets and check file existence. Rejected because games use dynamic imports, runtime-generated URLs, and framework-specific loading patterns that static analysis would miss.

### 2. Same-origin filtering for 404 checks
**Choice:** Only fail on 404s from same-origin requests (i.e., requests to the gallery's own server).
**Alternative considered:** Check all requests including external CDNs. Rejected because external CDN failures are outside our control and would cause flaky tests. Particle Panic loads Google Fonts externally, for example.

### 3. Fix assets in public/games/ directly
**Choice:** Re-run the refresh-games script or manually add missing assets to fix the immediate problem, and investigate why the copy logic missed them.
**Alternative considered:** Only fix the refresh-games script and re-run. We'll do both — fix the script if it's broken AND ensure the assets are present.

## Risks / Trade-offs

- [Some games may intentionally load optional assets that 404] → Filter known-optional patterns or adjust test per game if needed
- [Test depends on game runtime behavior which could change upstream] → Test catches real user-facing issues, worth the maintenance cost
- [New games added in the future might have different asset patterns] → Test is generic (catches all same-origin 404s), no per-game config needed
