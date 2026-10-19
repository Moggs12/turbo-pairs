# Kaiden’s Turbo Pairs — Build 003

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

## Build 003 visual redesign

Bright Hot Wheels blue, flame-logo branding reused by displaying a cropped view of the approved card back, red Play button, illustrated difficulty choices and colour-coded score badges. Approved image files remain unchanged. Menu records are collapsed under Our scores.

Opening index.html directly from disk redirects to the online game. JavaScript module loading errors now provide a retry screen instead of leaving a loading message. Use npm start for local development.
