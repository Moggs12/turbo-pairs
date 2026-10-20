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
