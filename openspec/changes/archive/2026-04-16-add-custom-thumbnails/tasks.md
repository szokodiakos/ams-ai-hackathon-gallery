# Tasks: Custom Thumbnails

## 1. Game Data Model Update
- [x] 1.1 Add optional `customThumbnail?: boolean` field to the `Game` interface in `src/data/games.ts`
- [x] 1.2 Set `customThumbnail: true` on the Particle Panic game entry
- [x] 1.3 Set `customThumbnail: true` on the Eat That game entry

## 2. Download Custom Thumbnails
- [x] 2.1 Download the Particle Panic custom thumbnail and save as `public/games/particle-panic/thumbnail.png`
- [x] 2.2 Download the Eat That custom thumbnail and save as `public/games/eat-that/thumbnail.png`

## 3. Update Thumbnail Generation Script
- [x] 3.1 Add skip logic in `scripts/generate-thumbnails.ts` to skip games where `customThumbnail` is `true`, with a console log message

## 4. Tests
- [x] 4.1 Update `src/__tests__/GameCard.test.tsx` to verify the `customThumbnail` field is accepted in mock game data
- [x] 4.2 Run `npm test` and `npm run build` to verify no regressions
