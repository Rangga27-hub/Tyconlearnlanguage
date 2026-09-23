# Tycon

Tycon is a local-first learning journal for one active language path: **Bahasa Indonesia → English**. Learners can practice everyday English or visit the independent IELTS Journey reading pilot. IELTS practice is not affiliated with IELTS or any publisher and does not predict a band score.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production checks:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Product behavior

- The generic course supports Indonesian speakers practicing English. Its lessons and progress use `tycon:v1` in this browser.
- IELTS Journey is available directly at [`/ielts`](http://localhost:3000/ielts), and from the dashboard and map. Pilot progress is separate under `tycon:ielts:v1`.
- IELTS practice progress (answers, current question, XP and best raw score) is restored after refresh. Browser back/forward navigates between app routes.
- Listening is a clearly marked future checkpoint; there is no audio playback in this pilot.
- No account or cloud sync is used. Resetting everyday-course progress does not delete IELTS progress.

## Optional private, local OCR workflow

**Only process material when the rights holder has explicitly authorized internal OCR.** The PDF and MP3s are private copyrighted source files and are not included in this repository or product. Never copy them, OCR output, scans, transcripts, answer keys, or audio into Git, `public/`, client bundles, logs, or a public URL. Do not send source files to cloud OCR or AI services.

Set up the OCR tools on an authorized offline/restricted workstation (or install dependencies before disconnecting it):

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
python -m pip install pymupdf rapidocr-onnxruntime
```

Keep both the source PDF and output directory outside the repository, then OCR selected **1-based physical PDF page indices**:

```bash
python scripts/extract_pdf_ocr.py "D:/restricted/source/book.pdf" \
  --pages 6,74-76 \
  --output "D:/restricted/tycon-ocr-review" \
  --dpi 300
```

The script writes page images and OCR JSON to the selected output directory. Treat all outputs as private. Have an authorized editor verify OCR against the scans and keep provenance/rights records in the restricted workspace. Do not import or publish extracted text. Only independently authored or separately licensed material with documented approval may be manually added to the app catalog. If rights are unclear, do not process or use the source.

See [`docs/ielts-pilot.md`](docs/ielts-pilot.md) for the pilot scope, privacy boundary, source-rights workflow, and current limitations.
