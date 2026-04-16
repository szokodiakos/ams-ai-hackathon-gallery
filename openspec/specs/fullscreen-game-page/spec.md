## ADDED Requirements

### Requirement: Game page displays only the game iframe
The game page at `/games/[id]` SHALL render only the game iframe with no surrounding UI elements. There SHALL be no title, team name, description, back link, or any other chrome on the page.

#### Scenario: User navigates to an available game
- **WHEN** user navigates to `/games/{id}` for a game that is not "coming soon"
- **THEN** the page displays only the game iframe with no title, team name, description, or navigation links

#### Scenario: User navigates to a coming-soon game
- **WHEN** user navigates to `/games/{id}` for a game marked as "coming soon"
- **THEN** the page displays a placeholder indicating the game is not yet available

#### Scenario: User navigates to a non-existent game
- **WHEN** user navigates to `/games/{id}` with an invalid game ID
- **THEN** the page returns a not-found response

### Requirement: Game iframe fills the viewport
The game iframe SHALL fill the full browser viewport (100% width and height) so the game is the entire visual experience on the page.

#### Scenario: Game page renders at full viewport
- **WHEN** the game page loads for an available game
- **THEN** the iframe occupies the full width and height of the viewport with no padding, margins, or borders

### Requirement: Gallery cards display game descriptions
The gallery page SHALL continue to display game descriptions on each card. (This is already the current behavior and SHALL be preserved.)

#### Scenario: Gallery shows description on each card
- **WHEN** user views the gallery page
- **THEN** each game card displays the game title, team name, and description
