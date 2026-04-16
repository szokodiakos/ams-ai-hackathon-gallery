## Why

The AMS AI Hackathon Gallery needs a web application to showcase 8 team hackathon games. Users should be able to visit the gallery, browse the available games, and play any game directly in the browser. All games are client-side JavaScript/TypeScript and require no server — we just need a skeleton app to host and present them. (GitHub issue #1)

## What Changes

- Add a Next.js application with App Router, TypeScript, and Tailwind CSS
- Create a landing page with a responsive grid of game cards (8 placeholder slots)
- Create a game detail/play page that embeds each game in an iframe
- Add navigation between the gallery and individual game pages
- Configure the project for Vercel deployment

## Capabilities

### New Capabilities
- `game-gallery`: Landing page with responsive grid displaying 8 game cards with titles, descriptions, and thumbnails
- `game-player`: Game detail page that loads and embeds a selected game for play, with navigation back to gallery

### Modified Capabilities
<!-- None — this is the initial skeleton -->

## Impact

- New dependencies: Next.js, React, Tailwind CSS, TypeScript
- New directory structure: `src/app/` for pages, `src/components/` for shared UI, `public/games/` for game assets
- Vercel deployment config may need updating for the Next.js framework preset
- `package.json` scripts will be updated with `dev`, `build`, `start`, and `test` commands

### Acceptance Criteria

- Landing page renders a grid of 8 game cards with placeholder content
- Clicking a game card navigates to that game's play page
- Game play page shows game title and an iframe/embed area for the game
- Navigation back to gallery works from the game page
- Layout is responsive (mobile, tablet, desktop)
- Project builds successfully and deploys on Vercel
