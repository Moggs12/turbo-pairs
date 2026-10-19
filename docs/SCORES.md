# Theme-specific score storage

## Identity and isolation

Use stable player IDs, with display names stored separately. Renaming a player must not reset their records. Save records under the stable theme ID, never under a display label or a gender label.

- `turbo-pairs:v1:records:hot-wheels`
- `turbo-pairs:v1:records:mystic-creatures`

Each player has independent gamesPlayed, wins, losses, draws and pairsCollected counters in each theme. Theme switching must neither reset nor combine records.

## Results

Only completed games update lifetime records. A completed game's result is applied once, using a unique game ID to prevent double counting after refresh, resume or repeated result-screen rendering. Each participant's pairsCollected counter increases by their final in-game score. Draws increment draws for both players and wins for neither.

## Sessions and settings

Save unfinished sessions independently under `turbo-pairs:v1:session:{themeId}`. Store the shuffled deck, collected pairs, scores, active player and game ID. If interrupted while a mismatch is resolving, restore a safe state with the mismatched cards concealed and the turn passed exactly once.

Global names and sound preferences may be shared. Theme records remain independent. Show each theme's leader separately; do not silently blend them into one leaderboard.

Initial persistence is device/browser-local. No cross-device sync is promised. Handle unavailable storage gracefully so a game can still be played, and never report a save as successful when it failed.

## Build 004 modes

The original records:hot-wheels key remains two-player records. Solo and computer games use records:hot-wheels:solo and records:hot-wheels:ai respectively (all under the turbo-pairs:v1 prefix). A finished solo game increments games played, completed wins and pairs for its one participant. Mode selection is remembered with settings. The current unfinished session stores mode and revealed-card memory. Legacy sessions without mode restore as two-player games.
