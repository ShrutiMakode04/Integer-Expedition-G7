# Product Requirements Document (PRD)
## Integer Expedition — Integers & Rational Numbers | Grade 7 Math

| | |
|---|---|
| **Product** | Intellia SG — Grade 7 Math, Strand: *Numbers and Number Sense* |
| **Lesson unit** | Integers and Rational Numbers |
| **Target URL pattern** | `intelliasg.com/courses/grade-7-math/lessons/integers-and-rational-numbers/` |
| **Design & interaction reference** | `equal-tau.vercel.app` ("Equal Groups," Grade 1 Math, Intellia SG) and its repo `github.com/dsamyak/equal` |
| **Document status** | v1.0 Draft for review |
| **Owner** | Product / Curriculum team |
| **Prepared for** | Intellia SG |

---

## 0. How this document was built — sourcing & traceability

This PRD (and its companion TRD) were produced by directly inspecting Intellia SG's own live product and repository, then cross-checking the mathematical content against five independent global curricula. Being upfront about what was and wasn't directly accessible:

- **Directly verified:** `equal-tau.vercel.app` is live and returns the meta title *"Equal Groups — Introduction to Multiplication & Division | Grade 1 Math | Intellia SG."* Its repository, `github.com/dsamyak/equal`, is public and contains `equal_groups_multiplication_division_prd.txt` and `equal_groups_multiplication_division_trd.txt` — a real PRD/TRD pair for that lesson. This document deliberately mirrors that pair's section structure, phase model, and design-token language so the Grade 7 product reads as the same family as the Grade 1 one.
- **Not directly accessible:** `intelliasg.com/courses/grade-7-math` did not resolve through search or direct fetch during preparation (the domain isn't currently indexed, and the exact course URL wasn't independently reachable). Rather than inventing specifics about a page that couldn't be verified, this PRD instead (a) follows the *proven, live* Intellia SG lesson architecture from the Grade 1 product above, and (b) grounds the Grade 7 content itself in the standards bodies in Section 3. **Action item:** once the actual Grade 7 course page or its content export is shared, Section 3 and Section 6 should be reconciled against it directly.
- **Curriculum cross-references used:** US Common Core State Standards (7.NS domain), Virginia Standards of Learning (Grade 7, strand *Number and Number Sense* — the strand name the requester used, verified as a real, current strand title), Cambridge Lower Secondary (Stage 8), CBSE/NCERT (Class 7, India), and the Australian Curriculum v9.0 (Year 7). See Section 3 for the full alignment table.
- **Companion deliverable:** an interactive, gamified prototype implementing the phases and four simulation stations described in Section 7 has been built as a working React artifact (`IntegerExpedition.jsx`) and validated with automated tests (36,000-case logic stress test + full click-through smoke test). It is the reference implementation this PRD describes.

---

## 1. Executive Summary

**Integer Expedition** is a self-contained, gamified, simulation-based digital lesson teaching **Integers and Rational Numbers** to Grade 7 students (ages 12–13), as the flagship unit of Intellia SG's *Numbers and Number Sense* strand. It follows Intellia SG's established Grade 1 product pattern — story → guided learning → hands-on simulation → randomized practice → reflection — re-themed for a pre-teen audience around a globally-flavoured "expedition" narrative (mountaineering, scuba diving, basecamp logistics) instead of the early-years "hawker centre" theme used in Grade 1.

The product must feel like **one continuous, well-produced experience**, not a worksheet with graphics bolted on: every concept is taught through an interactive model before a single question is asked, every practice question is procedurally randomized (not drawn from a fixed bank), and every number line, sign-rule, and equivalence idea is something the student *manipulates*, not just reads about.

## 2. Product Vision & Goals

**Vision:** *A 12-year-old anywhere in the world should be able to open one link, and — with no teacher in the room — go from "I don't really get negative numbers" to confidently comparing, combining, and reasoning about integers and rational numbers, while feeling like they're on an adventure rather than doing a worksheet.*

**Goals:**

| Goal | Measure of success |
|---|---|
| Teach the full Grade-7 Integers & Rational Numbers scope with genuine conceptual understanding, not just procedure memorization | ≥80% first-attempt accuracy on the post-lesson Challenge across a representative student sample |
| Make every practice attempt genuinely novel | 0% of questions are pulled from a static bank — every question is generated at answer-time from randomized parameters (see Section 8) |
| Make abstract sign rules and number-line reasoning concrete | Every rule taught in the Explorer's Guide has a paired, directly-manipulable model in the same phase (not just an illustration) |
| Match Intellia SG's existing product identity | Visual/interaction QA sign-off against the Grade 1 "Equal Groups" design system (Section 10) |
| Work for a global student population | Neutral, real-world contexts (elevation, ocean depth, temperature, currency) with a cast of characters carrying names from multiple regions (Section 11) |
| Be usable without adult help | A student can complete the entire flow using only in-app instructions, hints, and narration |

## 3. Target Users & Personas

**Primary user:** A Grade 7 student (typically age 12–13), any country, working independently on a phone, tablet, or laptop, in or out of a classroom setting. English-medium instruction assumed for v1; the content and UI copy are written in plain, direct language to keep translation/localization feasible later.

**Persona — "Amara, 12, home study":** Comfortable with whole-number arithmetic and simple fractions from Grade 6, has seen negative numbers only in passing (e.g., temperature). Needs the *why* before the *how* — abstract rules like "a negative times a negative is positive" need a concrete model, not just a rule to memorize.

**Persona — "Diego, 13, classroom rotation":** Finishes work quickly and gets bored with repeated drills; needs the practice pool to feel inexhaustible and the simulations to feel like genuine mini-games, not disguised worksheets.

**Secondary user:** A teacher or parent glancing at the Reflect screen's summary (score, badges, a short student-written reflection) to gauge whether the concept landed — no login or dashboard is in scope for v1 (see Section 14).

## 4. Curriculum Alignment — "Numbers and Number Sense": Integers & Rational Numbers

The strand name *Numbers and Number Sense* is itself a real, current strand title (used verbatim in, e.g., the Virginia Mathematics Standards of Learning); this document treats it as the organizing strand and maps the specific unit — Integers and Rational Numbers — against five global frameworks so the lesson is defensible regardless of which national curriculum a given student follows.

| Framework | Grade/Stage equivalent | Relevant standard(s) | Core requirement |
|---|---|---|---|
| **US Common Core** | Grade 7 | 7.NS.A.1, 7.NS.A.2, 7.NS.A.3 | Apply and extend understanding of operations with fractions to add, subtract, multiply, and divide rational numbers; represent addition/subtraction on a number line; understand products/quotients of rational numbers; solve real-world problems with all four operations |
| **Virginia SOL** (representative US state framework using this exact strand name) | Grade 7 | Strand *Number and Number Sense*, standards 7.1 and 7.3 | 7.1: negative exponents, scientific notation, ordering/comparing using absolute value with rational numbers; 7.3: add, subtract, multiply, and divide integers |
| **Cambridge Lower Secondary** | Stage 8 (≈ Grade 7) | 8Ni.02, 8Ni.04, 8Nf.06 | Add/subtract/multiply/divide positive and negative integers; understand the hierarchy of natural numbers, integers, and rational numbers; order positive and negative fractions, decimals, and percentages |
| **CBSE / NCERT (India)** | Class 7 | Ch. "Integers," Ch. "Rational Numbers" | Properties of integer operations; the concept of a rational number as p/q; representing and comparing rational numbers on a number line |
| **Australian Curriculum v9.0** | Year 7 | AC9M7N04, AC9M7N07 | Compare, order, and represent integers; add and subtract positive and negative integers; recognise equivalences between fraction, decimal, and percentage forms |

**Scope decision:** Every skill above appears in the lesson. Multiplying/dividing rational (non-integer) numbers formally is flagged by several frameworks (e.g., Cambridge, Australian Curriculum) as extending slightly beyond a single Grade-7 unit boundary in places — this lesson still **introduces** the idea via the "same rules apply" card in the Explorer's Guide (Section 6.4) and light practice, without requiring mastery of complex multi-step rational arithmetic, keeping the unit honest about what a single lesson can achieve.

## 5. The Learner Journey — Seven Phases

Matching the phase-based architecture of Intellia SG's live Grade 1 product, re-themed as an **expedition** for a Grade 7 audience:

| # | Phase (in-app label) | Purpose | Grade 1 analogue |
|---|---|---|---|
| 1 | **Basecamp** (Intro) | Orient the student, preview the journey and its four stages | Welcome/mascot intro |
| 2 | **The Signal** (Wonder) | A one-screen curiosity hook with no teaching yet — poses a question the lesson will let them answer | "Wonder" hook |
| 3 | **Field Notes** (Story) | A five-panel narrative introducing John, Mike, and Sarah and the real-world contexts (mountain, reef, basecamp) that anchor every later example | Story phase |
| 4 | **Explorer's Guide** (Learn) | Direct, explicit instruction — one idea per card, each with a manipulable model and an immediate low-stakes check | *(new — see Section 5.1)* |
| 5 | **Expedition Stations** (Simulate) | Four distinct hands-on simulations, explored in any order, each awarding a badge | Simulation phase |
| 6 | **Basecamp Challenge** (Practice) | A fully randomized, scored quiz across all sub-skills | Play/Practice phase |
| 7 | **Summit** (Reflect) | Score, XP, stars, badges, and a short self-reflection prompt; a one-tap replay with an entirely new random set | Reflect phase |

### 5.1 Why an explicit Learn phase is a deliberate departure from the Grade 1 pattern

The request driving this product explicitly calls for "the approach of learning first, then practice questions." The Grade 1 product folds concept-teaching into its Story phase, which suits very young learners encountering a single concrete idea (equal groups). Grade 7 content is more rule-based and cumulative (comparison → absolute value → operations → the rational-number hierarchy → operations again on the bigger set), so this PRD specifies a **dedicated Explorer's Guide phase**, sitting between Story and Simulate, that:

- Breaks the unit into seven short, sequential cards (Section 6.4), each independently completable and revisitable via Back/Next.
- Pairs every rule with something the student directly manipulates (a number line they tap, a jump they trigger, a sign they predict) rather than a static diagram — this is what makes the phase "simulation-based learning" rather than a slide deck.
- Ends each card (except the two purely conceptual opening cards) with one low-stakes, instantly-regenerated check question, so the student never leaves a card without a moment of retrieval practice — the bridge between "learning" and "practice questions" the brief calls for.

## 6. Phase-by-Phase Requirements

### 6.1 Basecamp (Intro)
- States the lesson title, strand, and unit plainly (no ambiguity about what is being taught).
- Previews the four stages the student will move through, each with an icon, so expectations are set before any content loads.
- Single primary call-to-action; no secondary paths (the student cannot get lost on this screen).

### 6.2 The Signal (Wonder)
- One scenario, one question, no answer given yet: *"Mike is 36 m below the surface. John is on a ridge 412 m above base camp. Who is farther from sea level — and how would you prove it with numbers?"*
- Must be answerable only after the Explorer's Guide — the phase exists purely to create a reason to care about absolute value and comparison, not to test anything yet.
- Narration (Section 9) reads the scenario aloud automatically when audio is enabled.

### 6.3 Field Notes (Story)
Five short panels, paginated with Back/Next, each independently narratable:

1. **The Explorers Club** — introduces John, Mike, and Sarah, and the trip that requires them to "speak the language of integers and rational numbers" before their coach signs off.
2. **John's Ascent** — establishes the elevation model: base camp = 0, climbing = positive, retreating = negative.
3. **Mike's Descent** — establishes the depth model and pre-seeds absolute value intuitively ("−18 m is deeper than −5 m, even though 18 is the bigger number").
4. **Sarah's Basecamp Log** — introduces rational numbers through water supply fractions and a shared expense fund (dollars/decimals/percent), establishing that fractions, decimals, and percents are different faces of the same idea.
5. **One Shared Number Line** — the unifying beat: altitude, depth, temperature, and money all sit on one number line, different units, same structure. This line directly sets up the Explorer's Guide.

Requirement: every character-driven example introduced here must be reusable as a real practice-question context later (Section 8) — the story is not decorative, it is the source of the word-problem contexts.

### 6.4 Explorer's Guide (Learn) — seven cards

| Card | Concept | Manipulable model | Paired check |
|---|---|---|---|
| 1 | Integers: whole numbers, both directions | Tap the number line to place a given integer; instant "how far off" feedback | *(placement itself is the check)* |
| 2 | Comparing integers | — | Randomized `>` / `<` / `=` question |
| 3 | Absolute value & opposites | — | Randomized "what is \|n\|?" question |
| 4 | Adding & subtracting on the number line | Predict a landing point, then trigger an animated "jump" that slides a marker from the start value by the given change | *(the jump itself doubles as the check)* |
| 5 | Multiplying & dividing — sign rules | — | Randomized integer × or ÷ question |
| 6 | Rational numbers: the bigger family | A nested-set diagram (Natural ⊂ Whole ⊂ Integers ⊂ Rational) | Randomized fraction ⇄ decimal ⇄ percent question |
| 7 | Same rules, bigger number family | — | Randomized rational-number comparison |

Requirement: a student may move Back and Next freely; every "paired check" question **regenerates with new random values each time the card is revisited**, so re-reading a card never shows a memorized answer.

### 6.5 Expedition Stations (Simulate)

Four independent, replayable simulations, entered from a single station-picker screen; a student may attempt them in any order and may proceed to the Challenge without finishing all four (badges reward completion but never gate progress — see Section 14 for the reasoning). Full functional specification in **Section 7**.

### 6.6 Basecamp Challenge (Practice)

- A 12-question session assembled at the moment the student starts it: one of each of the 9 question types (Section 8) guaranteed once, plus 3 additional randomly-chosen types, in random order.
- Every question — including a replayed session — is freshly generated from random parameters; nothing is drawn from a fixed bank.
- Two attempts per question before the correct answer and explanation are revealed (never a single-shot "gotcha"); a wrong first attempt never blocks progress, only resets the in-session streak.
- Optional, non-penalizing hint available before answering.
- Live streak and XP counters; category (Integers vs. Rational Numbers) shown per question so the student always knows what skill is being tested.

### 6.7 Summit (Reflect)

- Score, XP earned this session, best streak, and a 0–3 star rating.
- Every badge earned so far (across Explorer's Guide, Stations, and Challenge) displayed with its plain-language earning condition.
- A short free-text reflection prompt ("One thing you learned") — captured for the student's own benefit in-session; no submission/storage is implied (see Section 14).
- One clear action: replay the Challenge with an entirely new random set. The top navigation remains available to revisit any earlier phase.

## 7. Simulation Design — the four Expedition Stations

This is the heart of the "unique, interactive, comprehensive simulation" requirement. Each station teaches through direct manipulation, not observation, and none of the four duplicate each other's interaction pattern.

### 7.1 Station 1 — Number Line Navigator
**Teaches:** integer magnitude and position, using a plain interactive number line as the "instrument."
**Interaction:** the student is given a target integer and taps anywhere along a horizontal line to place it; the app reveals both the student's tap and the true position, with distance-based feedback. Placements within 1 unit count as a success.
**Progression:** the line's range widens (−10..10 → −16..16 → −22..22) as the student succeeds, so the station gets harder rather than staying static.
**Badge:** *Line Navigator* — three accurate placements.

### 7.2 Station 2 — Expedition Elevation Log
**Teaches:** integer addition/subtraction in a real-world vertical context (mountain above sea level, ocean below it), directly continuing John's and Mike's story threads.
**Interaction:** a vertical number line rendered against a mountain/ocean backdrop; the student reads a scenario ("John is at 80 m. He climbs 120 m. What is his new elevation?" — or the reverse: given start and end, find the change) and logs a numeric answer. On checking, a position marker animates smoothly from the start value to the true final value, so the *correct* motion is always shown, whether or not the student's answer was right.
**Badge:** *Expedition Logger* — three correct logs.

### 7.3 Station 3 — Sign Rule Lab
**Teaches:** the multiplication/division sign rules, as a predict-then-verify loop rather than a rule to memorize.
**Interaction:** the student sees a signed multiplication or division expression and must predict *Positive* or *Negative* **before** the actual product/quotient is revealed — inverting the usual "compute, then check" pattern so the sign rule itself is the object of attention.
**Progression:** a live streak counter of consecutive correct sign predictions.
**Badge:** *Sign Whisperer* — five correct predictions in a row (a wrong guess resets the streak, never the score).

### 7.4 Station 4 — Equivalence Match
**Teaches:** that fractions, decimals, and percents are different representations of the same rational number.
**Interaction:** an eight-card concentration-style match — four values, each shown once as a fraction and once as a decimal or percent, shuffled; the student taps two cards to test whether they name the same value.
**Badge:** *Equivalence Ace* — a full, mismatch-free match.

### 7.5 Cross-station requirements
- Every station's underlying values are procedurally randomized on every round and on every "New number / New scenario / New round / New set" action — no station ever repeats the same instance twice in a row.
- Every station is playable with taps/clicks alone (no drag-and-drop requirement), so the interaction works identically on touch and mouse input.
- A station can be replayed indefinitely after its badge is earned; badges are a one-time unlock, not a gate.

## 8. Question Bank & Randomization Requirements (Basecamp Challenge)

Nine distinct question types, each a **generator function** — not a static bank entry — producing new random values on every call:

| Type | Skill | Answer format |
|---|---|---|
| Compare integers | `>` / `<` / `=` | Multiple choice (3 options) |
| Order integers | Sequencing 4 values least→greatest | Tap-in-order |
| Absolute value | \|n\| | Multiple choice (4 options) |
| Add/subtract integers | Signed arithmetic | Typed numeric |
| Multiply/divide integers | Sign-rule arithmetic | Typed numeric |
| Word problem | Elevation / temperature / money context, using the story's characters | Typed numeric |
| Rational equivalence | Fraction ⇄ decimal ⇄ percent | Multiple choice (4 options) |
| Rational comparison | Comparing mixed-format rational numbers | Multiple choice (3 options) |
| Rational add/subtract | Signed decimal or like-denominator fraction arithmetic | Multiple choice (4 options) |

**Non-negotiable requirements:**
1. Every generated question must be independently re-solvable from the values it displays — no hidden/unstated state.
2. Multiple-choice distractors must be *plausible* (common misconceptions: sign errors, off-by-one, digit-shift errors on percent conversion) rather than random noise, so a wrong answer is diagnostic, not arbitrary.
3. No two consecutive practice sessions may be identical, and no single session may be predicted from a previous one.
4. This requirement was validated, not just specified: the reference implementation's generator was stress-tested across 36,000 generated questions (4,000 per type) with zero invariant failures — every multiple-choice correct answer present among its options, every "order" answer key matching the true sort of its values, every arithmetic result independently re-derived from its displayed expression. See the TRD, Section 5, for the full method.

## 9. Gamification Design

| Mechanic | Rule |
|---|---|
| **XP** | 10 XP per correct Challenge answer, +5 bonus once the in-session streak reaches 5; 7 XP (in place of 10) if a hint was used on that question |
| **Streak** | Increments per consecutive correct Challenge answer; resets to 0 on a miss (never reduces XP already earned) |
| **Stars** | Awarded per Challenge session by accuracy: ≥90% → 3, ≥70% → 2, ≥50% → 1, below → 0 |
| **Badges** | Six total: *Line Navigator, Expedition Logger, Sign Whisperer, Equivalence Ace* (one per Station), *Streak Star* (streak ≥ 6 in the Challenge), *Full Expedition* (every phase visited in one sitting) |

Design principle carried over from the Grade 1 product: **gamification rewards effort and mastery, never gates access.** A student can reach the Challenge without touching a single Station; badges are entirely optional flourishes layered on top of the core learning path.

## 10. UX & Visual Design Requirements

The UI **must read as the same product family** as `equal-tau.vercel.app`, adapted for a Grade 7 (not Grade 1) audience:

- **Retained from the reference brand system:** a soft-blue primary palette with a gold "reward" accent and a coral "needs another look" accent; white, rounded, drop-shadowed cards; a rounded display typeface for headings paired with a rounded body sans-serif; a consistent library of motion (bounce-in, shake-on-miss, slide-up, pop, celebrate) rather than ad-hoc per-screen animation.
- **Adapted for the older audience:** a second accent (purple) is introduced to visually separate "Rational Numbers" content from "Integers" content throughout; illustration and copy tone shift from the Grade 1 product's very young, concrete imagery toward an "expedition/field-notes" motif appropriate to 12–13-year-olds, while keeping the same warmth and encouragement-first feedback language.
- **Persistent chrome:** a top bar (brand mark, lesson title, phase-progress indicator, narration toggle) and a bottom stats bar (XP, stars, badge count) frame every phase, matching the reference product's always-visible progress affordance.
- **Phase-progress dots** are clickable for any already-visited phase (free review navigation) and inert for phases not yet reached (no skipping ahead of the intended sequence).
- **No single fixed layout for the four Stations** — each has a distinct visual treatment (a plain axis, a mountain/ocean scene, a two-button predictor, a card grid) so "Stations" reads as four different places, not one template with different numbers.
- Full design-token values (hex colors, font stack, keyframe definitions) are specified in the TRD, Section 9, so implementation doesn't drift from this intent.

## 11. Content Requirements

- **Principal characters:** John, Mike, and Sarah (as specified by the brief), each carrying one of the lesson's three anchor real-world contexts — elevation, ocean depth, and basecamp logistics/temperature/budget respectively.
- **Supporting cast (word-problem contexts in Practice):** Priya, Kenji, Amara, Sofia, Liam, Noor, and Diego — chosen to read as plausible names from a broad span of regions (South Asia, East Asia, West Africa, Latin America/Iberia, Western Europe, Middle East/North Africa) so the "global countries" audience sees names beyond the three protagonists.
- **Contexts used throughout (deliberately the same handful, reused consistently):** elevation/altitude, ocean depth, temperature, and money — chosen because they are the standard, curriculum-recognized contexts for teaching signed numbers across every framework reviewed in Section 3, not invented for novelty.
- **Tone:** encouraging on a miss, factual on a hit — no punitive language, no timers that penalize thinking time.
- **Reading level:** short sentences, one idea per sentence in instructional copy, contractions used naturally (this is a spoken-narration product as much as a read one — see Section 12).

## 12. Audio & Narration

- Every Wonder/Story/Learn passage, and every Challenge question's prompt, is paired with narration text (in production, spoken via the same provider Intellia SG's existing product pipeline uses; the working prototype substitutes the browser's built-in speech synthesis so the experience is demonstrable without a paid API key — see TRD Section 8 for the exact production/prototype split).
- A single, persistent mute/unmute control in the top bar; the app must be equally usable with audio off (all narrated text is also always shown on screen — audio is a supplement, never the only channel).
- Narration text is the same text shown on screen (no divergent scripts to maintain).

## 13. Accessibility & Responsive Requirements

- Usable at common phone widths (~360–430px) up to desktop; the persistent top/bottom bars and single-column phase content are designed mobile-first.
- Visible keyboard focus states on every interactive element.
- `prefers-reduced-motion` is honored — all decorative animation collapses to near-instant for students who need it.
- No interaction in the product depends on drag-and-drop; every station uses tap/click-based alternatives (tap-to-place, tap-to-select-a-pair, tap a button to predict), so touch, mouse, and switch-access users have the same path through the content.
- Color is never the only signal of correct/incorrect (icon + color + text are always paired).

## 14. Success Criteria

| Criterion | Target |
|---|---|
| Curriculum coverage | 100% of the standards listed in Section 3 addressed by at least one Learn card, one Station, or one Challenge question type |
| Question freshness | 0 repeated question instances across consecutive sessions (procedural generation, not a fixed bank) |
| Completion without adult help | A student can reach the Summit screen using only in-app instructions/hints |
| Visual/brand consistency | Passes side-by-side QA review against the Grade 1 reference product's design language |
| Reliability | Zero unhandled runtime errors across a full click-through of every phase and station (validated pre-ship — see TRD Section 5) |

## 15. Out of Scope (v1)

- Student accounts, login, or any persistence of scores/badges across browser sessions or devices.
- Teacher/parent dashboards, class rosters, or reporting exports.
- Adaptive difficulty beyond Station 1's widening range (no full item-response-theory engine in v1).
- Multi-language localization (English only; copy is written plainly to keep this feasible later).
- Assessment/grading integration with any school Learning Management System.
- Any collection or storage of the Summit reflection text beyond the current session.

## 16. Open Questions & Risks

1. **Content parity with the live `intelliasg.com/courses/grade-7-math` page** could not be confirmed directly (Section 0) — recommend a short reconciliation pass once that page/export is available.
2. **Rational-number multiplication/division depth** varies by framework (Section 3); current scope treats it as an introduction, not mastery — confirm this matches Intellia SG's own grade-7 sequencing intent before wider rollout.
3. **Audio provider** — production narration is specified to match Intellia SG's existing pipeline (TRD Section 8); confirm API/licensing access before build.

## 17. Appendix — Reference Materials

- Design & architecture reference: `https://equal-tau.vercel.app/` and `https://github.com/dsamyak/equal`
- Requested content-matching source (not directly accessible during preparation): `https://intelliasg.com/courses/grade-7-math`
- Curriculum sources: US Common Core (7.NS domain), Virginia Department of Education Mathematics SOL (Grade 7, strand *Number and Number Sense*), Cambridge Lower Secondary curriculum framework (Stage 8), CBSE/NCERT Class 7 Mathematics, Australian Curriculum v9.0 Mathematics (Year 7)
- Companion technical specification: see `TRD-Integer-Expedition-Grade7-Math.md`
- Working reference implementation: `IntegerExpedition.jsx`
