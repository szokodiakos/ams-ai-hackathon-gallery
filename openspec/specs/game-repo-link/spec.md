## ADDED Requirements

### Requirement: Game card displays repository link
Each game card in the gallery list SHALL display a clickable link to the game's source repository. The link MUST be visible as an icon with "SOURCE" text label.

#### Scenario: Repo link is visible on a game card
- **WHEN** a user views the gallery page
- **THEN** each game card displays a repository link with a GitHub icon and "SOURCE" label

#### Scenario: Repo link opens in a new tab
- **WHEN** a user clicks the repository link on a game card
- **THEN** the game's GitHub repository opens in a new browser tab

#### Scenario: Repo link does not trigger game navigation
- **WHEN** a user clicks the repository link on a game card
- **THEN** the browser does NOT navigate to the game's play page

#### Scenario: Repo link on a coming-soon game
- **WHEN** a game has `comingSoon: true` and a `repoUrl` is present
- **THEN** the repository link is still displayed on the card

#### Scenario: Repo link matches arcade theme
- **WHEN** a user views the repository link
- **THEN** the link uses the arcade theme's accent colors and monospace/pixel font styling
