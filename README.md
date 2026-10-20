# Kaiden’s Turbo Pairs — Build 007

First playable Hot Wheels release: two racers sharing one device. Uses all 26 approved Deck 001 fronts and the shared back unchanged. Mystic Creatures is deferred and excluded from the release output.

Choose Easy (6 cards), Medium (12), or Hard (16). Counts come from src/config/game.json. Matches score one point and keep the turn; mismatches conceal after 1.2 seconds and pass the turn.

Names, sound preference, unfinished games and lifetime records are saved in this browser. Stable player IDs and theme-specific keys allow a later girl theme. Completed game IDs prevent counting results twice. Storage failures display a warning while allowing play. No account or cross-device sync.

## Run and verify

Use Node.js 22 or newer. No dependency installation is required.

    npm test
    npm run build
    npm start

Open the printed local address. dist/ contains the static release. Paths work under the GitHub Pages /turbo-pairs/ prefix. The deployment workflow tests and builds before publishing; Pages must use the GitHub Actions source.

## Scope

Keyboard controls, pause with hidden cards, reduced-motion support and a remembered mute toggle are included. Sounds are short synthesised cues. Recorded engine/cheer effects, offline caching and installation are future work. Full-resolution approved PNGs are preserved, so initial loading may be slower on mobile data.

See docs/VALIDATION.md and docs/SCORES.md.

## Build 004 visual redesign

Bright Hot Wheels blue, flame-logo branding reused by displaying a cropped view of the approved card back, red Play button, illustrated difficulty choices and colour-coded score badges. Approved image files remain unchanged. Menu records are collapsed under Our scores.

Opening index.html directly from disk redirects to the online game. JavaScript module loading errors now provide a retry screen instead of leaving a loading message. Use npm start for local development.

## Build 004: modes and adaptive board

Choose On my own, Against the computer, or Two players. Solo uses one racer, counts turns and keeps the same racer after a mismatch. Turbo Bot remembers revealed cards and chooses using that memory only; human input is disabled during its turn. Two-player mode retains the existing rules.

The board measures the space left below its controls and chooses the largest fitting grid. ResizeObserver updates it during resizing; phone landscape moves scores alongside the board. Card artwork stays at 5:7, unchanged.

Records are isolated by theme and play mode. Existing two-player record keys and unfinished races remain compatible. Solo and computer records use separate mode suffixes; the active unfinished session retains its mode and AI memory.

## Build 005: one-page ignition menu

The menu places an enlarged Hot Wheels flame logo across its top, removes the duplicate title and decorative card fan, and keeps the settings beside a round red metallic-rimmed LET’S START button. On portrait phones the starter sits alongside Continue and Scores beneath the settings. Scores open in a dialog instead of expanding the menu. All three modes, names and difficulty choices remain available.

The reference ignition button is recreated in CSS; approved card image files are unchanged. The large logo displays a clipped view of the approved card back, with its original proportions preserved.


## Build 006: Flip animation, racing sounds, and Turbo Pairs badge

The Home screen again includes the red-and-yellow KAIDEN’S TURBO PAIRS badge below the Hot Wheels logo. Gameplay updates existing card buttons in place, so 3D flipping can animate smoothly both ways rather than restarting on every move. A found pair gets a brief green highlight; a completed race displays celebratory icons after the last pair has been revealed.

Original Web Audio cues include a short whoosh for every flip, a subdued mismatch cue when cards turn back, a bright matching chime, a starter-engine flourish, and a victory fanfare. Sound preference remains device-local and the existing mute button controls every cue. Sound is enabled by default only when no saved preference exists; previously muted devices remain muted. Web Audio starts after user interaction, following mobile autoplay restrictions.

Cards and the approved image deck are not altered. Reduced-motion preferences disable visual animations, and the small landscape menu hides the supplementary title badge when space is very limited.


## Build 007: Reliable sound between games on iPhone

The sound synthesizer now has its own reusable, testable module. It detects WebKit AudioContexts left in an interrupted or closed state, creates a fresh one, and resumes suspended contexts directly from user interaction. Starting another game and switching Sound On/Off resets the stale audio context. Hiding the app closes its context so it can be recreated after iOS app switching. Race Again starts a new engine cue, while mute preferences and lifetime records are unchanged.

Audio recovery is covered by automated tests simulating a second game, interrupted contexts, suspended playback, muted output, failed/stale asynchronous resume, and unavailable Web Audio. Device testing on an actual iPhone remains necessary to confirm the root cause.

## Build 008: title placement and gentler Easy bot

Kaidens Turbo Cards sits in the blue pocket beneath the right side of the main flame logo, without a separate badge or extra menu height. Easy uses configurable 25% memory recall for each computer choice; otherwise it guesses among all legal cards. Medium and Hard retain their existing behaviour. Existing audio recovery and card animations are preserved.
