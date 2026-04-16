## 1. Strip Game Page

- [x] 1.1 Simplify `src/app/games/[id]/page.tsx` to render only the `GameEmbed` component (and coming-soon placeholder), removing title, team name, description, and back link
- [x] 1.2 Remove container padding/max-width from the game page so the iframe can fill the viewport

## 2. Full-Viewport Iframe

- [x] 2.1 Update `GameEmbed` component to use `100vw`/`100vh` sizing with no borders, padding, or margins

## 3. Update Tests

- [x] 3.1 Update e2e tests in `e2e/games.spec.ts` to remove assertions for title, team name, and back link on game pages
- [x] 3.2 Update unit tests in `src/__tests__/GameEmbed.test.tsx` to reflect new full-viewport styling
- [x] 3.3 Run all tests and verify they pass
