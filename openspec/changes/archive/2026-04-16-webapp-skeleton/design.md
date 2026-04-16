## Context

The AMS AI Hackathon Gallery is a new project with no application code yet — only OpenSpec infrastructure and a GitHub watcher. We need to bootstrap a web application that serves as the gallery for 8 hackathon games. All games are client-side JS/TS, so the host app is purely a presentation and navigation layer with no backend API requirements.

## Goals / Non-Goals

**Goals:**
- Establish the project's tech stack and directory structure
- Create a working gallery landing page with 8 game card placeholders
- Create a game player page that can embed client-side games
- Ensure responsive layout across mobile, tablet, and desktop
- Deploy successfully on Vercel

**Non-Goals:**
- Implementing any actual games (games will be added in future issues)
- User authentication or accounts
- Server-side game logic or APIs
- Analytics or tracking
- Game scoring/leaderboard systems

## Decisions

### 1. Framework: Next.js with App Router

**Choice**: Next.js 15 with App Router, TypeScript, Tailwind CSS

**Alternatives considered**:
- **Vite + React**: Simpler, but lacks file-based routing and Vercel-native integration
- **Astro**: Great for static content, but less ecosystem support for interactive game embedding
- **Plain HTML/CSS/JS**: Too low-level for maintainable multi-page app

**Rationale**: Next.js has first-class Vercel support, App Router provides clean file-based routing, and the static export capability means we can keep things simple. Tailwind enables rapid responsive design without custom CSS overhead.

### 2. Game embedding: iframe-based

**Choice**: Each game will be embedded via an `<iframe>` pointing to files in `public/games/<game-id>/index.html`.

**Alternatives considered**:
- **Dynamic import of game components**: Tight coupling, requires games to be React components
- **Web Components**: Good isolation but adds complexity for game authors

**Rationale**: Iframes provide complete isolation between the gallery app and each game. Games can use any framework or vanilla JS. This is the simplest approach that allows maximum flexibility for game teams.

### 3. Game data: static configuration file

**Choice**: A `src/data/games.ts` file containing an array of game metadata (id, title, description, thumbnail, etc.).

**Alternatives considered**:
- **CMS or database**: Overkill for 8 static entries
- **Filesystem-based discovery**: Fragile and harder to add metadata

**Rationale**: A simple TypeScript array is easy to maintain, type-safe, and requires no external dependencies. When a game team is ready, they add their game files to `public/games/<id>/` and update the metadata entry.

### 4. Project structure

```
src/
  app/
    layout.tsx          # Root layout with header/nav
    page.tsx            # Gallery landing page
    games/[id]/
      page.tsx          # Game player page
  components/
    GameCard.tsx        # Card component for gallery grid
    GameEmbed.tsx       # Iframe wrapper for game player
    Header.tsx          # Site header with navigation
  data/
    games.ts            # Game metadata array
public/
  games/                # Game files (each game in its own subdirectory)
```

## Risks / Trade-offs

- **iframe sandbox limitations** → Games that need to access parent window APIs won't work. Mitigation: configure sandbox attributes to allow scripts and same-origin access where needed.
- **No actual games yet** → The skeleton will show placeholder content. Mitigation: use clear placeholder UI so it's obvious where games will appear.
- **SEO not a priority** → Gallery is an internal hackathon tool. Acceptable trade-off for simpler implementation.

## Integration

This is the first application code in the repository. It replaces the current `package.json` (which only has OpenSpec) with a full Next.js project. The existing `openspec/`, `.claude/`, and `scripts/` directories remain untouched.
