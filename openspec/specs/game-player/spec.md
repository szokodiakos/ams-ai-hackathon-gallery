## ADDED Requirements

### Requirement: Game player page displays game in iframe
The game player page at `/games/<game-id>` SHALL embed the game using an iframe that loads the game's `index.html` from `/games/<game-id>/index.html`.

#### Scenario: User navigates to a game player page
- **WHEN** a user navigates to `/games/snake`
- **THEN** the page displays the game title and an iframe loading `/games/snake/index.html`

#### Scenario: Iframe fills available space
- **WHEN** the game player page renders
- **THEN** the iframe occupies the full width of the content area and has a minimum height of 600px

### Requirement: Game player shows fallback for unavailable games
When a game's files are not yet available, the player page SHALL show a friendly message instead of a broken iframe.

#### Scenario: Game files not yet deployed
- **WHEN** a user navigates to a game page for a game marked as coming soon
- **THEN** the page displays the game title and a message saying the game is coming soon instead of an iframe

### Requirement: Back navigation to gallery
The game player page SHALL include a visible link or button to navigate back to the gallery landing page.

#### Scenario: User wants to return to gallery
- **WHEN** a user is on a game player page and clicks the back-to-gallery link
- **THEN** they are navigated to the gallery landing page at `/`

### Requirement: Invalid game ID shows not-found page
When a user navigates to `/games/<id>` with an ID that doesn't match any game in the data, the system SHALL return a 404 not-found page.

#### Scenario: User visits non-existent game
- **WHEN** a user navigates to `/games/nonexistent`
- **THEN** the application displays a 404 not-found page
