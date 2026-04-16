## 1. Project Setup

- [ ] 1.1 Initialize Next.js project with TypeScript, Tailwind CSS, and App Router (update package.json, add tsconfig, tailwind config, postcss config, next config)
- [ ] 1.2 Create the directory structure: src/app/, src/components/, src/data/, public/games/

## 2. Data Layer

- [ ] 2.1 Create src/data/games.ts with TypeScript types and an array of 8 placeholder game entries (id, title, description, thumbnail, comingSoon flag)

## 3. Shared Components

- [ ] 3.1 Create Header component with site title linking to home
- [ ] 3.2 Create root layout (src/app/layout.tsx) with Header, global styles, and metadata

## 4. Gallery Page

- [ ] 4.1 Create GameCard component displaying title, description, thumbnail, and "Coming Soon" badge
- [ ] 4.2 Create gallery landing page (src/app/page.tsx) with responsive grid of GameCards

## 5. Game Player Page

- [ ] 5.1 Create GameEmbed component (iframe wrapper with full-width and min-height 600px)
- [ ] 5.2 Create game player page (src/app/games/[id]/page.tsx) with game title, back link, and GameEmbed or coming-soon fallback
- [ ] 5.3 Create not-found handling for invalid game IDs

## 6. Testing

- [ ] 6.1 Set up testing framework (Vitest + React Testing Library)
- [ ] 6.2 Write tests for GameCard component (renders title, description, link, coming-soon badge)
- [ ] 6.3 Write tests for gallery page (renders all 8 game cards)
- [ ] 6.4 Write tests for game player page (renders iframe for available game, shows fallback for coming-soon game, 404 for invalid ID)

## 7. Build Verification

- [ ] 7.1 Run build and fix any TypeScript or build errors
- [ ] 7.2 Verify dev server renders correctly
