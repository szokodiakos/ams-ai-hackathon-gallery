## Why

When users open a game (e.g. `/games/boat-race`), keyboard input doesn't work until they click inside the iframe. This breaks the expected flow — players should be able to start playing immediately. GitHub issue #19.

## What Changes

- Modify `GameEmbed` to become a client component that programmatically focuses the iframe on mount
- Add a `useRef` and `useEffect` to call `.focus()` on the iframe element after render

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `game-embed`: The iframe now receives focus automatically when the game page loads, allowing immediate keyboard interaction

## Impact

- Modifies `src/components/GameEmbed.tsx` (adds `"use client"` directive, ref, and effect)
- Updates `src/__tests__/GameEmbed.test.tsx` with focus behavior tests
- No dependency or API changes
