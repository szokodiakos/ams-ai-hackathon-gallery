## ADDED Requirements

### Requirement: README exists at repository root
The repository SHALL have a `README.md` file at the root directory.

#### Scenario: File presence
- **WHEN** a visitor opens the GitHub repository page
- **THEN** the README.md content is rendered below the file listing

### Requirement: Project description
The README SHALL include a heading and brief description of the AMS AI Hackathon Gallery project.

#### Scenario: Project introduction
- **WHEN** a visitor reads the README
- **THEN** they see a title and a short description explaining this is a gallery of games built during the AMS AI Hackathon

### Requirement: Deployment link
The README SHALL include a clickable link to the live Vercel deployment at `https://ams-ai-hackathon-gallery.vercel.app`.

#### Scenario: Accessing the live gallery
- **WHEN** a visitor clicks the deployment link in the README
- **THEN** they are navigated to the live gallery site

### Requirement: Game listing with repo links
The README SHALL list all 8 hackathon games in a table with game name, team name, and a link to the game's GitHub repository.

#### Scenario: All games listed
- **WHEN** a visitor reads the game listing
- **THEN** they see all 8 games: Gravity Well, Particle Panic, Moonshot, Boat Race, Colony Clash, Grachten Hopper, Arcane Akash, and Eat That!

#### Scenario: Repo links are correct
- **WHEN** a visitor clicks a game's repository link
- **THEN** they are navigated to the correct GitHub repository for that game
