# Turbo Pairs — agreed project brief

## Platform

Build one responsive browser game with interchangeable themes. Begin with Hot Wheels; integrate Mystic Creatures when its approved deck is available. Both themes are selectable by any player. Keep game rules independent of theme assets.

The first implementation targets two players on the same device. Online multiplayer and cross-device account sync are not part of the initial scope.

## UI

1. Home/setup: logo, theme selection, player names, pair count and prominent Play button.
2. Board: large portrait cards, scores, clear current-player highlight, sound and pause controls.
3. Results: winner or draw, celebration, pair totals and Play Again.

Hot Wheels uses red, yellow and blue. Mystic Creatures uses an uncluttered pastel visual system from its artwork workstream. On phones, start by evaluating a four-column board; preserve recognisable card artwork and touch targets.

## Game rules

Shuffle a random subset of distinct identities, then duplicate each selected identity exactly once and shuffle the resulting cards. Compare stable identity IDs. Prevent selecting the same card twice, interacting with matched cards or revealing a third card while resolving a turn.

A match earns one point and another turn. On a mismatch, allow time to view both cards, then conceal them and change player. Finish when every pair is collected. Award a draw when scores are equal.

## Difficulty and screen fit

| Mode | Pairs | Cards | Initial portrait phone layout |
| --- | --- | --- | --- |
| Easy | 3 | 6 | 3 columns × 2 rows |
| Medium | 6 | 12 | 4 columns × 3 rows |
| Hard | 8 | 16 | 4 columns × 4 rows |

Easy is the default. Keep the board, scores and turn indicator on one screen without scrolling on supported phone sizes; verify the actual layout during UI testing. Preserve the 5:7 card proportions. Tablet and desktop layouts may adapt without changing the number of pairs.

The single source of truth is `src/config/game.json` → `difficulties`. Each entry stores its pair count; derive the card count as pairs × 2. Both themes and future UI controls must read these settings rather than hard-code separate counts. Check the requested pair count against the selected deck's unique identities.

Select a random subset of distinct identities from the chosen theme, duplicate each once, then shuffle. Difficulty changes the board size only. Save the selected difficulty ID and actual pair count with an unfinished game and completed result. Restore existing sessions using their saved pair count, so later configuration changes do not alter a game in progress. Theme records remain separate.

## Sound and motion

- Flip: short card flick and smooth flip.
- Match: short engine rev plus a brief card wiggle/bounce for Hot Wheels.
- Mismatch: gentle shuffle and flip-back.
- Turn change: subtle chime and current-player highlight.
- Finish: short cheer and confetti.
- Mystic Creatures uses magical chimes and sparkles through the same event hooks.

Provide a visible mute control, remember its preference, initialise audio following a player gesture, and respect reduced motion. Avoid overlapping or lengthy celebrations that hold up play.

## Artwork

Hot Wheels Deck 001 is the locked baseline: 26 individual fronts, common logo header, name footer, and a plain blue back with yellow border and centred logo. Dimensions: 1060 × 1484, exactly 5:7. Reuse identical image bytes for both members of every pair.

## Release approach

Use explicit build numbers. Build and test all three one-screen difficulty sizes, saved records and theme integration. Add home-screen installation, offline asset caching and tested update handling after the core game is stable. GitHub Pages is the intended hosting destination; publication is a separate implementation task.
