# IELTS Journey — Indonesian → English pilot

**Status:** design only; supersedes `docs/architecture.md` for this pilot. No app/code/content migration has been implemented. This is independent IELTS preparation, **not affiliated with or endorsed by IELTS or the source publisher**. Target learner: Indonesian speaker preparing for Academic Reading and Listening. The only supported learning direction and UI locale for launch are `id` → `en` and Indonesian (English may appear inside English-language questions). Do not offer Mandarin or a language-pair picker.

## Source inventory and rights gate

The supplied source lives in a private directory outside this repository; do not hardcode its absolute path in committed code or configuration. The supplied PDF is described as a **91-page scanned PDF**; inventory shows one PDF and 45 MP3s: `CD1` tracks 01–24 and `CD2` tracks 01–21. Track numbering **restarts** on CD2; a bare number is never an identifier. Page count, printed numbering, track contents, and their correspondence have **not** been independently verified. File names/count alone do not establish a page↔track mapping.

The files are private and copyrighted. Possession/access is **not** a redistribution, adaptation, transcription, or streaming license. Before any derived passage, recognizable paraphrase, question, transcript, cover/image, audio clip, or OCR text is shipped, the product owner must document in a private rights register: rights holder, permitted uses (internal OCR, derivative questions, excerpts, audio playback, distribution), territory, audience, term, attribution, revocation contact, and written approval. If a use is not explicitly cleared, it is **blocked**. Do not assume educational/fair-use exceptions apply. No PDF, MP3, page image, OCR output, transcript, publisher answer key, watermark, or source clip goes in Git, `public/`, client bundles, test snapshots, logs, analytics, third-party OCR/AI APIs, preview deployments, or public URLs. No automated model training on the source. Keep raw media and extracted artifacts in a restricted local/encrypted workspace outside the repo; limit access to authorized editors, encrypt backups, and delete temporary images/text on a documented retention schedule. Do not commit even small copied snippets as examples. For the deployable pilot, author **original** short passages, prompts, answer options, explanations and Indonesian tips from general IELTS skills; use self-produced or separately licensed audio only. The private source may serve as an editorial index **only where the rights register permits**; otherwise do not process it at all. The shipped app should function with no access to the private directory. If the publisher later grants distribution rights, add a separately reviewed, authenticated media delivery path; never expose the directory directly.

## Pilot scope and journey

One track called **IELTS Journey** with two skill checkpoints: Reading (skimming/detail) and Listening (gist/detail). Each checkpoint has two ~5-minute lessons, each with 4–6 original questions, short Indonesian coaching, explicit correction, and a review screen. Reading uses original 100–180-word passages; Listening uses newly recorded/licensed 30–90-second clips with matching authorized transcripts/captions. If audio clearance or production is incomplete, disable Listening with an honest “coming soon” state rather than substitute the private MP3s. No band-score claims from this small practice set; report correct/total and skill-specific feedback, not an IELTS band prediction. Preserve Tycon's calm notebook/checkpoint identity rather than copying any existing learning product.

Proposed App Router flow (implementation work, not routes present today):

| Route | Behavior |
| --- | --- |
| `/` | Explain independent pilot and local-only progress; choose **Start journey**. Returning learner goes to `/journey`. |
| `/journey` | Two checkpoint cards, progress, resume the next unfinished lesson, accessible locked/unavailable Listening state if no approved audio. |
| `/journey/[moduleId]` | Lesson list, estimated time and skill goal; unknown module returns to journey. |
| `/practice/[lessonId]` | Passage/player above one question at a time; select/enter answer → Submit → feedback → Continue. Save draft and submitted feedback for reload. |
| `/review/[sessionId]` | Completed attempt, explanation per question and retry; never unlock protected source media by guessing a URL. |
| `/progress` | Attempt history, best raw score per lesson, practice streak; no band-score equivalence. |
| `/settings` | Local progress reset, privacy/rights notice; no Mandarin or pair switcher. |

Legacy `/learn` may redirect to `/journey`; old `/lesson/[lessonId]` must not load a stale multilingual item: show a migration notice/link instead. Use stable, namespaced IDs such as `ielts-reading-skim-01` and `ielts-listening-gist-01` (not titles or page numbers). No rewards required for the pilot; if retaining XP, label it a practice reward, never a test score.

## Private OCR and page/track provenance workflow

**Stop before step 1 unless internal processing is cleared.** Run offline on the restricted machine; never send OCR/audio to a cloud service without separate contractual approval. Maintain an untracked/private `source-register.json` with source ID, SHA-256, size, acquisition/rights record ID, access owner, and review date. Hash raw inputs before processing and detect changes on every run. Do not place its path, hashes, or any extracted material in the client catalog. Separate the *private provenance register* from the *public authored-content catalog*.

1. Verify PDF page count by parser, enumerate pages with **1-based physical PDF page indices** and render page images locally (e.g. 300 dpi, deskew/rotate/contrast as needed). Do not infer the printed page number from physical index: front matter and omitted sheets can create offsets. Editor records `printedLabel` (string such as roman numeral or blank) after inspecting each page.
2. OCR each page offline with English-language settings, retain word boxes/confidence and a page-image pointer privately. Detect columns, tables, exercise numbering, headers and answer keys; OCR alone is not authoritative. Re-OCR low-confidence regions and have an editor compare to the scan. Record review status and reviewer/date; exclude unreviewed pages from any editorial mapping. Sanitize OCR logs and delete transient renders after review.
3. Index audio as `cd1-t01`…`cd1-t24`, `cd2-t01`…`cd2-t21`. Record hash, duration, codec and reviewer in the private register. If internal listening/transcription is allowed, use offline tools and human listening to identify cue/section boundaries in **milliseconds**; transcript/audio waveform remains private. Do not guess correlations by numeric order or a page heading. Mark each proposed relation `unmapped` → `candidate` → `verified` only after the reviewer hears the segment and checks the relevant physical page; capture `startMs`, `endMs` (`0 <= start < end <= duration`) and a confidence/reviewer note. A page can map to several spans/tracks, and a track to several pages; unmatched pages/tracks stay explicitly unmapped.
4. For every original pilot lesson, a private editorial record links `lessonId` and `itemId` to any permitted source references (`pdfPageIndex`, optional `printedLabel`, `trackId`, optional `[startMs,endMs]`), *purpose* (`skill-inspiration`, `fact-check`, or `licensed-excerpt`), rights record ID, editor, reviewer, and status. Do not treat a mapping as permission to ship the content. Publisher-like wording/answer sequences are rejected during editorial QA unless an explicit license covers them. A public item has only an opaque `provenanceId` and an `assetId` for a separately cleared/original asset; neither contains a source path or media hash.
5. Require a two-person sign-off per publishable item: content correctness/answer key and rights/provenance. CI validates public catalogs for missing IDs, invalid answers, unpublished/licensing flags, unsafe asset URLs and references to `cd1`/`cd2` media; a restricted release scan compares bundles against private-source fingerprints without exposing those fingerprints to public CI, to catch accidental OCR/scan leakage. Review actual release bundles and deployed assets as well as Git. A rights withdrawal disables affected public assets/items by ID and invalidates active sessions, while retaining an appropriately minimal learner score record.

Private mapping shape (illustrative **schema**, not a claim that any page matches any track):

```ts
type PrivateSourceRef =
  | { kind: "pdf"; sourceId: string; pdfPageIndex: number; printedLabel?: string }
  | { kind: "audio"; sourceId: string; trackId: `cd${1 | 2}-t${string}`; startMs: number; endMs: number };
type PrivateEvidence = {
  itemId: string;
  refs: PrivateSourceRef[]; // May be empty for fully original work
  purpose: "skill-inspiration" | "fact-check" | "licensed-excerpt";
  rightsRecordId: string;
  status: "unmapped" | "candidate" | "verified" | "approved" | "blocked";
  editorId: string;
  reviewerId?: string;
  reviewedAt?: string;
};
```

Validate track IDs against the enumerated register (regex alone is insufficient); validate page indices against the **verified** physical count. Even `approved` evidence does not authorize an asset whose license has expired.

## Publishable quiz contracts (proposed replacement, not `src/lib/types.ts` today)

Do not stretch the multilingual `ChoiceExercise`/`OrderExercise` into IELTS forms. Implement versioned pilot contracts in a future code task. The following is the minimum wire shape; all learner-facing strings and references in this catalog must be original or independently licensed, and each item must pass the rights gate. Explanations and hints are in Indonesian, English passages/audio are explicitly `lang="en"`.

```ts
type Skill = "reading" | "listening";
type Stimulus =
  | { kind: "passage"; id: string; text: string; language: "en"; provenanceId: string }
  | { kind: "audio"; id: string; assetId: string; language: "en";
      captionAssetId: string; durationMs: number; provenanceId: string };
type ItemBase = { id: string; stimulusId: string; prompt: string; tipId: string;
  explanationId: string; provenanceId: string };
type Item =
  | (ItemBase & { kind: "single-choice"; options: { id: string; text: string }[];
      key: { optionId: string } })
  | (ItemBase & { kind: "matching"; left: { id: string; text: string }[];
      right: { id: string; text: string }[]; key: { leftId: string; rightId: string }[] })
  | (ItemBase & { kind: "short-answer"; maxWords: number;
      acceptedAnswers: string[]; normalize: "basic-en-v1" });
type Answer =
  | { kind: "single-choice"; optionId: string }
  | { kind: "matching"; pairs: { leftId: string; rightId: string }[] }
  | { kind: "short-answer"; text: string };
type PilotCatalog = { version: string; modules: { id: string; skill: Skill;
  lessonIds: string[] }[]; lessons: { id: string; moduleId: string;
  stimulusId: string; itemIds: string[] }[]; stimuli: Stimulus[]; items: Item[] };
```

`single-choice` has 2–4 uniquely identified options and exactly one valid key. `matching` has equal nonempty sides, unique IDs and a one-to-one total mapping (order-independent grading). `short-answer` uses a positive `maxWords`; publish only editor-reviewed accepted variants. `basic-en-v1`: Unicode NFKC, trim, collapse whitespace, case-fold using a fixed English locale; **do not** strip punctuation, change spelling, use fuzzy matching, or silently remove articles. Count words after whitespace collapse and reject over-limit input before grading. Avoid short-answer questions where equivalent punctuation/spelling would unfairly change correctness; accepted variants must explicitly include such forms. No free-form AI grading. Never send answers to a third-party model.

Quiz phases remain `idle` → `question(draft)` → `feedback(submitted record)` → `complete(result)`. Only complete valid drafts submit; persist feedback before progressing, grade exactly once per item, and commit completion idempotently by session UUID. A session snapshots `catalogVersion`, `lessonId`, ordered `itemIds` and `stimulusId`; on changed/withdrawn content discard only the active session with a clear message. A review record stores answer, correctness, timestamps and item IDs, **not passage, transcript, audio, or private evidence**. Playback is optional for answering if the learner pauses, but provide controls, transcript/captions for original/cleared audio and no autoplay; never mark an unavailable player as a completed listening exercise.

## Migration from the multilingual MVP

Existing `docs/architecture.md` and `src/lib/types.ts` still specify three languages, six pairs, and `tycon:v1`. They are **legacy**, not the contract for this pilot. Future implementation must remove `zh-Hans` from UI/catalog/validators/types, remove pair selection, and load only the new pilot catalog; do not mutate those files as part of this documentation-only change.

Use a new localStorage envelope/key **`tycon:ielts:v1`** with `schemaVersion: 1`, pilot profile (`uiLanguage: "id"`, target `"en"`), completed sessions keyed by UUID, and optional active session. Parse and validate without SSR access to `window`; survive corrupt storage/quota denial with a recoverable in-memory mode. On first run inspect `tycon:v1` **read-only**: if its profile is `id`→`en`, offer to carry over only device profile ID and creation date/daily-goal preference after confirmation; otherwise create a fresh pilot profile. In every case **do not import** legacy exercise attempts, XP, streaks or active quiz (schemas/content/meaning differ); tell returning learners their old local record remains on this browser but is not included in IELTS Journey progress. Keep `tycon:v1` untouched so rollback does not lose data. Do not surface Mandarin choices, content, or legacy results in the pilot. Reset pilot progress clears only `tycon:ielts:v1`; a separate explicit opt-in action would be needed to delete legacy data. New attempts use namespaced lesson IDs, catalog version and idempotent session IDs; derive pilot raw scores/streak from committed pilot sessions alone.

## Release checks

- Rights register authorizes each shipped asset and text, or it is original independently reviewed. A clean clone/build/deploy has **zero** private PDF, MP3, OCR, transcript or copied content. Searching client chunks/public assets finds no source track paths. Audio unavailable ⇒ Listening is unavailable, not secretly streamed.
- Inventory QA confirms 91 physical pages **only after parser verification**, 24 + 21 audio tracks, unique disc-qualified IDs, no fabricated page↔track links, and human-reviewed mappings with valid bounds. Unmatched items remain marked unmapped; no source-derived material ships on a `candidate` mapping.
- From an Indonesian fresh start, learner finishes a Reading lesson with choice, matching and short-answer, reviews feedback and refreshes mid-feedback without duplicate credit. With approved original/cleared audio, the same works for Listening with accessible player and captions.
- A `zh-Hans` or other legacy profile cannot select a Mandarin course; old localStorage remains intact, no old XP becomes IELTS score, unknown/stale deep links recover. No app claims an IELTS band score or publisher endorsement.
- At 320px/200% zoom, text reflows; buttons have 44px targets, visible focus and text feedback. Keyboard-only matching and audio controls work; passage/player and feedback are properly labelled; reduced-motion and contrast requirements from the prior architecture still apply.
