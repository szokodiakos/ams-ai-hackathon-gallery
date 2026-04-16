## ADDED Requirements

### Requirement: Gallery landing page displays game grid
The system SHALL display a responsive grid of game cards on the landing page at the root URL (`/`). The grid SHALL show all 8 game slots with their title, description, and thumbnail image.

#### Scenario: User visits the gallery
- **WHEN** a user navigates to the root URL `/`
- **THEN** the page displays a grid of 8 game cards, each showing the game's title, description, and thumbnail

#### Scenario: Gallery on mobile viewport
- **WHEN** a user views the gallery on a viewport narrower than 640px
- **THEN** the grid displays 1 card per row

#### Scenario: Gallery on tablet viewport
- **WHEN** a user views the gallery on a viewport between 640px and 1024px
- **THEN** the grid displays 2 cards per row

#### Scenario: Gallery on desktop viewport
- **WHEN** a user views the gallery on a viewport wider than 1024px
- **THEN** the grid displays 3 or 4 cards per row

### Requirement: Game cards link to game player
Each game card SHALL be a clickable link that navigates the user to that game's player page at `/games/<game-id>`.

#### Scenario: User clicks a game card
- **WHEN** a user clicks on a game card with id `snake`
- **THEN** the browser navigates to `/games/snake`

### Requirement: Gallery displays placeholder content for unready games
Game cards for games that do not yet have playable content SHALL still appear in the grid with placeholder thumbnails and a visual indicator that the game is coming soon.

#### Scenario: Game has no playable content
- **WHEN** a game entry exists in the game data but has no associated game files
- **THEN** the card displays a "Coming Soon" badge and a placeholder thumbnail

### Requirement: Site header with navigation
The application SHALL include a persistent header with the site title "AMS AI Hackathon Gallery" and a link back to the gallery homepage.

#### Scenario: Header appears on all pages
- **WHEN** a user visits any page in the application
- **THEN** the header is visible at the top with the site title

#### Scenario: Header title links to home
- **WHEN** a user clicks the site title in the header
- **THEN** they are navigated to the gallery landing page at `/`
