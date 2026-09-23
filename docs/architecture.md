# Tycon MVP architecture

## Product and boundaries

Tycon is a mobile-first, local-first practice journal for **Indonesian (`id`), English (`en`), and Simplified Mandarin (`zh-Hans`)**. A learner chooses a language they know (source) and one to practice (target), completes short lessons, receives specific feedback, and collects progress stamps and XP. The visual metaphor is a personal travel/field notebook: route cards, numbered checkpoints, ink-like stamps, and a calm progress trail. Use original copy, artwork and interaction patterns; do not reproduce another learning app's mascot, branding, screens, or sounds. No login, server, social competition, paywall, audio recording, or AI grading in MVP.

Scaffold: Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4; `src/app/page.tsx` is still the starter screen. Shared contracts live in `src/lib/types.ts`, imported as `@/lib/types`. Static content can be bundled in TypeScript and accessed from client/server; persisted learner data must only be read in the browser. No new dependency is required for the initial build.

### Content and language rules

- Support all **six directed, distinct** source→target pairs among `id`, `en`, `zh-Hans`. Do not show an empty/unsupported course as selectable. Seed at least one unit, two lessons per pair and four exercises per lesson. IDs must remain stable across copy edits. A catalog has a `version` that changes if IDs/answers/order change incompatibly.
- `sourceLanguage !== targetLanguage`. UI language defaults to selected source; selector may change it independently. Every `LocalizedLabel` has all three translations; each `LanguageText` declares its actual language. For Mandarin display Hanzi and optionally pinyin (`romanization`) as supplementary text, never as the only answer. Avoid flag-only language labels (English, Bahasa Indonesia, 简体中文 are readable names).
- Each lesson owns a fixed ordered set of exercise IDs; the course→unit→lesson→exercise references must resolve and agree on parent IDs. `choice` options have unique IDs and exactly one `correctOptionId`; `order` has unique token IDs and `correctTokenIds` is an exact permutation. Answer by **ID**, not by visible text (duplicate words are valid). Do not shuffle order in MVP; the session snapshots ordered exercise IDs.
- Validate catalog integrity during development (missing refs, duplicate IDs, bad answers, empty lessons, missing labels, unsupported pairs). If shipped content is malformed, show a recoverable error rather than trap the learner in a quiz. Instructions/explanations should use the source language for a given pair; prompts and options can be in either language as indicated by their `LanguageText.language`.

## Routes and user flow

| Route | Purpose | Primary behavior |
| --- | --- | --- |
| `/` | Welcome / entry | First visit: choose source and target (different), choose UI language if desired, then **Start exploring** creates a local profile and enters `/learn`. Returning learner: redirect or link to `/learn`. |
| `/learn` | Practice map | Show selected pair, units and lessons in order, completed stamps, total XP, today's goal, streak and **Continue** to the first unfinished lesson. A completed lesson is replayable. Pair selection in settings does not erase other pairs' results. |
| `/lesson/[lessonId]` | Quiz and result | Guard invalid IDs and mismatched pair with a friendly return to `/learn`; start or resume the matching session. One prompt at a time; select/reorder, submit, see correct/incorrect feedback and explanation, continue. After final feedback, show the completion summary, XP and return/replay actions on this route. |
| `/progress` | Journal | Show total XP, local-day streak, completed lessons and per-lesson best score for the selected pair. Empty state links to `/learn`. |
| `/settings` | Preferences | Change source/target/UI languages and daily XP goal; switching pair abandons an in-progress quiz after confirmation. Offer explicit **Reset local progress** with confirmation. |

Navigation: bottom tab bar for Learn / Journal / Settings on small screens, with labels and active states; wider screens can use a rail. Keep the primary quiz action reachable at thumb height without covering content. The quiz header exposes lesson title, text progress `Question n of N`, and a labelled exit action. A deep link to a lesson with no profile goes to `/`; a reload while active resumes the exact question or feedback, not a new attempt. Unknown/removed lesson IDs return to `/learn` with a message. Never silently start a different lesson.

## Quiz state machine

`QuizState` and `QuizEvent` are the public contracts. Implement transitions in one pure reducer (clock/UUID/catalog supplied at the boundary); render by `phase`. Ignore invalid events, and disable controls while committing a transition. One submission per question:

| From | Event | To / side effect |
| --- | --- | --- |
| `idle` | `START` with valid pair/lesson | Create UUID session, snapshot `catalogVersion` and ordered exercise IDs, start at `question(index=0, draft=null)`. |
| `question` | `SET_DRAFT` | Replace draft after verifying answer kind and IDs belong to the current exercise. For ordering, permit partial selection while drafting, but not submission. |
| `question` with complete draft | `SUBMIT` | Grade once, append one `AnswerRecord`, persist; move to `feedback` at same index. Wrong answers still advance after feedback. |
| `feedback` | `CONTINUE` before last | Go to next `question`, clear draft. |
| `feedback` | `CONTINUE` on last | Build `SessionResult`, commit by `sessionId` exactly once, clear active session, show `complete`. |
| `question` / `feedback` | `QUIT` | Confirm when leaving; clear active session, do not award XP or mark lesson complete. |
| `complete` | `START` | Replay with a new session ID; previous completed result remains. |

`SUBMIT` is disabled for null/invalid/incomplete drafts and while feedback is displayed. Evaluate choice by `optionId`; evaluate order by exact ordered token IDs. Feedback exposes the correct answer, the learner's answer, and the explanation in text as well as visual styling. Completion `correctCount` equals the number of correct `AnswerRecord`s; `questionCount` equals snapshot length. A direct route change/refresh must not itself award XP. If an active session's catalog version or referenced content no longer matches, discard only that active session with an explanation; keep completed results. If a completed `sessionId` is found during a delayed/repeated final action, display that stored result instead of paying twice.

## Persistence and rewards

Use `localStorage` key **`tycon:v1`** with the `PersistedState` envelope (`schemaVersion: 1`). At first browser hydration, parse in a `try/catch`, validate shape/version and language pair, then initialize a clean state if absent/corrupt; don't access `window` during server render. Keep an in-memory state if storage is unavailable (private mode/quota) and warn that progress may be lost. Save the whole envelope after profile changes, draft/answer transitions, quit and completion. Treat `completedSessions` keyed by UUID as the source of truth; `ProgressSummary` and `LessonProgress` are projections, not separate writable stores. Only `question`/`feedback` belong in `activeSession`; a completed screen can be transient. A reset clears the key and in-memory state after confirmation.

XP: a lesson's **first completed session** earns `10 + 2 × correctCount`; replay earns `0` XP. Derive "first" across *all* saved results for that `lessonId`, including other selected pairs (IDs are globally unique); tie-break by `completedAt` then `sessionId`. Store the awarded `xpEarned` in the result; totals sum committed results only. Daily goal defaults to 12 XP; today's XP sums results whose `completedOn` matches the learner's current local `YYYY-MM-DD`. A streak counts consecutive distinct local completion dates ending today, or yesterday if no completion today; otherwise it is 0. Multiple completions on a day count once. Capture `completedOn` on the client at completion, not by slicing a UTC timestamp. No streak punishment, hearts, or timers. Settings pair changes preserve historical results but clear the active session on confirmation; progress lists only current-pair lessons while total XP/streak remain global. Storage is device/browser-local; do not imply cloud sync.

## Accessibility and responsive behavior

- Start at a 320px viewport; allow text zoom to 200% and reflow without horizontal scrolling. Use readable contrast (WCAG AA: 4.5:1 body text, 3:1 large text and UI boundaries), visible focus indicators, 44×44 CSS-pixel touch targets and semantic buttons/links.
- Every interaction is keyboard operable: radio-style choice selection, labelled move controls or keyboard-operable reorder for tokens, Submit/Continue/Exit. No drag-only task. Manage focus on new questions and feedback; announce progress and grading in an `aria-live` region without stealing focus unexpectedly. Never communicate correctness or progress by color alone.
- Set document `lang` to UI language; mark actual Indonesian/English/Mandarin passages with `lang` (`id`, `en`, `zh-Hans`), provide clear text labels for icons and pinyin, and use CJK-capable font fallbacks. Respect `prefers-reduced-motion`; animations are optional and nonessential. Keep feedback visible until Continue, not timed away. Ensure sticky actions do not cover the on-screen keyboard or bottom navigation.

## MVP acceptance criteria

1. On a fresh browser, a learner can choose any of six distinct pairs, read localized controls, enter a seeded course and finish a lesson of both `choice` and `order` questions on a narrow phone without sign-in.
2. Wrong and right submissions show different **text** feedback and an explanation; duplicate displayed tokens remain distinguishable by ID; disabled submit prevents empty or incomplete answers; keyboard-only and touch users can finish the same lesson.
3. Refreshing during an unsubmitted question or after submission restores the same draft/feedback and does not duplicate an answer; completing and replaying does not duplicate XP. Quit gives no reward.
4. First completion earns `10 + 2 × correctCount`, replay earns 0; journal, goal and streak update from committed results and survive reload. Switching pairs preserves previous results but shows only the selected pair's lesson stamps. Reset is explicit and irreversible.
5. Bad storage, unknown deep links, outdated active content and storage write failures have recoverable UI, not a blank screen. SSR/build does not access browser storage, and TypeScript strict compilation passes.
6. At 320px and 200% zoom, content remains usable; focus, language tags, text alternatives, contrast, reduced-motion and non-color feedback pass manual checks. No copied third-party learning-app branding appears.
