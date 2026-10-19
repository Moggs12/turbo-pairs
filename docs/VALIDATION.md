# Build 002 validation

- Eight automated tests pass: configurable deck counts for all modes; paired identities; all 27 PNG masters at 1060 × 1484; duplicate selection and third-card lock; mismatch turn passing; scoring and completion; idempotent results; draws; invalid session rejection.
- Static build succeeds without build dependencies. Only Hot Wheels artwork is packaged. Original approved image files remain unchanged in Git.
- Browser checks: setup, flip, score increase, retained turn, full Easy completion, winner screen, refresh and saved lifetime counters without double counting. Mismatch followed by refresh resumes with concealed cards and the other racer active.
- Responsive checks include 390 × 844 and 320 × 568 portrait phones, plus desktop. Small phone Hard mode fits 16 portrait cards without page scrolling; cards retain 5:7 proportions. Width calculations and compact controls were corrected during QA.
- Persistence is browser-local. Storage unavailability displays a warning; no cross-device sync or offline guarantee.
- The GitHub Actions run is the authoritative remote test, build and deployment result.

## Build 003 redesign checks

- Flame-logo branding displays a cropped view of the existing approved card back; no master images were changed or replaced.
- New bright blue/red/yellow menu, picture-led difficulties, red Play button, score badges and turn banner checked in the browser.
- Hard mode checked at 1280 × 900 and 320 × 568: all 16 cards fit without vertical scrolling. Small-phone cards remain over 51 pixels wide.
- Phone menu checked at 390 × 844; main Play button is visible. Records are collapsed to simplify setup.
- Card flipping and saved-race resume checked after UI changes. All eight automated rule/asset tests still pass.
- Direct file opening redirects to the hosted game; module-loading failures display retry guidance.
