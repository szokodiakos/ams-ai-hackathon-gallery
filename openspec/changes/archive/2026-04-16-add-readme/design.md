## Context

The repository currently has no README.md. Visitors landing on the GitHub page see only the file listing and CLAUDE.md, with no introduction to the project, no link to the live gallery, and no index of games.

## Goals / Non-Goals

**Goals:**
- Provide a clear project description for repository visitors
- Link to the live Vercel deployment
- List all 8 games with team names and repo links

**Non-Goals:**
- Contributing guide or development setup instructions (CLAUDE.md covers dev workflow)
- Badges, CI status, or other metadata
- Screenshots or embedded images

## Decisions

**Static markdown file at repo root**
- Rationale: A simple `README.md` is the standard convention for GitHub repos. No build step or templating needed.
- Alternative considered: Generating README from `src/data/games.ts` at build time. Rejected because the game list changes rarely and manual sync is acceptable for 8 entries.

**Structure: heading, description, deployment link, game table**
- Rationale: A table provides a compact, scannable format for 8 games with name, team, and repo link.
- Alternative considered: Bullet list. Rejected because a table is denser and easier to scan.

## Risks / Trade-offs

- [Game list may drift from `src/data/games.ts`] → Acceptable for 8 entries; could add a generation script later if the list grows.
