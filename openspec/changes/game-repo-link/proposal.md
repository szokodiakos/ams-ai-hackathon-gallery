## Why

The game list cards display title, team name, and description but do not link to the source repository. Each game already stores a `repoUrl` in its data — surfacing it in the UI lets visitors explore the code behind each game. Relates to GitHub issue #13.

## What Changes

- Add a clickable repository link to each `GameCard` in the gallery grid
- The link opens the game's GitHub repo in a new tab
- Clicking the repo link does not navigate to the game's play page (event propagation is stopped)
- The link follows the existing retro arcade visual style

### Acceptance Criteria

1. Each game card in the list shows a repo link (icon or text)
2. Clicking the link opens the `repoUrl` in a new browser tab
3. Clicking the link does not trigger navigation to the game page
4. The link is visually consistent with the arcade theme
5. Games with `comingSoon: true` still show the repo link if a URL is present

## Capabilities

### New Capabilities
- `game-repo-link`: Display a repository link on each game card in the gallery list

### Modified Capabilities

_(none)_

## Impact

- `src/components/GameCard.tsx` — add repo link element with click handler
- No new dependencies required
- No API or data model changes (field already exists)
