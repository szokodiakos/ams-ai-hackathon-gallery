## ADDED Requirements

### Requirement: Script reads game repositories from games.ts
The refresh script SHALL import the `games` array from `src/data/games.ts` and use each game's `repoUrl` to identify upstream repositories.

#### Scenario: All games are processed
- **WHEN** the script is run
- **THEN** it SHALL attempt to check/update every game in the `games` array that has a `repoUrl`

### Requirement: Script clones or fetches game repositories
The refresh script SHALL clone each game repository into `.game-repos/{game-id}/` on first run, and fetch updates on subsequent runs.

#### Scenario: First run — repository not yet cloned
- **WHEN** the script runs and `.game-repos/{game-id}/` does not exist
- **THEN** it SHALL clone the repository with `--depth 1` into that directory

#### Scenario: Subsequent run — repository already cloned
- **WHEN** the script runs and `.game-repos/{game-id}/` already exists
- **THEN** it SHALL fetch the latest changes from the remote and reset to the default branch HEAD

### Requirement: Script tracks commit SHAs
The refresh script SHALL maintain a `scripts/game-shas.json` file mapping each game ID to the commit SHA it was last updated from.

#### Scenario: SHA file does not exist
- **WHEN** the script runs and `scripts/game-shas.json` does not exist
- **THEN** it SHALL treat all games as needing an update

#### Scenario: SHA file exists with current data
- **WHEN** the script runs and a game's current HEAD SHA matches the stored SHA
- **THEN** the game SHALL be skipped

#### Scenario: SHA file exists with stale data
- **WHEN** the script runs and a game's current HEAD SHA differs from the stored SHA
- **THEN** the game SHALL be updated and the SHA file SHALL be written with the new SHA

### Requirement: Script detects build system
The refresh script SHALL detect whether a game repository requires a build step by checking for a `package.json` with a `build` script in the repo root.

#### Scenario: Repository has a build script
- **WHEN** the repo root contains a `package.json` with a `scripts.build` entry
- **THEN** the script SHALL run `npm install` and `npm run build`, then copy the `dist/` directory contents to `public/games/{game-id}/`

#### Scenario: Repository has no build script
- **WHEN** the repo root does not contain a `package.json` with a `scripts.build` entry
- **THEN** the script SHALL copy the repo contents directly to `public/games/{game-id}/`, excluding `.git/`, `node_modules/`, `package.json`, `package-lock.json`, and other non-game files

### Requirement: Script preserves thumbnails
The refresh script SHALL NOT overwrite existing `thumbnail.png` files when copying game files, as these are generated separately.

#### Scenario: Game directory has existing thumbnail
- **WHEN** a game is updated and `public/games/{game-id}/thumbnail.png` exists
- **THEN** the thumbnail SHALL be preserved after the update

### Requirement: Script handles default branch detection
The refresh script SHALL detect the default branch name of each repository rather than assuming `main`.

#### Scenario: Repository uses main branch
- **WHEN** the repository's default branch is `main`
- **THEN** the script SHALL fetch and compare against `main`

#### Scenario: Repository uses master branch
- **WHEN** the repository's default branch is `master`
- **THEN** the script SHALL fetch and compare against `master`

### Requirement: Script reports results
The refresh script SHALL print a summary of actions taken after processing all games.

#### Scenario: Some games updated
- **WHEN** the script completes and some games were updated
- **THEN** it SHALL list which games were updated and which were already current

#### Scenario: All games current
- **WHEN** the script completes and no games needed updating
- **THEN** it SHALL report that all games are up to date

#### Scenario: A game fails to update
- **WHEN** a game's clone, build, or copy step fails
- **THEN** the script SHALL log the error, continue processing remaining games, and include the failure in the final summary

### Requirement: Script is runnable via npm
The refresh script SHALL be registered as an npm script so it can be run with `npm run refresh-games`.

#### Scenario: Running the script
- **WHEN** a user runs `npm run refresh-games`
- **THEN** the script SHALL execute and process all games
