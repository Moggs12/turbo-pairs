# Turbo Pairs

A family Pairs game with interchangeable Hot Wheels and Mystic Creatures themes.

**Build 001 — project foundation.** The playable UI has not been implemented or deployed yet.

## Agreed direction

- Two players sharing one phone, tablet or computer.
- One-screen difficulty choices: Easy — 3 pairs / 6 cards; Medium — 6 pairs / 12 cards; Hard — 8 pairs / 16 cards.
- Pair counts live in `src/config/game.json` so future adjustments apply to both themes.
- Matching cards earn one point and another turn. A mismatch passes the turn.
- Theme-specific artwork, branding, sounds and celebrations.
- Separate player records for each theme: wins, draws, games played and pairs collected.
- Remember names, sound preference and an unfinished game on the device.
- Responsive web app, followed by installation and offline support.
- Intended hosting: GitHub Pages. Hosting is not enabled by this setup.

## Project layout

- `src/config/`: shared settings and theme registry.
- `public/themes/hot-wheels/`: locked Deck 001 catalogue; image import pending.
- `public/themes/mystic-creatures/`: integration notes for the separate artwork workstream.
- `docs/`: requirements, score storage contract and running checklist.

See [Project brief](docs/PROJECT.md), [Score storage](docs/SCORES.md) and [Checklist](docs/CHECKLIST.md).

## Artwork baseline

Hot Wheels Deck 001 contains 26 distinct fronts and one shared back. Each front is duplicated exactly once to create 26 pairs. Master images are 1060 × 1484 pixels (5:7). The approved artwork pack is maintained separately until the image-import task is complete.

Mystic Creatures uses the same card proportions, top banner and bottom name placement. Its artwork is being prepared separately.

## Development

This commit contains configuration and planning files only. There is no build command or playable entry point yet. Build 001 implementation will add the interface, game engine and meaningful game-rule tests.
