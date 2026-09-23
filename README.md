# Tycon

Tycon is a local-first language practice journal for English, Bahasa Indonesia, and Simplified Mandarin. Learners can use any of the six directed language pairs, complete short choice and word-order lessons, and track XP, streaks, and best scores without an account.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production checks:

```bash
npm run lint
npm run build
npm start
```

## Product behavior

- Progress is stored only in browser `localStorage` under `tycon:v1`.
- Active questions and submitted feedback resume after refresh.
- The first completion of a lesson earns `10 + 2 × correct answers` XP; replays earn no additional XP.
- `/learn`, `/map`, `/lesson/[lessonId]`, `/progress`, and `/settings` are directly addressable.
- Resetting progress removes the local profile, sessions, and journal.

See [`docs/architecture.md`](docs/architecture.md) for the content contracts, state machine, persistence rules, and acceptance criteria.
