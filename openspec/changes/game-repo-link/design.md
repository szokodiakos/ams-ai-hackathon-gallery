## Context

The gallery displays game cards in a grid on the home page. Each card is a `<Link>` to the game's play page (`/games/{id}`). The `Game` interface already includes a `repoUrl: string` field populated for all 8 games, but the UI does not surface it. The app uses a retro arcade theme with neon colors, pixel fonts, and CRT effects.

## Goals / Non-Goals

**Goals:**
- Show a repo link on each game card that opens the GitHub repo in a new tab
- Prevent the repo link click from navigating to the game play page
- Match the existing arcade visual style

**Non-Goals:**
- Adding repo links to the game play/embed page (separate concern)
- Changing the data model (field already exists)
- Supporting games without a `repoUrl` (all games currently have one; can be handled later if needed)

## Decisions

### 1. Inline anchor inside the card vs. separate element outside the Link

**Choice**: Use an `<a>` tag inside the existing `<Link>` card with `onClick` calling `e.stopPropagation()` and `e.preventDefault()` on the outer navigation, then opening the URL via `window.open` or using standard anchor behavior.

**Alternative considered**: Restructure the card so the clickable area and the repo link are siblings. This would require significant refactoring of the card layout for minimal benefit.

**Rationale**: An inline `<a>` with `stopPropagation` is the simplest approach. The `<a>` tag with `target="_blank"` and `rel="noopener noreferrer"` handles the new-tab behavior natively. `stopPropagation` prevents the click from bubbling to the parent `<Link>`.

### 2. Visual treatment: icon vs. text

**Choice**: Use a small inline SVG GitHub icon with "SOURCE" text label, styled with the accent color (`--color-accent2`, magenta). Placed in the card's info section below the description.

**Alternative considered**: Icon only (less discoverable), full button (too prominent, competes with the card's primary action).

**Rationale**: A small icon + text label is discoverable without being visually dominant. Placing it at the bottom of the card info keeps it out of the way of the main content.

## Risks / Trade-offs

- **Nested interactive elements**: An `<a>` inside a Next.js `<Link>` is technically nested `<a>` tags, which is invalid HTML. → Mitigation: Restructure the card so the outer element is a `<div>` with an `onClick` handler for navigation, or use the repo link as an absolutely positioned element. The cleanest approach is to keep the `<Link>` but use `stopPropagation` on the inner `<a>` — browsers handle this correctly in practice despite the spec concern.
