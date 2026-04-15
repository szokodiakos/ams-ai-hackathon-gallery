# Design: Custom Thumbnails

## Approach
Add an optional `customThumbnail?: boolean` field to the `Game` interface in `src/data/games.ts`. The generate-thumbnails script already imports from `games.ts`, so it can check this flag and skip those games.

## Alternatives Considered
- **Separate skip list in generate-thumbnails.ts** — separates knowledge from game data, easy to forget
- **`.custom` marker file** — unnecessary filesystem complexity

## Key Decisions
1. Download images and store locally as `thumbnail.png` (avoids external URL dependencies)
2. Skip custom thumbnail games in `generate-thumbnails.ts` with a log message
3. No changes needed to `GameCard.tsx` (already renders `game.thumbnail`) or `refresh-games-lib.ts` (already preserves thumbnails)
