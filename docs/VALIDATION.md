# Build 002 validation

- Eight automated tests pass: configurable deck counts for all modes; paired identities; all 27 PNG masters at 1060 × 1484; duplicate selection and third-card lock; mismatch turn passing; scoring and completion; idempotent results; draws; invalid session rejection.
- Static build succeeds without build dependencies. Only Hot Wheels artwork is packaged. Original approved image files remain unchanged in Git.
- Browser checks: setup, flip, score increase, retained turn, full Easy completion, winner screen, refresh and saved lifetime counters without double counting. Mismatch followed by refresh resumes with concealed cards and the other racer active.
- Responsive checks include 390 × 844 and 320 × 568 portrait phones, plus desktop. Small phone Hard mode fits 16 portrait cards without page scrolling; cards retain 5:7 proportions. Width calculations and compact controls were corrected during QA.
- Persistence is browser-local. Storage unavailability displays a warning; no cross-device sync or offline guarantee.
- The GitHub Actions run is the authoritative remote test, build and deployment result.
