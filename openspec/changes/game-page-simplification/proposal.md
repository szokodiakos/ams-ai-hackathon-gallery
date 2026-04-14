## Why

The game page currently wraps the iframe with unnecessary UI chrome (title, team name, description, back link) that distracts from the game itself. Players should see only the game when they open it. The descriptions are already shown on gallery cards, so they don't need to be repeated on the game page. (Ref: GitHub issue #8)

## What Changes

- Strip the game page (`/games/[id]`) down to just the iframe — remove the title, team name, description, and back-to-gallery link
- Make the game iframe fill the viewport so the game is the entire experience
- Gallery cards already display descriptions, so no changes needed to the gallery view

## Capabilities

### New Capabilities
- `fullscreen-game-page`: Game page renders only the game iframe with no surrounding UI chrome

### Modified Capabilities

## Impact

- `src/app/games/[id]/page.tsx` — major simplification, most markup removed
- `src/components/GameEmbed.tsx` — may need styling adjustments for full-viewport display
- `e2e/games.spec.ts` — tests that assert on title, team name, back link on game pages will need updating
- `src/__tests__/GameEmbed.test.tsx` — min-height assertion may change
