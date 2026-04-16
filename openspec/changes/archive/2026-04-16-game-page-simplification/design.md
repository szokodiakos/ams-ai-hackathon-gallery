## Context

The game page at `/games/[id]` currently renders a back link, game title, team name, description, and then the game iframe. The issue requests stripping all of this away so the game page shows only the iframe. The gallery page already shows descriptions on each card, so no information is lost.

## Goals / Non-Goals

**Goals:**
- Game page shows only the game iframe, filling the available viewport
- No navigation chrome, metadata, or description on the game page
- Maintain the "coming soon" placeholder for unreleased games

**Non-Goals:**
- Changing the gallery/lister page layout (descriptions are already displayed there)
- Adding new navigation mechanisms (e.g., keyboard shortcuts to go back)
- Changing the iframe sandbox permissions or game loading behavior

## Decisions

**1. Remove all markup except the iframe from the game page**
- The page component will render only `<GameEmbed>` (or inline the iframe directly)
- Rationale: Simplest approach — the issue says "just the game"
- Alternative: Keep a minimal floating back button — rejected because the issue says "no header whatsoever"

**2. Make the iframe fill the viewport**
- Use `100vh`/`100vw` sizing on the iframe so the game occupies the full browser window
- Remove padding/margins from the game page layout
- Rationale: With no other UI elements, the game should use all available space
- Alternative: Keep the current max-width container — rejected because it leaves dead space around the iframe with no purpose

**3. Keep `GameEmbed` component but update its styling**
- Update `GameEmbed` to render full-viewport by default
- Rationale: The component encapsulates iframe config (sandbox, allow attributes) — worth keeping as a single source of truth
- Alternative: Inline the iframe in the page — simpler but loses the encapsulation

## Risks / Trade-offs

- **No visible back navigation** → Users must use browser back button. This is acceptable per the issue requirements.
- **Full-viewport iframe may conflict with root layout padding** → Mitigation: Override layout styles on the game page or use a minimal layout.
