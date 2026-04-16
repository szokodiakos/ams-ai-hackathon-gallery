# Add Custom Thumbnails

## Problem
The auto-generated thumbnails for Particle Panic and Eat That don't represent the games well. The issue author has provided custom screenshots that better showcase these games.

## Solution
- Download and replace thumbnails for Particle Panic and Eat That with the provided custom images
- Add a `customThumbnail` flag to the `Game` interface so games can opt out of auto-generation
- Update the `generate-thumbnails` script to skip games that have `customThumbnail: true`

## Acceptance Criteria
- Particle Panic displays the custom thumbnail from the issue
- Eat That displays the custom thumbnail from the issue
- Running `npm run generate-thumbnails` does not overwrite the custom thumbnails
- All other games continue to use auto-generated thumbnails as before

Ref: GitHub issue #22
