# Tycon production architecture

## Active product

Tycon currently ships one local-first language path: **Bahasa Indonesia (`id`) → English (`en`)**. The generic course offers short everyday-English lessons. The separate `/ielts` route launches the Indonesian-to-English IELTS Journey reading pilot. Do not expose a language-pair chooser or unsupported language seed in user-facing UI. Legacy browser profiles are normalized to the active pair, and obsolete attempts are not used as IELTS scores.

The visual identity remains a personal travel/field notebook with route cards, checkpoints, and a calm progress trail. IELTS Journey is independent practice, not an IELTS product or publisher endorsement. It makes no band-score prediction. Listening remains unavailable until original or separately licensed audio is approved. No private PDF, MP3, scan, OCR output, transcript, or answer key ships in the app or public assets.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | First-visit onboarding; creates the fixed Indonesian → English profile. |
| `/learn` | Everyday English dashboard and IELTS Journey entry point. |
| `/map` | Generic English lesson map and IELTS Journey entry point. |
| `/lesson/[lessonId]` | Resumable generic English quiz. |
| `/ielts` | IELTS Journey reading pilot with overview, questions, feedback, results, and review. |
| `/progress` | Generic course journal. |
| `/settings` | Daily XP goal and generic local-progress reset. IELTS pilot progress is separate. |

App navigation uses real routes so direct links and browser history work. The IELTS pilot owns localStorage key `tycon:ielts:v1`; generic lessons retain `tycon:v1`. Do not merge IELTS raw scores/XP with legacy course results. Both experiences work without accounts or server sync.

## IELTS pilot state and privacy

The pilot restores its overview/quest/completion screen, current question, draft answer, submitted feedback, hearts, practice XP, and best raw score from the browser. Invalid/unavailable storage produces a recoverable in-memory experience. Resetting generic progress must not erase IELTS data. Never store or reference a source PDF/MP3 path from the app. Source OCR belongs only on an authorized restricted workstation, with output kept outside the repository; rights and editorial review must precede any use of derived material.

## Everyday English curriculum

`src/data/curriculum.ts` exports only Indonesian and English everyday-learning seeds. The active catalog in `src/lib/learning.ts` builds only the `id` → `en` course; its existing stable English lesson IDs and local progress format are retained where compatible. No other pair is selectable or seeded into the active catalog.

## Accessibility and build

Keep all actions semantic and keyboard accessible, maintain visible focus and non-color answer feedback, mark English passages with `lang="en"`, and respect reduced motion. Verify with:

```bash
npm run lint
npm run typecheck
npm run build
```
