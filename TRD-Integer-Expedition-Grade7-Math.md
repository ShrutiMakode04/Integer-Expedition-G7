# Technical Requirements Document (TRD)
## Integer Expedition — Integers & Rational Numbers | Grade 7 Math

| | |
|---|---|
| **Companion document** | `PRD-Integer-Expedition-Grade7-Math.md` |
| **Reference implementation** | `IntegerExpedition.jsx` (single-file React component, delivered alongside this TRD) |
| **Design/architecture reference** | `equal-tau.vercel.app` / `github.com/dsamyak/equal` |
| **Document status** | v1.0 Draft for review |

---

## 1. Overview & Goals

This TRD specifies how **Integer Expedition** is built: a client-only, single-page React application with no backend dependency for its core learning loop, procedurally-generated practice content, and a styling system deliberately aligned to Intellia SG's existing Grade 1 product. Everything described here has a working, tested reference implementation — this is a specification *of a thing that has already been built and validated*, not a proposal for future work, though it is written so another team could rebuild it independently from this document alone.

**Non-goals for v1** (see PRD Section 15): no backend, no auth, no persistence beyond a single browser session, no CMS-driven content — all lesson content is authored in code as data structures, matching the reference project's approach (the Grade 1 repo similarly ships lesson content as source, not as remote CMS calls).

## 2. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| UI library | React 18 (function components + hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`) | Matches the reference project's stack; hooks-only keeps the single-file component tractable |
| Build tool | Vite 5 + `@vitejs/plugin-react` | Matches the reference repo's `vite.config.js`; fast rebuilds during iteration |
| Icons | `lucide-react` (pinned `0.383.0`) | Only external UI dependency; consistent line-icon set |
| Styling | Hand-authored CSS-in-JS (a single template-literal stylesheet injected via one `<style>` tag) plus inline `style` objects for layout | Chosen over a utility-CSS framework so every color/animation is an exact, intentional value rather than a nearest-token approximation — see Section 9 |
| State management | Local component state only (`useState`/`useReducer`-equivalent patterns via plain `useState`), lifted to the root component only where a value must survive a phase change (XP, stars, badges, station-completion flags, visited-phase map) | No Redux/Context needed at this scale; avoids over-engineering a seven-phase, single-session app |
| Audio | Browser `SpeechSynthesis` API in the reference build; production target is Intellia SG's existing narration pipeline (Section 8) | No bundler dependency, no API key required to demo |
| Data fetching | None — the app is fully self-contained; no network calls at runtime | Keeps the learning loop available offline once loaded |

**Explicitly not used:** any localStorage/sessionStorage/IndexedDB (session-only in-memory state by design — see Section 12), any charting/animation library beyond what's hand-rolled (unnecessary at this scope), any drag-and-drop library (all interactions are tap/click-based per PRD Section 13).

## 3. Project Structure

Mirroring the reference repo's shape (`api/`, `public/`, `scripts/`, `src/`, plus root-level `*.txt` PRD/TRD files and a Vite config), the production repository for this lesson should be laid out as:

```
integer-expedition/
├── public/
│   └── (static assets — none required beyond the favicon; all art is inline SVG/CSS)
├── src/
│   ├── main.jsx                  # ReactDOM.createRoot(...).render(<App/>)
│   ├── App.jsx                   # Root component — phase state, badge/XP/star state, routing between phases
│   ├── lib/
│   │   ├── random.js             # randInt, randNonZeroInt, pick, shuffle
│   │   ├── fractions.js          # gcd, simplifyFrac, fracStr, roundTo, decStr
│   │   ├── questions.js          # generateQuestion(type) — the 9 generators (Section 5)
│   │   └── gamification.js       # calcXP, calcStars, BADGES
│   ├── components/
│   │   ├── ui/                   # Btn, Card, ProgressDots, TopBar, StatsBar, Mascot
│   │   ├── NumberLine.jsx         # shared horizontal/vertical axis (Section 7)
│   │   ├── QuestionCard.jsx       # renders any generated question — mcq / numeric / order (Section 6)
│   │   └── phases/
│   │       ├── IntroPhase.jsx
│   │       ├── WonderPhase.jsx
│   │       ├── StoryPhase.jsx
│   │       ├── LearnPhase.jsx
│   │       ├── SimulatePhase.jsx
│   │       │   └── stations/     # Station1NumberLine, Station2Elevation, Station3SignRule, Station4Match
│   │       ├── PracticePhase.jsx
│   │       └── ReflectPhase.jsx
│   └── styles/tokens.js          # exported color/animation constants (Section 9)
├── index.html
├── package.json
├── vite.config.js
├── PRD-Integer-Expedition-Grade7-Math.md
└── TRD-Integer-Expedition-Grade7-Math.md
```

**Note on the delivered reference implementation:** for ease of review and to guarantee it drops directly into a single-file artifact renderer, `IntegerExpedition.jsx` currently ships as **one consolidated file** containing every module listed above as an internal function/component (clearly section-commented in the same order as this table). Splitting it into the file tree above is a pure refactor with no behavior change, recommended before long-term maintenance by a full engineering team.

## 4. Component Architecture & State Model

### 4.1 Root state (owned by `App`)

| State | Type | Lifecycle |
|---|---|---|
| `phase` | one of `intro \| wonder \| story \| learn \| simulate \| practice \| reflect` | Drives which phase component renders |
| `visited` | `{ [phaseId]: true }` | Marks a phase as visited the first time it's entered; gates which phase-dots are clickable and gates the `full_expedition` badge |
| `audioOn` | boolean | Toggled from the top bar; read by the `useAudio` hook |
| `stationDone` | `boolean[4]` | One flag per Expedition Station; lifted to root so completion survives navigating away and back |
| `badges` | `string[]` | Unlocked badge ids; append-only, de-duplicated on unlock |
| `xp` | number | Cumulative; only increased by the Practice phase's `onFinish` callback |
| `stars` | number | Replaced (not summed) by the most recent Practice session's result |
| `results` | `{ correct, total, xpEarned, maxStreak, stars } \| null` | The most recently completed Practice session's summary, consumed by Reflect |

### 4.2 Phase transitions

All navigation goes through a single `goTo(phaseId)` function that both sets `phase` and marks it visited exactly once. The top bar's phase-dot row calls the same function, so **programmatic** ("Next" buttons) and **direct** (clicking a dot) navigation are one code path, not two.

### 4.3 Cross-cutting callbacks passed down

| Callback | Passed to | Effect |
|---|---|---|
| `onUnlockBadge(id)` | Simulate stations (directly), Practice (via `onFinish`), the root `useEffect` watching `phase` | Idempotent append to `badges` |
| `onStationComplete(index)` | Each of the four stations | Sets `stationDone[index] = true` (idempotent) and unlocks that station's badge |
| `onFinish(result)` | `PracticePhase` | Adds `xpEarned` to `xp`, computes `stars` from `calcStars`, conditionally unlocks `streak_star`, stores `results`, navigates to `reflect` |
| `speak(text)` | Every phase that narrates content | See Section 8 |

### 4.4 Why local state, not a global reducer

Each phase's moment-to-moment interaction state (which Learn card is showing, which Practice question index is active, a Station's current round) is **owned by that phase's own component**, not lifted to the root. This keeps the root's responsibility limited to "what phase are we in, and what has the student earned so far" — exactly the subset of state that must outlive a phase unmounting. It also means each phase naturally gets a fresh interaction state when the student navigates away and back (an intentional feature: replaying a Learn card or Station regenerates its example rather than restoring a stale one).

## 5. Question Data Model & Generation Engine

### 5.1 The question object contract

Every call to `generateQuestion(type)` returns an object with this shape (fields marked * are conditional on `kind`):

```ts
{
  id: string,                 // unique per call, used as a React key to force clean remounts
  type: string,                // one of the 9 type names
  category: 'integer' | 'rational',
  kind: 'mcq' | 'numeric' | 'order',
  prompt: string,               // instruction text (and narration text)
  display: string | null,       // the expression/value shown in large type, if any
  options?: (string|number)[],  // * mcq — always includes the correct answer, always de-duplicated
  correctAnswer?: string|number,// * mcq/numeric
  chips?: number[],             // * order — the shuffled values to tap in sequence
  correctOrder?: number[],      // * order — the true ascending sort of `chips`
  explanation: string,          // shown after answering, regardless of correct/incorrect
  hint: string,                 // available on request, before answering
}
```

### 5.2 The nine generators (see PRD Section 8 for the pedagogical spec of each)

Each generator is a **pure function of `Math.random()`** — no hidden shared state, no memoization across calls, so two consecutive calls with the same `type` are independent draws. Implementation notes worth preserving from the reference build:

- **`compare_integers` / `rational_compare`:** draw two distinct values, derive the correct symbol from a direct numeric comparison (never hand-authored), and always include all three symbols (`>`, `<`, `=`) as options even though `=` is never correct, to keep the option set fixed and predictable for the UI's grid layout.
- **`order_integers`:** draws 4 distinct integers via a `Set` (guaranteeing uniqueness), and derives `correctOrder` with a real `.sort((a,b)=>a-b)` on the same array shown to the student — the answer key is never independently authored, it is *computed from* the displayed values, which is what the automated test in Section 5.3 checks.
- **`absolute_value`:** distractors are seeded with the "forgot to drop the sign" mistake (`-correct`) and near-miss values (`correct ± 1`), then topped up with further perturbations only if fewer than three unique distractors were seeded — see `fillToFour` below.
- **`mul_div_integers`:** division questions are constructed **backwards** (pick divisor and quotient first, multiply to get the dividend) to guarantee a clean integer result — division questions are never generated by picking a dividend and hoping it divides evenly.
- **`word_problem`:** context (elevation/temperature/money) and character are chosen independently per call from the pools in PRD Section 11; the arithmetic is always `start + change = answer` under the hood, with surface wording branching per context.
- **`rational_equivalence`:** the fraction pool is restricted to denominators `{2,4,5,8,10}` specifically to avoid repeating decimals (e.g., thirds), so every generated decimal/percent is exact and unambiguous to compare or display.
- **`rational_add_sub`:** randomly selects between a decimal-arithmetic path and a like-denominator-fraction path (denominator fixed per question so no LCD-finding is required), keeping the mental-math load appropriate to a first pass at rational-number operations.

**Shared distractor-filling helper (`fillToFour`):** seeds a `Set` with a handful of pedagogically-meaningful wrong answers (common misconceptions, not noise), then — only if still short of three — tops up with small randomized perturbations until exactly three unique, non-correct distractors exist, and returns the shuffled four-option array. This guarantees every MCQ question always has a full, de-duplicated option set regardless of how the seed seeds happened to collide.

### 5.3 Validation method (already performed on the reference implementation)

Before the generation engine was wired into any UI, it was extracted into a standalone module and stress-tested in isolation:

- **36,000 generated questions** (4,000 per type × 9 types) were checked against automated invariants: every MCQ's `correctAnswer` present in `options`; every MCQ's `options` array free of duplicates; every `order` question's `correctOrder` equal to the true sort of its `chips`; every integer arithmetic question's `correctAnswer` independently re-derived by parsing its own `display` string and recomputing — not merely trusted.
- **Result: zero invariant failures** across all 36,000 cases.
- Supporting utility functions (`fracStr`/`simplifyFrac`) were separately checked for sign-normalization correctness (e.g., `fracStr(6, -8)` correctly returns `-3/4`, `fracStr(-5,-10)` correctly returns `1/2`, not a double-negative artifact).

This test suite should be preserved as a CI gate: **any change to a generator function must re-pass this invariant check before merge.**

## 6. Shared `QuestionCard` Component

Because five of the seven phases eventually need to render *some* generated question (Learn's per-card checks, all four question kinds inside Practice), a single component renders any question object, branching only on `kind`:

- **`mcq`:** renders `options` as a button grid; a click submits immediately.
- **`numeric`:** renders a numeric `<input>` plus a "Check" button; compared to `correctAnswer` with a `0.01` tolerance (only relevant for the decimal-arithmetic path; integer answers compare exactly in practice since the tolerance is far smaller than 1).
- **`order`:** renders `chips` as buttons that append to a "your sequence" tray as tapped; auto-submits once all chips are placed.

**Two-attempt policy (shared across all three kinds):** a first wrong answer triggers a brief "retry" state — the wrong pick is visibly highlighted, all inputs are briefly disabled, then cleared for a second try — rather than either silently failing or ending the question on one miss. A second wrong answer reveals the correct answer and explanation and ends the question. This is implemented as a small local state machine (`attempt: 1|2`, `status: active|retry|correct|incorrect`) inside `QuestionCard` itself, so every call site gets the same forgiving-but-bounded behavior for free.

**Remounting contract:** every call site renders `<QuestionCard key={question.id} question={question} .../>` — the `key` is load-bearing. Because the component's internal answer state is local, changing `question` without changing `key` would **not** reset the UI; the `id` field on every generated question exists specifically to make this remount reliable, and this was one of two real bugs the reference implementation's automated smoke test (Section 13) caught and fixed during development.

## 7. Shared `NumberLine` Component

One component serves every axis in the product (Learn's placement/jump demos, Station 1, Station 2's vertical scene):

- **Props:** `min`, `max`, `orientation` (`horizontal|vertical`), `tickStep`, `labelStep`, `markers` (array of `{ value, color, label, key }`), `onPick` (optional — click handler receiving the nearest value), `height`.
- **Click-to-value mapping:** on click, the component reads its own `getBoundingClientRect()` and converts the click coordinate to a ratio along the track, then to a value in `[min, max]`, rounded to the nearest whole unit.
- **Animation:** every marker's position is rendered with a CSS `transition` on `left`/`top`. This means *any* state change to a marker's `value` (e.g., Learn's jump demo moving a marker from the start value to the landed value, or a Station revealing the true answer position) animates automatically — no manual keyframe choreography is needed per use site, which is why the same component convincingly plays three visually different roles (a plain axis, a "jump," and a mountain/ocean elevation scene) without three separate animation implementations.
- **Zero-line emphasis:** if `0` falls within `[min, max]`, a distinct tick is always rendered there regardless of `tickStep`, since 0 is conceptually load-bearing on every integer/rational number line in this lesson.

## 8. Audio & Narration Pipeline

**Production target:** Intellia SG's existing narration pipeline, matching the provider, voice, and pacing already established for the Grade 1 product, so a student moving from one Intellia SG lesson to another hears a consistent "voice" for the brand. (The specific provider/voice configuration should be pulled from the live Grade 1 build's own audio pipeline rather than re-specified here, to guarantee consistency — see PRD Section 0 on what could and couldn't be directly re-verified during this document's preparation.)

**Reference implementation's stand-in:** a `useAudio(enabled)` hook wraps the browser's native `SpeechSynthesis` API:

```js
function useAudio(enabled) {
  return useCallback((text) => {
    if (!enabled || !text) return;
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.98; u.pitch = 1.03;
      window.speechSynthesis.speak(u);
    } catch (e) { /* silent no-op — never blocks the UI on an audio failure */ }
  }, [enabled]);
}
```

This exists so the product is fully demonstrable with **zero external API keys or network calls**, and so the fail-safe behavior (audio quietly does nothing if unsupported or if narration is muted) is proven out before the production provider is wired in behind the same `speak(text)` call signature — swapping the pipeline is a one-function change; no call site elsewhere in the app needs to know which provider is behind it.

**Parity rule:** narration text is always identical to the on-screen text it reads — there is exactly one copy of any instructional string, never a separate "spoken version," to avoid the two drifting apart over future edits.

## 9. Design Tokens & Styling System

All values below are the actual tokens used in the reference implementation, chosen to extend (not clash with) the Grade 1 product's established palette while adding a second accent for the rational-numbers content:

```js
const C = {
  primary:      '#2F6FA3', primaryDark: '#1F4E78', primarySoft: '#E7F1FA',
  gold:         '#EFA23A', goldDark:    '#B87415',
  success:      '#2FAE85', successSoft: '#E3F8F0', successDark: '#1F8C6B',
  danger:       '#E7645A', dangerSoft:  '#FCEAE8', dangerDark:  '#C24941',
  purple:       '#8266C4', purpleSoft:  '#EFEAFB',   // new — reserved for "Rational Numbers" content
  ink: '#1E2A38', slate: '#5D6B78', slateLight: '#93A1AD',
  paper: '#FFFFFF', bg: '#F2F6FB', line: '#DEE7EF',
};
```

- **Typography:** `Baloo 2` (headings/display) paired with `Nunito` (body) — both rounded, friendly, legible typefaces consistent with the reference product's stated style direction, loaded via a single `@import` at the top of the injected stylesheet.
- **Animation vocabulary** (all hand-rolled `@keyframes`, applied via small utility classes so any component can opt in): `ieBounceIn`, `ieShake` (wrong-answer feedback), `ieSlideUp` (content transitions), `iePop` (marker/badge appearance), `ieCelebrate` (Reflect-screen mascot).
- **Component classes** (`ie-btn`, `ie-card`, `ie-option-btn`, `ie-chip`, …) are defined once in a single injected stylesheet string rather than per-component inline styles, so a future design pass can retheme the whole product by editing one block.
- **Deliberate implementation choice:** the reference build uses **zero utility-CSS-framework classes** (no Tailwind or similar) — every visual value is either a design token above or a one-off inline style — so the component is guaranteed to render identically regardless of whether any external CSS framework is present in whatever environment ultimately hosts it.

## 10. Responsive & Accessibility Implementation

- Layout is single-column and fluid at all widths; the top and bottom bars use `position: sticky` rather than `fixed`, so they behave predictably inside a scrolling container of unknown height (relevant when embedded in an iframe/webview, as the Grade 1 reference product likely is).
- `:focus-visible` receives an explicit, high-contrast outline (gold, 3px) across every interactive element — buttons, options, chips, inputs, phase dots.
- A single global media query collapses all animation/transition durations to near-zero under `prefers-reduced-motion: reduce`.
- Icon-only controls (audio toggle, back arrow) carry explicit `aria-label`s; the phase-dot row exposes `aria-current="step"` on the active phase.
- No functionality anywhere in the product depends on hover, drag, or multi-touch gestures.

## 11. Gamification Engine

Pure functions, independent of any UI:

```js
function calcXP(streak, hintUsed) {
  return (hintUsed ? 7 : 10) + (streak >= 5 ? 5 : 0);
}
function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}
```

Badge unlocking is **idempotent by construction** (`unlockBadge` appends to the `badges` array only if the id isn't already present), which matters because several call sites (e.g., Station 1's success counter) may legitimately fire their "complete" callback more than once as a student keeps playing past the unlock threshold — the badge state can never be corrupted or duplicated by a repeated call.

## 12. Performance & Data Requirements

- **No persistence layer in v1:** all state is in-memory `useState`; a page refresh resets the session by design (matches PRD Section 15's explicit scope decision). If a production deployment environment supports simple key-value persistence (e.g., to survive an accidental refresh), it should store only the same summary shape already used by `results` — never raw question content, which must always be freshly generated.
- **No large assets:** every visual (mascot, number lines, mountain/ocean scene) is inline SVG or CSS, not image files — keeps the bundle small and avoids any asset-loading race before first interaction.
- **Bundle size (reference build):** the production Vite build of the reference implementation is ≈ 320 KB unminified JS (≈ 78 KB gzipped) including React, ReactDOM, and lucide-react — small enough to load quickly on classroom wifi or mobile data.

## 13. Testing Strategy

Three layers were used to validate the reference implementation, and are recommended as the standing test suite for future changes:

1. **Pure-logic stress testing** (Section 5.3): the question generators and fraction/gcd utilities, tested in complete isolation from React, at high iteration counts, checking output invariants rather than fixed expected values (since outputs are intentionally random).
2. **Incremental build verification:** the component was authored and compiled in stages (design tokens → shared primitives → each phase → each station → final wiring), running a full `vite build` after each stage. This caught two real defects early: an unescaped apostrophe inside a single-quoted narrative string, and a "Back" button wired to a no-op handler instead of the real navigation callback — both fixed before they reached a full end-to-end pass.
3. **Headless DOM smoke test:** the actual production bundle was mounted in a `jsdom` environment and driven end-to-end via simulated clicks — through Basecamp, The Signal, all five Field Notes panels, all seven Explorer's Guide cards (including their embedded interactive checks and the two-attempt retry path), all four Expedition Stations (opened, interacted with, and exited), a full 12-question Basecamp Challenge session (including multiple wrong-then-retry sequences), the Summit screen, and a full replay. This pass completed with **zero unhandled runtime errors** and **zero instances of `undefined`, `NaN`, `[object Object]`, or a stray `null` ever appearing in rendered text** across the entire walk.

**Recommendation:** wire layers 1 and 2 into CI (fast, deterministic); run layer 3 as a pre-release smoke check given its reliance on timing around the two-attempt retry window.

## 14. Browser & Device Support

- Current versions of Chrome, Safari (including iOS), Firefox, and Edge — no browser-specific code paths beyond feature-detecting `window.speechSynthesis` (Section 8), which is present in all four.
- Designed and tested down to common mobile viewport widths (~360px) as the primary target, scaling up to desktop.
- No dependency on WebGL, camera/microphone access, or any permission prompt.

## 15. Deployment & Environment

- Static build output (`vite build`) — deployable to any static host (matching the reference project's Vercel deployment pattern); no server-side runtime required for the core learning loop.
- Recommended path: `intelliasg.com/courses/grade-7-math/lessons/integers-and-rational-numbers/`, consistent with the URL pattern implied by the Grade 1 product's own course structure.
- Environment configuration limited to the production narration provider's credentials (Section 8) — no other secrets required.

## 16. Security & Privacy

- No accounts, no PII collection, no cookies required for the core experience (matches PRD Section 15's scope).
- The Summit phase's free-text reflection box is session-local only in the reference build; if a future version transmits it anywhere (e.g., to a teacher dashboard), that requires an explicit, separate privacy review and, given the target age band (12–13-year-olds), appropriate child-directed-service handling (e.g., COPPA-aligned data-minimization practices in relevant jurisdictions) before any such transmission is added.
- No third-party analytics/trackers are included in the reference build (see Section 17 for the recommended, minimal, non-identifying event schema if telemetry is added later).

## 17. Analytics & Telemetry (recommended, not implemented in the reference build)

If Intellia SG's existing analytics pipeline is to be connected, the following event set covers the product without collecting anything beyond aggregate learning signal:

| Event | Payload |
|---|---|
| `phase_entered` | `{ phase }` |
| `station_completed` | `{ stationIndex }` |
| `badge_unlocked` | `{ badgeId }` |
| `challenge_completed` | `{ correct, total, xpEarned, maxStreak, stars }` |
| `question_answered` | `{ questionType, category, correct, attempt, hintUsed }` |

No question *content*, free-text reflection text, or any student identifier should be included in any event payload.

## 18. Appendix — File Manifest (reference implementation as delivered)

| File | Purpose |
|---|---|
| `IntegerExpedition.jsx` | The complete, single-file React component described throughout this TRD — design tokens, all utilities, all shared components, all seven phases, all four stations, root state management |
| `PRD-Integer-Expedition-Grade7-Math.md` | Companion product specification |
| `TRD-Integer-Expedition-Grade7-Math.md` | This document |

**Traceability note:** every claim in Sections 5.3 and 13 about testing that "was performed" refers to validation actually carried out against this exact reference implementation before delivery, not a hypothetical future test plan.
