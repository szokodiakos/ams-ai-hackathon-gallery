## ADDED Requirements

### Requirement: E2E test detects 404 errors for game assets
The system SHALL include a Playwright E2E test that navigates to each game page, monitors network requests within the game iframe, and fails if any same-origin request returns a 404 status.

#### Scenario: Game with all assets present loads without 404s
- **WHEN** the test navigates to a game page where all assets exist
- **THEN** the test SHALL pass with zero 404 errors detected

#### Scenario: Game with missing assets triggers test failure
- **WHEN** the test navigates to a game page where one or more same-origin assets return 404
- **THEN** the test SHALL fail and report the exact URLs that returned 404

#### Scenario: External CDN requests are excluded from validation
- **WHEN** a game loads resources from an external domain (e.g., Google Fonts CDN)
- **THEN** the test SHALL NOT fail on 404s from those external requests

### Requirement: All game assets load successfully
All games in the gallery SHALL have their complete set of assets present in `public/games/<id>/` so that no same-origin requests return 404 during gameplay.

#### Scenario: EAT That game loads without 404s
- **WHEN** a user opens the "EAT That!" game
- **THEN** all sprites, sounds, and other assets SHALL load successfully with no 404 errors

#### Scenario: Particle Panic game loads without 404s
- **WHEN** a user opens the "Particle Panic" game
- **THEN** all sprites, sounds, and other assets SHALL load successfully with no 404 errors
