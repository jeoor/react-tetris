# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm start            # dev server at http://127.0.0.1:8080/ (webpack-dev-server, HMR enabled)
npm run build        # production build → docs/ directory
```

No test suite exists. ESLint runs via webpack loader during dev/build (airbnb config).

## Architecture

Tetris game built with **React 15 + Redux 3 + Immutable.js 3**. All Redux state is Immutable (via `redux-immutable`'s `combineReducers`). State accessed with `.get()` not dot notation.

### State Flow

```
control/index.js (keyboard DOM listeners)
  → control/todo/*.js (action dispatchers per key)
    → actions/index.js (action creators)
      → reducers/* (Immutable state updates)
        → containers/index.js (connect → render)
```

### Key Directories

- **`src/unit/`** — Core game logic, not React-specific
  - `const.js` — Block shapes (I/L/J/Z/S/O/T), speeds, scoring, localStorage key, i18n, viewport detection
  - `block.js` — `Block` class with `rotate()`, `fall()`, `left()`, `right()` methods. Returns plain objects (not Block instances) for Redux compatibility
  - `index.js` — `want()` (collision detection), `isClear()` (line clear check), `isOver()` (game over check), `subscribeRecord()` (localStorage persistence)
  - `music.js` — Web Audio API: single `music.mp3` sliced by time offsets for different sound effects (start, clear, fall, rotate, move, gameover)
  - `reducerType.js` — All Redux action type constants

- **`src/control/`** — Game flow controller (outside React)
  - `states.js` — Central game logic: `start()`, `auto()` (fall loop via setTimeout), `nextAround()`, `clearLines()`, `pause()`, `focus()`, `overStart()`/`overEnd()`. Dispatches directly to store.
  - `index.js` — Keyboard event binding (keydown/keyup → todo handlers)
  - `todo/` — Per-key handlers: left, right, down, rotate, space (drop), p (pause), s (music), r (reset)

- **`src/reducers/`** — 16 reducers, one per game property. Each returns Immutable data.

- **`src/components/`** — Presentational components (Matrix, Next, Keyboard, Number, etc.)
- **`src/containers/index.js`** — Single container component, maps all state via `connect()`

### Game Grid

20 rows × 10 columns. Matrix stored as `List` of `List`s (0 = empty, 1 = filled). Current piece (`cur`) is a `Block` instance stored separately from the matrix.

### State Persistence

Entire Redux state serialized to `localStorage` under key `REACT_TETRIS` (base64-encoded). On page load, `lastRecord` restores game state. Works at any game moment (mid-clear, game-over, etc.).

### Keyboard Mapping

| Key | Code | Action |
|-----|------|--------|
| ← | 37 | left |
| ↑ | 38 | rotate |
| → | 39 | right |
| ↓ | 40 | down |
| Space | 32 | drop |
| S | 83 | toggle music |
| R | 82 | reset |
| P | 80 | pause |

Touch events handled separately in keyboard component for mobile.

### i18n

Languages: cn, en, fr, fa. Selected via `?lan=en` URL parameter. Default: cn. Strings in `i18n.json`.

### Webpack

Shared config in `w.config.js`. Dev config: `webpack.config.js` (outputs to `server/`). Prod config: `webpack.production.config.js` (outputs to `docs/`). CSS uses Less with CSS Modules (`[hash:base64:4]` class names).

### CI/CD

GitHub Actions (`.github/workflows/build-and-release.yml`): builds on push to master, creates GitHub release on version tags (`v*`), uploads artifact otherwise. Uses Node 12.

---

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

