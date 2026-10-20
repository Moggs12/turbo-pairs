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

## Build 004 checks

- Fourteen automated tests pass, including solo completion/restoration, computer full-game simulations at all three difficulties, proof that computer move selection never reads hidden deck identities, and grid bounds across six available-space sizes.
- Browser checked Hard mode resizing at 1280 × 590 (eight columns, cards about 97 px wide), 390 × 844 (four columns), 320 × 568 (cards over 48 px wide), and 844 × 390 landscape (eight columns, cards over 62 px wide). No vertical page overflow in these checks.
- Browser confirmed solo mismatch/refresh keeps the same racer, computer automatic turns through completion, and mode switching shows one or two name fields appropriately.
- Header title now uses a red badge with bold yellow lettering. Approved image masters remain unchanged.

## Build 005 checks

- Fourteen rule, mode, grid and artwork tests still pass; static build and app syntax check succeed.
- Browser checked the main menu at the actual 430 × 366 compact window: page height equals viewport height, the round start button is fully visible, and the menu fits with two name fields plus Continue and Scores.
- Verified mode selection, scores dialog/return, starter button, existing-race replacement prompt, successful game launch and return to menu. No browser console errors.
- Responsive CSS includes desktop, portrait phone and short landscape arrangements. The browser viewport override did not change the current tab dimensions in this run, so additional requested dimensions were not claimed as browser-verified for this menu revision.
- No approved artwork changed. Existing gameplay and saved records remain intact.


## Build 006 validation checklist

- Run `npm test`, `node --check src/app.js`, and `npm run build` on the Build 006 branch before merge; the pull-request CI workflow performs these checks.
- Confirm card buttons retain their DOM identity between the first and second flip and during the mismatch reset; all transitions should animate instead of snapping.
- Check two different cards flip closed after 1.2 seconds and no third card can be selected while two are showing.
- Check a correct pair glows and stays visible; final pair remains visible before the winning screen and fanfare.
- Test audio muted and unmuted, reload with both settings, and check that fresh sessions default on. iOS may require a tap before sound works.
- Confirm the red-and-yellow KAIDEN’S TURBO PAIRS badge is visible under the Hot Wheels logo on a normal portrait phone, but menus still fit on short landscape displays.
- Test iPhone portrait and landscape as well as desktop; visual/audio browser acceptance is required before release.


## Build 007 mobile audio regression

- Play at least three consecutive games on iPhone (use Race Again, then Back to Garage and start another race). Each should have flip, matching and victory sounds.
- While a game is running, lock and unlock the iPhone and return from another app, tap Keep Playing, and confirm sounds resume on the next human card flip.
- Toggle Sound Off and On. Confirm no sounds while off, sounds immediately after switching on, and the preference survives closing and reopening the app.
- Confirm AI turns and delayed match/mismatch sounds do not produce lingering or duplicated audio after navigating away.
- Run `npm test`, `node --check src/audio.js`, `node --check src/app.js`, and `npm run build` before deployment; verify sound on a real device as automated mocks cannot replicate all WebKit restrictions.

## Build 008 checks

- All 25 tests pass, including existing audio recovery and animation checks. Static build succeeds.
- Easy tests cover remembered and forgotten choices without reading hidden identities. In 2,000 fixed-board opening-miss trials, next-turn full sweeps fell from 919 to 239; this is not an overall win-rate prediction.
- Title uses SVG text inside the original logo area; approved artwork is unchanged. Latest published iOS audio recovery and effects remain intact.

## Build 009 checks

- All 25 automated checks, app syntax and static build pass.
- Browser completed two-player and solo Easy races, verified accurate scores, and opened the results trophies dialog with a Back to results control.
- Adjusted result layout after finding short-window overflow; final solo results fit 895 × 503 with document height equal to viewport height. Main and result banner use one shared renderer.
- Approved PNG artwork and score storage keys are unchanged.

## Build 010 checks

- All 25 existing rule/audio/asset/layout tests pass; app syntax and build pass.
- Browser verified the initial six face-up disabled cards, concealed disabled cards during countdown, normal selection after GO, and refresh/Continue without another preview.
- Pausing during the preview cancels it, conceals the cards, and resumes normal play. No console warnings/errors.
- No new artwork, score schema, or AI memory changes.

## Build 011 checks

- Countdown now overlays only the board, after the sneak peek ends. Large yellow numbers and GO use a dark backdrop, red shadow and a reduced-motion-aware entrance.
- Browser verified the overlay exactly matches board bounds at 895 × 503, with a 161 px number. Overlay clears and all cards unlock after GO. Pause/menu cancellation removes the overlay.
- All 25 tests, app syntax and static build pass; no approved art or record keys changed.

## Build 012 checks

- All 27 tests pass, including migration of missing/invalid avatar ids and independent choice/session round trips. Syntax and build pass.
- Browser selected Shark Chomper for racer 1 and Banana Buggy for racer 2; both choices survived refresh and appeared during play and on a completed two-player result. Picker exposes all 26 approved cars. No console warnings/errors.
- After a short-window layout adjustment, the two-player menu fits 895 × 503 with document height equal to viewport height.
- Approved PNG masters and storage keys are unchanged. Racer artwork is resolved exclusively from the approved deck, with immutable settings updates preserving unfinished sessions.

## Build 013 checks

- All 30 tests pass, including exact-once difficulty counts, old wins without invented difficulty history, aggregation across modes, racer isolation, and draws without win trophies. App syntax and static build pass.
- Browser verified old earned win cups, a separate empty racer cabinet, a new Easy completion earning its cup, race records dialog, and returning to results. No console warnings/errors.
- Cabinet scrolls inside its own panel, retaining the banner and a sticky back control. At 895 × 503 the document has no horizontal or vertical overflow; the room has no horizontal overflow.
- Trophy cups/cabinet are code-native vector/CSS artwork; approved car masters remain untouched. Existing score and session storage keys remain unchanged.

## Build 014 checks

- All 32 tests, syntax and static build pass. Tests cover repeated thresholds beyond the first cup and stable recalculation without extra awards.
- Browser verified 7 Victory cups, 1 Five-star cup and 1 Easy cup from existing local records (9 total), with next targets of 8 wins, 10 wins and 2 Easy completions.
- No new storage or artwork; existing progress is retained.

## Build 015 checks

- All 33 tests pass, including noise-source effects, three short countdown tones versus a longer GO tone, mute, suspended/interrupted audio recovery and stale resume cancellation. Static build succeeds.
- Browser completed a sound-enabled solo race through countdown, three matching pairs and results without console errors or warnings. This exercises playback paths, not an independent listening/recording assessment.
- Audio unlock runs on the initial start gesture; pause resets active sound and delayed revs check the race identity and paused/hidden state. Approved art, score and trophy data are unchanged.

## Build 016 checks

- All 34 tests pass, including an immediate playful ignition cue lasting under one second. App syntax and build pass.
- The proposed real-car recording was rejected before publication; it is not included. Ignition uses three soft chugs and two rising harmonics through the existing audio engine. Other sound definitions are unchanged.
- Ignition is invoked after the countdown audio unlock, on the same start gesture, so a suspended context cannot cancel the new cue.

## Build 017 checks

- All 35 tests, app syntax and static build pass. Tests cover repeat starts, mute, stopping and blocked/unavailable media playback.
- SHA-256 confirms preview K, bundled source MP3 and built MP3 are identical (c73e532fbc9f8aafcb6e72f2d5088c78f818c927f75db812d36cc438cf5fec70). Preview decoding verified exactly 1.5 seconds.
- Browser ran a sound-enabled start into the sneak peek with no console errors/warnings. Subjective choice was made by the user using the K audition.
- Audio and credits are copied by the build. Other DSP sound definitions, approved art, scores and trophies are unchanged.

## Build 018 checks

- All 37 tests, app syntax and static build pass. New tests cover reaching all 26 cards, wrapping both ways, horizontal swipe direction and rejecting small/vertical gestures. Physical touch-device gestures were not independently exercised in this desktop browser run.
- Browser verified previous/next and keyboard navigation, 26-to-1 wrapping, selecting Banana Buggy, refresh persistence, and Large cards opening at that avatar. No console warnings/errors.
- After changing the next-race avatar, Continue retained the original Shark Chomper avatar, 0 turns and 0 pairs in the existing session.
- Viewer and menu fit 895 × 503 without document scrolling; the full 5:7 artwork is contained without cropping. No approved image masters or score/storage keys changed.
