# IELTS Journey — Indonesian → English pilot

**Status:** launched pilot at `/ielts`; see `docs/architecture.md` for current production behavior. This is independent IELTS preparation, **not affiliated with or endorsed by IELTS or the source publisher**. Target learner: Indonesian speaker practicing English reading. The only active generic-course pair and pilot locale are Bahasa Indonesia (`id`) → English (`en`). Do not offer a language-pair picker or Mandarin. Reading is a short T/F/NG pilot; Listening remains visibly unavailable until original or separately licensed audio is approved. The pilot persists locally under `tycon:ielts:v1`.

## Source inventory and rights gate

The supplied source lives in a private directory outside this repository; do not hardcode its absolute path in committed code or configuration. The supplied PDF is described as a **91-page scanned PDF**; inventory shows one PDF and 45 MP3s: `CD1` tracks 01–24 and `CD2` tracks 01–21. Track numbering **restarts** on CD2; a bare number is never an identifier. Page count, printed numbering, track contents, and their correspondence have **not** been independently verified. File names/count alone do not establish a page↔track mapping.

The files are private and copyrighted. Possession/access is **not** a redistribution, adaptation, transcription, or streaming license. Before any derived passage, recognizable paraphrase, question, transcript, cover/image, audio clip, or OCR text is shipped, the product owner must document in a private rights register: rights holder, permitted uses (internal OCR, derivative questions, excerpts, audio playback, distribution), territory, audience, term, attribution, revocation contact, and written approval. If a use is not explicitly cleared, it is **blocked**. Do not assume educational/fair-use exceptions apply. No PDF, MP3, page image, OCR output, transcript, publisher answer key, watermark, or source clip goes in Git, `public/`, client bundles, test snapshots, logs, analytics, third-party OCR/AI APIs, preview deployments, or public URLs. No automated model training on the source. Keep raw media and extracted artifacts in a restricted local/encrypted workspace outside the repo; limit access to authorized editors, encrypt backups, and delete temporary images/text on a documented retention schedule. Do not commit even small copied snippets as examples. For the deployable pilot, author **original** short passages, prompts, answer options, explanations and Indonesian tips from general IELTS skills; use self-produced or separately licensed audio only. The private source may serve as an editorial index **only where the rights register permits**; otherwise do not process it at all. The shipped app should function with no access to the private directory. If the publisher later grants distribution rights, add a separately reviewed, authenticated media delivery path; never expose the directory directly.

## Pilot scope and journey

The launched pilot is one **Reading Quest** with six True/False/Not Given questions, Indonesian coaching, answer-by-answer feedback, a completion summary, and a review screen. The overview shows Listening as unavailable; no audio playback or transcript is shipped. XP/hearts are practice-game rewards, and the raw correct/total result is not a band prediction. The broader two-skill, multi-lesson journey remains future scope. Preserve Tycon's calm notebook/checkpoint identity rather than copying any existing learning product.

Production routes and current scope:

| Route | Behavior |
| --- | --- |
| `/` | Fixed Indonesian → English onboarding for the generic course. |
| `/learn` and `/map` | Everyday English dashboard/map with direct entry to IELTS Journey. |
| `/ielts` | Pilot overview, six-question Reading Quest, answer feedback, completion and review. |
| `/settings` | Generic-course goal and reset preferences; does not erase IELTS pilot progress. |
| Pilot Listening | Explicitly marked unavailable; no MP3 is bundled or played. |

The implemented pilot currently uses one stable namespaced Reading Quest ID in `src/data/ielts-pilot.ts`. Pilot XP and hearts are practice-game rewards only; raw correct/total is not a band score. Browser back/forward and direct `/ielts` navigation are supported.

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

The current pilot uses a compact True/False/Not Given catalog in `src/data/ielts-pilot.ts`, separate from generic choice/order lessons. This is a limited pilot, not the future full Reading/Listening catalog described by the schema below. Every shipped passage, prompt, explanation, and asset remains subject to the rights gate; the design schema below is a future expansion contract. Explanations and hints are in Indonesian, and English-language statements/evidence are marked `lang="en"`.

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

## Production persistence and migration

The generic course retains `tycon:v1`; the IELTS pilot independently stores screen, question index, draft choice, submitted responses, hearts, practice XP, best raw score, and completion state at **`tycon:ielts:v1`**. Browser storage is accessed client-side only. If reading/writing storage fails, the UI continues in memory and warns that progress may be lost. The IELTS pilot never imports generic XP, attempts, streaks, or active quizzes. Generic-profile migration normalizes the active course to Indonesian → English and drops incompatible old course attempts; it does not delete the separate IELTS key. Resetting generic progress does not clear IELTS progress.

No private PDF or MP3 is in the app bundle, `public/`, or Git. The private source directory is not an asset host. OCR/import instructions are in the repository README and require prior rights clearance; extracted files must stay outside the repository. The current pilot content itself must still pass the product's rights review before public release.

## Release checks

- Rights register authorizes each shipped asset and text, or it is original independently reviewed. A clean clone/build/deploy has **zero** private PDF, MP3, OCR, transcript or copied content. Searching client chunks/public assets finds no source track paths. Audio unavailable ⇒ Listening is unavailable, not secretly streamed.
- Inventory QA confirms 91 physical pages **only after parser verification**, 24 + 21 audio tracks, unique disc-qualified IDs, no fabricated page↔track links, and human-reviewed mappings with valid bounds. Unmatched items remain marked unmapped; no source-derived material ships on a `candidate` mapping.
- The current browser pilot restores its selected answer, submitted feedback, question index, and completion after reload; it supports keyboard/touch response and review. Choice/matching/short-answer modules and audio are future scope, not current shipped functionality.
- The learner-facing app exposes only Indonesian → English. Legacy XP is never treated as IELTS score; IELTS progress remains in its own localStorage key. No app claim implies an IELTS band score or publisher endorsement.
- At 320px/200% zoom, text reflows; buttons have visible focus and text feedback. The current pilot uses native radio controls and labelled evidence/feedback regions. Audio and matching controls are not present in this release.
