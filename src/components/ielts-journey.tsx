"use client";

/* eslint-disable react-hooks/set-state-in-effect -- restore and persist browser-local pilot progress */
import { useEffect, useRef, useState } from "react";
import { ieltsPilot, type TrueFalseNotGiven } from "@/data/ielts-pilot";
import { ieltsListeningModuleAPage14 } from "@/data/ielts-listening-module-a-page-14";
import { grammarPractices, moduleBListeningPage23, moduleBReadingPage20, moduleCListeningPage38, moduleCReadingPage34, moduleDListeningPage46, moduleDListeningPage52, moduleDReadingPage49, moduleEListeningPage60, moduleEReadingPage65, moduleFListeningPage76, moduleFReadingPage72, moduleGListeningPage87, moduleGListeningPage94, moduleGReadingPage88, moduleHListeningPage99, moduleHReadingPage103 } from "@/data/ielts-module-expansion";
import { Icon } from "@/components/ui-icons";

type Screen = "overview" | "module" | "quest" | "complete" | "listening" | "grammar" | "readingB";
type Response = { questionId: string; choice: TrueFalseNotGiven; correct: boolean };
type PilotProgress = { version: 1; screen: Screen; index: number; choice: TrueFalseNotGiven | null; responses: Response[]; submitted: boolean; hearts: number; xp: number; best: number | null; attemptFinished: boolean };
const PILOT_STORAGE_KEY = "tycon:ielts:v1";
const choices: { value: TrueFalseNotGiven; label: string; help: string }[] = [
  { value: "TRUE", label: "True", help: "Sesuai dengan teks" },
  { value: "FALSE", label: "False", help: "Bertentangan dengan teks" },
  { value: "NOT GIVEN", label: "Not Given", help: "Tidak disebutkan dalam teks" },
];
const total = ieltsPilot.questions.length;
const listeningTotal = ieltsListeningModuleAPage14.questions.length;
const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isChoice = (value: unknown): value is TrueFalseNotGiven => value === "TRUE" || value === "FALSE" || value === "NOT GIVEN";

function parseProgress(value: unknown): PilotProgress | null {
  if (!isObject(value) || value.version !== 1 || (value.screen !== "overview" && value.screen !== "quest" && value.screen !== "complete")) return null;
  if (!Number.isInteger(value.index) || (value.index as number) < 0 || (value.index as number) >= total || !Array.isArray(value.responses)) return null;
  const index = value.index as number;
  const responses: Response[] = [];
  for (let responseIndex = 0; responseIndex < value.responses.length; responseIndex++) {
    const saved = value.responses[responseIndex], question = ieltsPilot.questions[responseIndex];
    if (!isObject(saved) || !question || saved.questionId !== question.id || !isChoice(saved.choice) || saved.correct !== (saved.choice === question.answer)) return null;
    responses.push({ questionId: question.id, choice: saved.choice, correct: saved.correct });
  }
  if (!isChoice(value.choice) && value.choice !== null) return null;
  if (typeof value.submitted !== "boolean" || typeof value.attemptFinished !== "boolean") return null;
  const expectedResponses = value.submitted ? index + 1 : index;
  if ((!value.attemptFinished && responses.length !== expectedResponses) || (value.attemptFinished && (responses.length !== total || index !== total - 1 || !value.submitted))) return null;
  if (value.screen === "complete" && !value.attemptFinished || value.screen === "quest" && value.attemptFinished) return null;
  if (value.submitted && (value.choice === null || responses[index]?.choice !== value.choice)) return null;
  const wrongCount = responses.filter((response) => !response.correct).length;
  if (!Number.isInteger(value.hearts) || value.hearts !== Math.max(0, 5 - wrongCount)) return null;
  if (!Number.isInteger(value.xp) || (value.xp as number) < responses.filter((response) => response.correct).length * 15 || (value.xp as number) % 15 !== 0) return null;
  if (value.best !== null && (!Number.isInteger(value.best) || (value.best as number) < 0 || (value.best as number) > total)) return null;
  const correctCount = responses.filter((response) => response.correct).length;
  if (value.attemptFinished && (value.best === null || (value.best as number) < correctCount)) return null;
  return { version: 1, screen: value.screen, index, choice: value.choice, responses, submitted: value.submitted, hearts: value.hearts as number, xp: value.xp as number, best: value.best as number | null, attemptFinished: value.attemptFinished };
}

/** A self-contained, browser-persisted visual pilot. */
export function IeltsJourney() {
  const [screen, setScreen] = useState<Screen>("overview");
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<TrueFalseNotGiven | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [attemptFinished, setAttemptFinished] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const [recoveryNotice, setRecoveryNotice] = useState("");
  const [selectedModule, setSelectedModule] = useState<"A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J">("A");
  const [selectedListening, setSelectedListening] = useState<"A" | "B" | "C" | "D1" | "D2" | "E" | "F" | "G1" | "G2" | "H">("A");
  const [listeningAnswers, setListeningAnswers] = useState<string[]>(() => Array(listeningTotal).fill(""));
  const [listeningSubmitted, setListeningSubmitted] = useState(false);
  const [selectedGrammar, setSelectedGrammar] = useState<"A" | "B" | "C" | "D" | "E" | "F" | "G" | "H">("A");
  const [grammarAnswers, setGrammarAnswers] = useState<string[]>(() => Array(grammarPractices[0].questions.length).fill(""));
  const [grammarSubmitted, setGrammarSubmitted] = useState(false);
  const [selectedReading, setSelectedReading] = useState<"B" | "C" | "D" | "E" | "F" | "G" | "H">("B");
  const [readingBAnswers, setReadingBAnswers] = useState<string[]>(() => Array(moduleBReadingPage20.questions.length).fill(""));
  const [readingBSubmitted, setReadingBSubmitted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const question = ieltsPilot.questions[index];
  const isCorrect = choice === question.answer;
  const correctCount = responses.filter((response) => response.correct).length;
  const percent = Math.round((responses.length / total) * 100);
  const moduleAListeningPractice = {
    id: ieltsListeningModuleAPage14.id,
    module: "A" as const,
    title: ieltsListeningModuleAPage14.title,
    bookPage: 14,
    answerKeyPage: 74,
    sourceNote: `${ieltsListeningModuleAPage14.source.work}, Module A, Focus on listening page 14. Audio mapping: CD1 Track 1 for setup and CD1 Track 2 for questions 1–10.`,
    learningGoal: ieltsListeningModuleAPage14.learningGoal,
    instructions: ieltsListeningModuleAPage14.instructions,
    tracks: ieltsListeningModuleAPage14.tracks.map((track) => ({ ...track, label: track.id === "cd1-t01" ? "CD1 Track 1" : "CD1 Track 2" })),
    questions: ieltsListeningModuleAPage14.questions,
  };
  const listeningPractice = selectedListening === "B" ? moduleBListeningPage23 : selectedListening === "C" ? moduleCListeningPage38 : selectedListening === "D1" ? moduleDListeningPage46 : selectedListening === "D2" ? moduleDListeningPage52 : selectedListening === "E" ? moduleEListeningPage60 : selectedListening === "F" ? moduleFListeningPage76 : selectedListening === "G1" ? moduleGListeningPage87 : selectedListening === "G2" ? moduleGListeningPage94 : selectedListening === "H" ? moduleHListeningPage99 : moduleAListeningPractice;
  const activeListeningTotal = listeningPractice.questions.length;
  const activeGrammar = grammarPractices.find((practice) => practice.module === selectedGrammar) ?? grammarPractices[0];
  const activeReading = selectedReading === "C" ? moduleCReadingPage34 : selectedReading === "D" ? moduleDReadingPage49 : selectedReading === "E" ? moduleEReadingPage65 : selectedReading === "F" ? moduleFReadingPage72 : selectedReading === "G" ? moduleGReadingPage88 : selectedReading === "H" ? moduleHReadingPage103 : moduleBReadingPage20;
  const ieltsModules = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] as const;
  const moduleThemes: Record<(typeof ieltsModules)[number], { title: string; icon: string; unlocked: boolean; accent: string }> = {
    A: { title: "The Feel-good Factor", icon: "🦠", unlocked: true, accent: "mint" },
    B: { title: "City", icon: "☀️", unlocked: true, accent: "sun" },
    C: { title: "Rush", icon: "🌀", unlocked: true, accent: "berry" },
    D: { title: "Work & Art", icon: "🎵", unlocked: true, accent: "mint" },
    E: { title: "Nature", icon: "🌋", unlocked: true, accent: "sun" },
    F: { title: "Study", icon: "💻", unlocked: true, accent: "berry" },
    G: { title: "Communication", icon: "📡", unlocked: true, accent: "mint" },
    H: { title: "Future", icon: "🚀", unlocked: true, accent: "sun" },
    I: { title: "Tourism", icon: "🚌", unlocked: false, accent: "berry" },
    J: { title: "Images", icon: "🎨", unlocked: false, accent: "mint" },
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PILOT_STORAGE_KEY);
      if (raw) {
        let saved: PilotProgress | null = null;
        try { saved = parseProgress(JSON.parse(raw)); } catch { /* Invalid JSON is recovered below. */ }
        if (saved) {
          setScreen(saved.screen); setIndex(saved.index); setChoice(saved.choice); setResponses(saved.responses); setSubmitted(saved.submitted); setHearts(saved.hearts); setXp(saved.xp); setBest(saved.best); setAttemptFinished(saved.attemptFinished);
        } else {
          localStorage.removeItem(PILOT_STORAGE_KEY);
          setRecoveryNotice("Progres lama tidak valid dan telah direset dengan aman.");
        }
      }
    } catch { setStorageWarning(true); }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const progress: PilotProgress = { version: 1, screen: screen === "quest" || screen === "complete" ? screen : "overview", index, choice, responses, submitted, hearts, xp, best, attemptFinished };
      const pristine = screen === "overview" && index === 0 && choice === null && responses.length === 0 && !submitted && hearts === 5 && xp === 0 && best === null && !attemptFinished;
      if (pristine) localStorage.removeItem(PILOT_STORAGE_KEY);
      else localStorage.setItem(PILOT_STORAGE_KEY, JSON.stringify(progress));
      setStorageWarning(false);
    } catch { setStorageWarning(true); }
  }, [hydrated, screen, index, choice, responses, submitted, hearts, xp, best, attemptFinished]);

  useEffect(() => {
    if (screen === "quest") {
      if (submitted) feedbackRef.current?.focus();
      else headingRef.current?.focus();
    } else if (screen === "complete") headingRef.current?.focus();
  }, [screen, index, submitted]);

  function start(restart = false) {
    if (!restart && screen === "overview" && !attemptFinished && (responses.length > 0 || choice !== null)) {
      setScreen("quest");
      return;
    }
    setIndex(0); setChoice(null); setResponses([]); setSubmitted(false);
    setHearts(5); setAttemptFinished(false); setScreen("quest");
  }
  function submit() {
    if (!choice || submitted) return;
    const correct = choice === question.answer;
    setResponses((previous) => [...previous, { questionId: question.id, choice, correct }]);
    if (correct) setXp((previous) => previous + 15);
    else setHearts((previous) => Math.max(0, previous - 1));
    setSubmitted(true);
  }
  function resetProgress() {
    if (!window.confirm("Hapus seluruh progres IELTS Journey di browser ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try { localStorage.removeItem(PILOT_STORAGE_KEY); setStorageWarning(false); }
    catch { setStorageWarning(true); }
    setScreen("overview"); setIndex(0); setChoice(null); setResponses([]); setSubmitted(false); setHearts(5); setXp(0); setBest(null); setAttemptFinished(false); setRecoveryNotice("");
  }

  function continueQuest() {
    if (!submitted) return;
    if (index === total - 1) {
      setBest((previous) => Math.max(previous ?? 0, correctCount));
      setAttemptFinished(true);
      setScreen("complete");
    } else {
      setIndex((previous) => previous + 1);
      setChoice(null);
      setSubmitted(false);
    }
  }

  function openModule(module: (typeof ieltsModules)[number]) {
    if (!moduleThemes[module].unlocked) return;
    setSelectedModule(module);
    setScreen("module");
  }

  function openListening(module: "A" | "B" | "C" | "D1" | "D2" | "E" | "F" | "G1" | "G2" | "H") {
    const practice = module === "B" ? moduleBListeningPage23 : module === "C" ? moduleCListeningPage38 : module === "D1" ? moduleDListeningPage46 : module === "D2" ? moduleDListeningPage52 : module === "E" ? moduleEListeningPage60 : module === "F" ? moduleFListeningPage76 : module === "G1" ? moduleGListeningPage87 : module === "G2" ? moduleGListeningPage94 : module === "H" ? moduleHListeningPage99 : ieltsListeningModuleAPage14;
    setSelectedListening(module);
    setListeningAnswers(Array(practice.questions.length).fill(""));
    setListeningSubmitted(false);
    setScreen("listening");
  }

  function openGrammar(module: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H") {
    const practice = grammarPractices.find((item) => item.module === module) ?? grammarPractices[0];
    setSelectedGrammar(module);
    setGrammarAnswers(Array(practice.questions.length).fill(""));
    setGrammarSubmitted(false);
    setScreen("grammar");
  }

  function openReadingB(module: "B" | "C" | "D" | "E" | "F" | "G" | "H" = "B") {
    const practice = module === "C" ? moduleCReadingPage34 : module === "D" ? moduleDReadingPage49 : module === "E" ? moduleEReadingPage65 : module === "F" ? moduleFReadingPage72 : module === "G" ? moduleGReadingPage88 : module === "H" ? moduleHReadingPage103 : moduleBReadingPage20;
    setSelectedReading(module);
    setReadingBAnswers(Array(practice.questions.length).fill(""));
    setReadingBSubmitted(false);
    setScreen("readingB");
  }

  function normalizeListeningAnswer(value: string) {
    return value.toLowerCase().replace(/\band\b/g, " ").replace(/[.,]/g, "").replace(/\s+/g, " ").trim();
  }

  function isListeningAnswerCorrect(questionIndex: number) {
    const answer = normalizeListeningAnswer(listeningAnswers[questionIndex] ?? "");
    if (!answer) return false;
    if (selectedListening === "A" && questionIndex === 3) return answer.includes("monday") && answer.includes("wednesday");
    if (selectedListening === "A" && (questionIndex === 8 || questionIndex === 9)) {
      const pair = [normalizeListeningAnswer(listeningAnswers[8] ?? ""), normalizeListeningAnswer(listeningAnswers[9] ?? "")];
      const isForm = (value: string) => listeningPractice.questions[8].acceptedAnswers.some((accepted) => normalizeListeningAnswer(accepted) === value);
      const isCertificate = (value: string) => listeningPractice.questions[9].acceptedAnswers.some((accepted) => normalizeListeningAnswer(accepted) === value);
      return pair[0] !== pair[1] && ((isForm(pair[0]) && isCertificate(pair[1])) || (isForm(pair[1]) && isCertificate(pair[0])));
    }
    return listeningPractice.questions[questionIndex].acceptedAnswers.some((accepted) => normalizeListeningAnswer(accepted) === answer);
  }

  function normalizeGrammarAnswer(value: string) {
    return value.toLowerCase().replace(/[.,]/g, "").replace(/\s+/g, " ").trim();
  }

  function isGrammarAnswerCorrect(questionIndex: number) {
    const answer = normalizeGrammarAnswer(grammarAnswers[questionIndex] ?? "");
    return Boolean(answer) && activeGrammar.questions[questionIndex].acceptedAnswers.some((accepted) => normalizeGrammarAnswer(accepted) === answer);
  }

  function isReadingBAnswerCorrect(questionIndex: number) {
    const answer = normalizeGrammarAnswer(readingBAnswers[questionIndex] ?? "");
    return Boolean(answer) && activeReading.questions[questionIndex].acceptedAnswers.some((accepted) => normalizeGrammarAnswer(accepted) === answer);
  }

  const listeningCorrect = listeningPractice.questions.filter((_, questionIndex) => isListeningAnswerCorrect(questionIndex)).length;
  const grammarCorrect = activeGrammar.questions.filter((_, questionIndex) => isGrammarAnswerCorrect(questionIndex)).length;
  const readingBCorrect = activeReading.questions.filter((_, questionIndex) => isReadingBAnswerCorrect(questionIndex)).length;

  if (!hydrated) return <main className="ielts-journey" lang="id"><p role="status">Membuka catatan perjalanan…</p></main>;

  return (
    <main className="ielts-journey" lang="id">
      {storageWarning && <p className="ielts-storage-warning" role="alert">Progres mungkin tidak tersimpan karena penyimpanan browser tidak tersedia.</p>}
      {recoveryNotice && <p className="ielts-storage-warning" role="status">{recoveryNotice}</p>}
      <div className="ielts-page-head">
        <div className="ielts-identity"><span className="ielts-identity-mark" aria-hidden="true">✳</span><span>TYCON <span className="ielts-identity-slash">/</span> IELTS JOURNEY</span></div>
        <div className="ielts-lang-pill"><span aria-hidden="true">🇮🇩</span> Bahasa Indonesia <span aria-hidden="true">→</span> <span aria-hidden="true">🇬🇧</span> English</div>
      </div>

      {screen === "overview" && <>
        <section className="ielts-hero" aria-labelledby="ielts-title">
          <div className="ielts-hero-copy"><span className="ielts-eyebrow"><span aria-hidden="true">✦</span> LANGKAH KECIL, TUJUAN BESAR</span><h1 id="ielts-title">Your journey<br/>starts <em>here.</em></h1><p>Latihan IELTS yang terasa lebih ringan. Baca dengan teliti, temukan bukti, dan bangun percaya diri—satu pertanyaan setiap kali.</p><a className="ielts-button ielts-button-light" href="#ielts-module-map">Pilih module <Icon name="arrow" size={19}/></a><span className="ielts-hero-foot">ACADEMIC IELTS <span aria-hidden="true">✳</span> MODULE MAP</span></div>
          <div className="ielts-hero-art" aria-hidden="true"><div className="ielts-orbit ielts-orbit-one"/><div className="ielts-orbit ielts-orbit-two"/><div className="ielts-paper"><span className="ielts-paper-dot">✦</span><span className="ielts-paper-line long"/><span className="ielts-paper-line"/><span className="ielts-paper-line short"/><span className="ielts-paper-answer">T <span>F</span> NG</span></div><span className="ielts-hero-spark spark-a">✳</span><span className="ielts-hero-spark spark-b">✦</span><span className="ielts-hero-spark spark-c">✧</span><div className="ielts-art-sticker"><span>↗</span><strong>Find your way</strong><small>one clue at a time</small></div></div>
        </section>
        <div id="ielts-module-map" className="ielts-section-title"><div><span className="ielts-kicker">PETA PERJALANAN</span><h2>Choose your module<span aria-hidden="true"> ✳</span></h2><p>Mulai dari module, lalu pilih Reading, Listening, atau Grammar di dalamnya.</p></div><span className="ielts-small-badge">MODULE A–J</span></div>
        <div className="ielts-module-layout"><section className="ielts-module-map" aria-label="Daftar module IELTS">{ieltsModules.map((module, moduleIndex) => { const theme = moduleThemes[module]; return <button key={module} className={`ielts-module-card ielts-module-${theme.accent} ${theme.unlocked ? "ielts-module-open" : "ielts-module-locked"}`} disabled={!theme.unlocked} onClick={() => openModule(module)} aria-label={theme.unlocked ? `Buka Module ${module}` : `Module ${module} terkunci`}><span className="ielts-module-path">{String(moduleIndex + 1).padStart(2,"0")}</span><span className="ielts-germ" aria-hidden="true"><span className="ielts-germ-face">{theme.icon}</span><span className="ielts-germ-eye eye-left"/><span className="ielts-germ-eye eye-right"/></span><span className="ielts-module-copy"><small>MODULE {module}</small><strong>{theme.title}</strong><em>{theme.unlocked ? "Reading · Listening · Grammar" : "Locked · coming soon"}</em></span><span className="ielts-module-go" aria-hidden="true">{theme.unlocked ? "↗" : "🔒"}</span></button>; })}</section>
          <aside className="ielts-overview-side"><div className="ielts-progress-card"><div className="ielts-progress-head"><span className="ielts-progress-icon" aria-hidden="true">✳</span><span>YOUR LITTLE WINS</span></div><h3>Keep growing,<br/><em>keep going.</em></h3><div className="ielts-stat-row"><span>🏅 <strong>{best === null ? "—" : `${best}/${total}`}</strong><small>skor terbaik</small></span><span>✨ <strong>{xp}</strong><small>XP latihan</small></span></div><div className="ielts-meter" role="progressbar" aria-label="Progres Reading Quest" aria-valuenow={best ?? 0} aria-valuemin={0} aria-valuemax={total}><span style={{ width: `${best === null ? 0 : (best / total) * 100}%` }}/></div><p>{!attemptFinished && (responses.length > 0 || choice !== null) ? `${responses.length} dari ${total} soal terjawab dalam quest aktif.` : best === null ? "Petualangan pertamamu menunggu." : `${best} dari ${total} jawaban benar pada percobaan terbaikmu.`}</p></div><div className="ielts-tip-card"><span aria-hidden="true">💡</span><div><strong>Alur baru</strong><p>Pilih module dulu. Module yang belum dimasukkan soalnya tetap terkunci sampai kontennya siap.</p></div></div></aside></div>
        <div className="ielts-faq-grid" aria-label="Catatan ketersediaan konten">
          <article><strong>Listening sekarang tersedia</strong><p>Module A halaman 14 memakai CD1 Track 2 untuk Questions 1–10. Jawaban diperiksa sederhana supaya kamu bisa latihan mandiri.</p></article>
          <article><strong>Kenapa baru {total} soal?</strong><p>PDF sumber berisi banyak latihan. Pilot ini baru mengambil satu set Reading yang sudah dicek: Questions 1–6 pada halaman PDF 6, dengan kunci dari halaman PDF 74. Set berikutnya bisa ditambahkan bertahap.</p></article>
        </div>
        <div className="ielts-disclaimer">Pilot belajar independen. Bukan tes resmi, tidak berafiliasi dengan IELTS maupun penerbit sumber. XP adalah hadiah latihan, bukan prediksi band score.</div><button className="ielts-reset-progress" onClick={resetProgress}>Reset progres IELTS lokal</button>
      </>}

      {screen === "module" && <>
        <div className="ielts-quest-nav"><button className="ielts-back" onClick={() => setScreen("overview")}><Icon name="back" size={18}/> Kembali ke module map</button><div className="ielts-quest-counters"><span><Icon name="book" size={17}/> Module {selectedModule}</span><span><Icon name="spark" size={17}/> {moduleThemes[selectedModule].unlocked ? "Ready" : "Locked"}</span></div></div>
        <section className={`ielts-module-hero ielts-module-${moduleThemes[selectedModule].accent}`} aria-labelledby="ielts-module-title"><div><span className="ielts-kicker">MODULE {selectedModule}</span><h1 id="ielts-module-title">{moduleThemes[selectedModule].title}</h1><p>Pilih checkpoint di module ini. Skill yang belum dimasukkan akan tetap terkunci sampai soal dan kuncinya selesai diverifikasi.</p></div><span className="ielts-germ ielts-germ-big" aria-hidden="true"><span className="ielts-germ-face">{moduleThemes[selectedModule].icon}</span><span className="ielts-germ-eye eye-left"/><span className="ielts-germ-eye eye-right"/></span></section>
        <div className="ielts-overview-grid"><div className="ielts-skills">{selectedModule === "A" && <><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">📖</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE A <span>·</span> READING</span><h3>Reading Lab</h3><p>True / False / Not Given dari pilot yang sudah diverifikasi.</p><div className="ielts-skill-tags"><span>{total} pertanyaan</span><span>available</span></div></div><button className="ielts-card-arrow" onClick={() => start()} aria-label="Mulai Reading Module A"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-listening ielts-skill-unlocked"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE A <span>·</span> LISTENING</span><h3>Job Enquiry</h3><p>White Water Sports Centre, CD1 Track 1–2.</p><div className="ielts-skill-tags"><span>10 pertanyaan</span><span>audio ready</span></div></div><button className="ielts-card-arrow" onClick={() => openListening("A")} aria-label="Buka Listening Module A"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">🧩</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE A <span>·</span> GRAMMAR</span><h3>Language Review A</h3><p>Vocabulary dan collocation seputar health, exercise, dan trends.</p><div className="ielts-skill-tags"><span>{grammarPractices[0].questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openGrammar("A")} aria-label="Buka Grammar Module A"><Icon name="arrow" size={20}/></button></article></>}{selectedModule === "B" && <><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">🌞</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE B <span>·</span> READING</span><h3>Solar Power</h3><p>Latihan ringkas dari bacaan tentang power shortage dan solar panels.</p><div className="ielts-skill-tags"><span>{activeReading.questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openReadingB("B")} aria-label="Buka Reading Module B"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-listening ielts-skill-unlocked"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE B <span>·</span> LISTENING</span><h3>School Tour</h3><p>Pengantar sekolah dan tur lokasi, CD1 Track 6–7.</p><div className="ielts-skill-tags"><span>10 pertanyaan</span><span>audio ready</span></div></div><button className="ielts-card-arrow" onClick={() => openListening("B")} aria-label="Buka Listening Module B"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">🧩</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE B <span>·</span> GRAMMAR</span><h3>Language Review B</h3><p>Vocabulary kota, resources, dan development.</p><div className="ielts-skill-tags"><span>{grammarPractices[1].questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openGrammar("B")} aria-label="Buka Grammar Module B"><Icon name="arrow" size={20}/></button></article></>}{selectedModule === "C" && <><article className="ielts-skill ielts-skill-listening ielts-skill-unlocked"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE C <span>·</span> LISTENING</span><h3>Flatshare Details</h3><p>Latihan detail, spelling, dan percakapan memilih flatmate. CD1 Track 11–12.</p><div className="ielts-skill-tags"><span>10 pertanyaan</span><span>audio ready</span></div></div><button className="ielts-card-arrow" onClick={() => openListening("C")} aria-label="Buka Listening Module C"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">📖</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE C <span>·</span> READING</span><h3>Time & Culture</h3><p>Latihan ringkas tentang persepsi waktu dan budaya.</p><div className="ielts-skill-tags"><span>{moduleCReadingPage34.questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openReadingB("C")} aria-label="Buka Reading Module C"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">🧩</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE C <span>·</span> GRAMMAR</span><h3>Language Review C</h3><p>Vocabulary work, pressure, dan attitudes.</p><div className="ielts-skill-tags"><span>{grammarPractices[2].questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openGrammar("C")} aria-label="Buka Grammar Module C"><Icon name="arrow" size={20}/></button></article></>}{selectedModule === "D" && <><article className="ielts-skill ielts-skill-listening ielts-skill-unlocked"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE D <span>·</span> LISTENING 1</span><h3>Music Course</h3><p>Diskusi persyaratan course, CD1 Track 14.</p><div className="ielts-skill-tags"><span>10 pertanyaan</span><span>audio ready</span></div></div><button className="ielts-card-arrow" onClick={() => openListening("D1")} aria-label="Buka Listening 1 Module D"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-listening ielts-skill-unlocked"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE D <span>·</span> LISTENING 2</span><h3>Art in Bali</h3><p>Lecture art and culture in Bali, CD1 Track 16.</p><div className="ielts-skill-tags"><span>10 pertanyaan</span><span>audio ready</span></div></div><button className="ielts-card-arrow" onClick={() => openListening("D2")} aria-label="Buka Listening 2 Module D"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">📖</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE D <span>·</span> READING</span><h3>Museums</h3><p>Latihan ringkas tentang exhibits, fragments, dan research findings.</p><div className="ielts-skill-tags"><span>{moduleDReadingPage49.questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openReadingB("D")} aria-label="Buka Reading Module D"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">🧩</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE D <span>·</span> GRAMMAR</span><h3>Language Review D</h3><p>Vocabulary visual arts dan performance.</p><div className="ielts-skill-tags"><span>{grammarPractices[3].questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openGrammar("D")} aria-label="Buka Grammar Module D"><Icon name="arrow" size={20}/></button></article></>}{selectedModule === "E" && <><article className="ielts-skill ielts-skill-listening ielts-skill-unlocked"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE E <span>·</span> LISTENING</span><h3>Rotorua Tour</h3><p>Tour guide in New Zealand, CD1 Track 17.</p><div className="ielts-skill-tags"><span>10 pertanyaan</span><span>audio ready</span></div></div><button className="ielts-card-arrow" onClick={() => openListening("E")} aria-label="Buka Listening Module E"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">📖</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE E <span>·</span> READING</span><h3>Titanic</h3><p>Latihan ringkas tentang Titanic dan deep-sea research.</p><div className="ielts-skill-tags"><span>{moduleEReadingPage65.questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openReadingB("E")} aria-label="Buka Reading Module E"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">🧩</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE E <span>·</span> GRAMMAR</span><h3>Language Review E</h3><p>Vocabulary water, waste, dan environment.</p><div className="ielts-skill-tags"><span>{grammarPractices[4].questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openGrammar("E")} aria-label="Buka Grammar Module E"><Icon name="arrow" size={20}/></button></article></>}{selectedModule === "F" && <><article className="ielts-skill ielts-skill-listening ielts-skill-unlocked"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE F <span>·</span> LISTENING</span><h3>Computer Facilities</h3><p>Tutorial research project, CD1 Track 21.</p><div className="ielts-skill-tags"><span>10 pertanyaan</span><span>audio ready</span></div></div><button className="ielts-card-arrow" onClick={() => openListening("F")} aria-label="Buka Listening Module F"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">📖</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE F <span>·</span> READING</span><h3>Knowledge Workers</h3><p>Latihan ringkas tentang education dan knowledge work.</p><div className="ielts-skill-tags"><span>{moduleFReadingPage72.questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openReadingB("F")} aria-label="Buka Reading Module F"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">🧩</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE F <span>·</span> GRAMMAR</span><h3>Language Review F</h3><p>Vocabulary university dan systems.</p><div className="ielts-skill-tags"><span>{grammarPractices[5].questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openGrammar("F")} aria-label="Buka Grammar Module F"><Icon name="arrow" size={20}/></button></article></>}{selectedModule === "G" && <><article className="ielts-skill ielts-skill-listening ielts-skill-unlocked"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE G <span>·</span> LISTENING 1</span><h3>TV Repair Call</h3><p>Electrical repair service, CD2 Track 2–3.</p><div className="ielts-skill-tags"><span>10 pertanyaan</span><span>audio ready</span></div></div><button className="ielts-card-arrow" onClick={() => openListening("G1")} aria-label="Buka Listening 1 Module G"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-listening ielts-skill-unlocked"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE G <span>·</span> LISTENING 2</span><h3>Radio Programmes</h3><p>Radio schedule and animal communication, CD2 Track 4–5.</p><div className="ielts-skill-tags"><span>10 pertanyaan</span><span>audio ready</span></div></div><button className="ielts-card-arrow" onClick={() => openListening("G2")} aria-label="Buka Listening 2 Module G"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">📖</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE G <span>·</span> READING</span><h3>Communication Technology</h3><p>Latihan ringkas tentang ICT, digital divide, dan access.</p><div className="ielts-skill-tags"><span>{moduleGReadingPage88.questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openReadingB("G")} aria-label="Buka Reading Module G"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">🧩</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE G <span>·</span> GRAMMAR</span><h3>Language Review G</h3><p>Vocabulary ICT dan media.</p><div className="ielts-skill-tags"><span>{grammarPractices[6].questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openGrammar("G")} aria-label="Buka Grammar Module G"><Icon name="arrow" size={20}/></button></article></>}{selectedModule === "H" && <><article className="ielts-skill ielts-skill-listening ielts-skill-unlocked"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE H <span>·</span> LISTENING</span><h3>Captive Breeding Essay</h3><p>Tutorial essay planning, CD2 Track 9–10.</p><div className="ielts-skill-tags"><span>10 pertanyaan</span><span>audio ready</span></div></div><button className="ielts-card-arrow" onClick={() => openListening("H")} aria-label="Buka Listening Module H"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">📖</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE H <span>·</span> READING</span><h3>GM Crops Debate</h3><p>Latihan ringkas tentang GM crops, research, dan ecology.</p><div className="ielts-skill-tags"><span>{moduleHReadingPage103.questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openReadingB("H")} aria-label="Buka Reading Module H"><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">🧩</div><div className="ielts-skill-body"><span className="ielts-skill-meta">MODULE H <span>·</span> GRAMMAR</span><h3>Language Review H</h3><p>Vocabulary GM crops dan conservation.</p><div className="ielts-skill-tags"><span>{grammarPractices[7].questions.length} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => openGrammar("H")} aria-label="Buka Grammar Module H"><Icon name="arrow" size={20}/></button></article></>}</div><aside className="ielts-overview-side"><div className="ielts-tip-card"><span aria-hidden="true">🧫</span><div><strong>Module creature</strong><p>Karakter kecil ini jadi penanda visual tiap module. Module berikutnya akan dibuka setelah konten selesai dicek.</p></div></div></aside></div>
      </>}

      {screen === "listening" && <>
        <div className="ielts-quest-nav"><button className="ielts-back" onClick={() => setScreen("overview")}><Icon name="back" size={18}/> Kembali ke perjalanan</button><div className="ielts-quest-counters"><span aria-label="Audio terverifikasi"><Icon name="check" size={17}/> Audio siap</span><span aria-label={`${listeningCorrect} jawaban benar`}><Icon name="spark" size={17}/> {listeningSubmitted ? `${listeningCorrect}/${activeListeningTotal}` : "Latihan"}</span></div></div>
        <header className="ielts-quest-header"><div><span className="ielts-kicker">LISTENING STUDIO / MODULE {listeningPractice.module} PAGE {listeningPractice.bookPage}</span><h1 ref={headingRef} tabIndex={-1}>{listeningPractice.title}</h1><p>{selectedListening === "A" ? moduleAListeningPractice.learningGoal : "Tangkap detail utama dari audio dan cocokkan dengan catatan soal."}</p></div><span className="ielts-verified"><Icon name="check" size={16}/> {listeningPractice.tracks.map((track) => track.label ?? track.id.toUpperCase()).join(" + ")}</span></header>
        <div className="ielts-listening-grid"><section className="ielts-audio-card" aria-labelledby="ielts-audio-title"><span className="ielts-kicker">AUDIO PLAYER</span><h2 id="ielts-audio-title">Dengarkan, jeda, ulangi.</h2><p>{listeningPractice.instructions}</p>{listeningPractice.tracks.map((track) => <div key={track.id} className="ielts-audio-player"><strong>{track.label ?? track.id.toUpperCase()}</strong><small>{track.role}</small><audio controls preload="metadata" src={track.path} aria-label={`${track.label ?? track.id} · ${track.role}`}>Browser kamu tidak mendukung pemutar audio.</audio></div>)}<div className="ielts-evidence-note"><Icon name="spark" size={17}/><span>Tip: baca catatan dulu, lalu dengarkan detail seperti pekerjaan, hari, jam, alamat, dan dokumen.</span></div></section>
        <section className="ielts-question-card" aria-labelledby="ielts-listening-title"><div className="ielts-question-top"><span className="ielts-question-count">SOAL 01 <span>/ {String(activeListeningTotal).padStart(2,"0")}</span></span><span className="ielts-question-topic">NOTE COMPLETION</span></div><span className="ielts-kicker">MODULE {listeningPractice.module} LISTENING</span><h2 id="ielts-listening-title">Complete the notes below.</h2><p className="ielts-question-hint">Write no more than three words and/or a number. Untuk beberapa matching questions, gunakan huruf pilihan dari soal sumber.</p><div className="ielts-listening-form">{listeningPractice.questions.map((item, questionIndex) => { const correct = isListeningAnswerCorrect(questionIndex); return <label key={item.id} className={`ielts-listening-item ${listeningSubmitted ? correct ? "ielts-listening-right" : "ielts-listening-wrong" : ""}`}><span><strong>{item.number}.</strong> {item.prompt}</span><input value={listeningAnswers[questionIndex] ?? ""} onChange={(event) => { const next = [...listeningAnswers]; next[questionIndex] = event.target.value; setListeningAnswers(next); setListeningSubmitted(false); }} placeholder="Jawabanmu" aria-label={`Jawaban nomor ${item.number}`}/>{item.tip && <small>{item.tip}</small>}{listeningSubmitted && <em>{correct ? "Benar" : `Cek lagi · jawaban: ${item.answer}`}</em>}</label>; })}</div>{listeningSubmitted && <div className={`ielts-feedback ${listeningCorrect === activeListeningTotal ? "ielts-feedback-good" : "ielts-feedback-try"}`} role="status"><div className="ielts-feedback-mark" aria-hidden="true">{listeningCorrect === activeListeningTotal ? "✦" : "↗"}</div><div><strong>{listeningCorrect} dari {activeListeningTotal} benar.</strong><p>{listeningCorrect === activeListeningTotal ? "Mantap—semua detail tertangkap." : "Putar ulang audio dan perbaiki jawaban yang belum tepat."}</p></div></div>}<div className="ielts-question-actions"><span>Jawaban tidak disimpan permanen; Reading Quest tetap terpisah.</span><button className="ielts-button ielts-button-primary" onClick={() => setListeningSubmitted(true)}>Periksa jawaban <Icon name="arrow" size={19}/></button></div></section></div>
        <div className="ielts-source-note"><Icon name="book" size={18}/><div><strong>Catatan sumber & verifikasi</strong><p>{listeningPractice.sourceNote} Audio: {listeningPractice.tracks.map((track) => track.label).join(" + ")}. Pilot belajar independen dan bukan endorsement penerbit.</p></div></div>
      </>}

      {screen === "readingB" && <>
        <div className="ielts-quest-nav"><button className="ielts-back" onClick={() => setScreen("overview")}><Icon name="back" size={18}/> Kembali ke perjalanan</button><div className="ielts-quest-counters"><span aria-label={`Module ${activeReading.module}`}><Icon name="book" size={17}/> Module {activeReading.module}</span><span aria-label={`${readingBCorrect} jawaban benar`}><Icon name="spark" size={17}/> {readingBSubmitted ? `${readingBCorrect}/${activeReading.questions.length}` : "Reading"}</span></div></div>
        <header className="ielts-quest-header"><div><span className="ielts-kicker">READING LAB / MODULE {activeReading.module} PAGE {activeReading.bookPage}</span><h1 ref={headingRef} tabIndex={-1}>{activeReading.title}</h1><p>{activeReading.instructions}</p></div><span className="ielts-verified"><Icon name="check" size={16}/> Kunci dicek</span></header>
        <div className="ielts-listening-grid"><aside className="ielts-evidence" aria-labelledby="module-b-evidence"><div className="ielts-evidence-top"><div className="ielts-evidence-symbol" aria-hidden="true">☀</div><span className="ielts-kicker">THE EVIDENCE FILE</span><h2 id="module-b-evidence">Ringkasan bukti.</h2><p>Gunakan catatan ini untuk latihan awal. Bacaan penuh tetap dirujuk ke halaman sumber.</p></div><div className="ielts-evidence-list">{activeReading.evidenceSummary.map((summary, summaryIndex) => <section key={summaryIndex}><span>CLUE {summaryIndex + 1}</span><p lang="en">{summary}</p></section>)}</div></aside><section className="ielts-question-card" aria-labelledby="module-b-reading-title"><div className="ielts-question-top"><span className="ielts-question-count">SOAL 01 <span>/ {String(activeReading.questions.length).padStart(2,"0")}</span></span><span className="ielts-question-topic">SHORT ANSWER</span></div><span className="ielts-kicker">MODULE {activeReading.module} READING</span><h2 id="module-b-reading-title">Answer with a short word or phrase.</h2><div className="ielts-listening-form">{activeReading.questions.map((item, questionIndex) => { const correct = isReadingBAnswerCorrect(questionIndex); return <label key={item.id} className={`ielts-listening-item ${readingBSubmitted ? correct ? "ielts-listening-right" : "ielts-listening-wrong" : ""}`}><span><strong>{item.number}.</strong> {item.prompt}</span><input value={readingBAnswers[questionIndex] ?? ""} onChange={(event) => { const next = [...readingBAnswers]; next[questionIndex] = event.target.value; setReadingBAnswers(next); setReadingBSubmitted(false); }} placeholder="Jawaban singkat" aria-label={`Jawaban reading module B nomor ${item.number}`}/>{readingBSubmitted && <em>{correct ? "Benar" : `Cek lagi · jawaban: ${item.answer}`}</em>}</label>; })}</div>{readingBSubmitted && <div className={`ielts-feedback ${readingBCorrect === activeReading.questions.length ? "ielts-feedback-good" : "ielts-feedback-try"}`} role="status"><div className="ielts-feedback-mark" aria-hidden="true">{readingBCorrect === activeReading.questions.length ? "✦" : "↗"}</div><div><strong>{readingBCorrect} dari {activeReading.questions.length} benar.</strong><p>{readingBCorrect === activeReading.questions.length ? "Kamu menangkap detail utama module ini." : "Cek ringkasan bukti dan spelling jawaban."}</p></div></div>}<div className="ielts-question-actions"><span>Ini pilot ringkas sebelum bacaan penuh dimodelkan.</span><button className="ielts-button ielts-button-primary" onClick={() => setReadingBSubmitted(true)}>Periksa jawaban <Icon name="arrow" size={19}/></button></div></section></div>
        <div className="ielts-source-note"><Icon name="book" size={18}/><div><strong>Catatan sumber & verifikasi</strong><p>{activeReading.title}, halaman buku {moduleBReadingPage20.bookPage}, kunci halaman {moduleBReadingPage20.answerKeyPage}. Materi diringkas dan diformat ulang untuk latihan mandiri.</p></div></div>
      </>}

      {screen === "grammar" && <>
        <div className="ielts-quest-nav"><button className="ielts-back" onClick={() => setScreen("overview")}><Icon name="back" size={18}/> Kembali ke perjalanan</button><div className="ielts-quest-counters"><span aria-label={`Module ${activeGrammar.module}`}><Icon name="book" size={17}/> Module {activeGrammar.module}</span><span aria-label={`${grammarCorrect} jawaban benar`}><Icon name="spark" size={17}/> {grammarSubmitted ? `${grammarCorrect}/${activeGrammar.questions.length}` : "Grammar"}</span></div></div>
        <header className="ielts-quest-header"><div><span className="ielts-kicker">LANGUAGE REVIEW / MODULE {activeGrammar.module} PAGE {activeGrammar.bookPage}</span><h1 ref={headingRef} tabIndex={-1}>{activeGrammar.title}</h1><p>{activeGrammar.instructions}</p></div><span className="ielts-verified"><Icon name="check" size={16}/> Kunci dicek</span></header>
        <section className="ielts-question-card ielts-grammar-card" aria-labelledby="ielts-grammar-title"><div className="ielts-question-top"><span className="ielts-question-count">SOAL 01 <span>/ {String(activeGrammar.questions.length).padStart(2,"0")}</span></span><span className="ielts-question-topic">LANGUAGE REVIEW</span></div><span className="ielts-kicker">ACADEMIC VOCABULARY</span><h2 id="ielts-grammar-title">Complete each vocabulary clue.</h2><div className="ielts-listening-form">{activeGrammar.questions.map((item, questionIndex) => { const correct = isGrammarAnswerCorrect(questionIndex); return <label key={item.id} className={`ielts-listening-item ${grammarSubmitted ? correct ? "ielts-listening-right" : "ielts-listening-wrong" : ""}`}><span><strong>{item.number}.</strong> {item.prompt}</span><input value={grammarAnswers[questionIndex] ?? ""} onChange={(event) => { const next = [...grammarAnswers]; next[questionIndex] = event.target.value; setGrammarAnswers(next); setGrammarSubmitted(false); }} placeholder="Kata/frasa" aria-label={`Jawaban grammar nomor ${item.number}`}/>{grammarSubmitted && <em>{correct ? "Benar" : `Cek lagi · jawaban: ${item.answer}`}</em>}</label>; })}</div>{grammarSubmitted && <div className={`ielts-feedback ${grammarCorrect === activeGrammar.questions.length ? "ielts-feedback-good" : "ielts-feedback-try"}`} role="status"><div className="ielts-feedback-mark" aria-hidden="true">{grammarCorrect === activeGrammar.questions.length ? "✦" : "↗"}</div><div><strong>{grammarCorrect} dari {activeGrammar.questions.length} benar.</strong><p>{grammarCorrect === activeGrammar.questions.length ? "Vocabulary module ini sudah aman." : "Perhatikan spelling dan collocation."}</p></div></div>}<div className="ielts-question-actions"><span>Latihan ini diringkas dari Language Review agar aman untuk pilot belajar.</span><button className="ielts-button ielts-button-primary" onClick={() => setGrammarSubmitted(true)}>Periksa jawaban <Icon name="arrow" size={19}/></button></div></section>
        <div className="ielts-source-note"><Icon name="book" size={18}/><div><strong>Catatan sumber & verifikasi</strong><p>{activeGrammar.title}, halaman buku {activeGrammar.bookPage}, kunci halaman {activeGrammar.answerKeyPage}. Materi diringkas dan diformat ulang untuk latihan mandiri.</p></div></div>
      </>}

      {screen === "quest" && <>
        <div className="ielts-quest-nav"><button className="ielts-back" onClick={() => setScreen("overview")}><Icon name="back" size={18}/> Kembali ke perjalanan</button><div className="ielts-quest-counters"><span aria-label={`${hearts} hati tersisa`}><Icon name="heart" size={17}/> {hearts}</span><span aria-label={`${xp} XP latihan`}><Icon name="spark" size={17}/> {xp} XP</span></div></div>
        <header className="ielts-quest-header"><div><span className="ielts-kicker">READING LAB / QUEST 01</span><h1 lang="en">{ieltsPilot.title}</h1><p>{ieltsPilot.learningGoal}</p></div><span className="ielts-verified"><Icon name="check" size={16}/> Kunci dicek</span></header>
        <div className="ielts-quest-progress"><div className="ielts-progress-label"><span>PROGRES QUEST</span><strong>{responses.length} / {total} terjawab</strong></div><div className="ielts-meter" role="progressbar" aria-label="Pertanyaan yang sudah dijawab" aria-valuenow={responses.length} aria-valuemin={0} aria-valuemax={total}><span style={{width:`${percent}%`}}/></div></div>
        <div className="ielts-quest-grid"><aside className="ielts-evidence" aria-labelledby="ielts-evidence-title"><div className="ielts-evidence-top"><div className="ielts-evidence-symbol" aria-hidden="true">▤</div><span className="ielts-kicker">THE EVIDENCE FILE</span><h2 id="ielts-evidence-title">Cari petunjuknya.</h2><p>Ringkasan bukti dari materi bacaan. Bandingkan setiap pernyataan dengan informasi yang tersedia.</p></div><div className="ielts-evidence-list">{ieltsPilot.evidenceSummary.map((evidence) => <section key={evidence.paragraph} className={evidence.paragraph === question.sourceParagraph ? "ielts-evidence-active" : ""} aria-label={`Ringkasan paragraf ${evidence.paragraph}`}><span>PARAGRAF {evidence.paragraph}</span><p lang="en">{evidence.summary}</p></section>)}</div><div className="ielts-evidence-note"><Icon name="spark" size={17}/><span>Catatan ini disingkat. Sebagian detail baru dijelaskan setelah kamu menjawab.</span></div></aside>
        <section className="ielts-question-card" aria-labelledby="ielts-question-title"><div className="ielts-question-top"><span className="ielts-question-count">SOAL {String(index + 1).padStart(2,"0")} <span>/ {String(total).padStart(2,"0")}</span></span><span className="ielts-question-topic">PARAGRAF {question.sourceParagraph}</span></div><span className="ielts-kicker">BACA PERNYATAAN BERIKUT</span><h2 id="ielts-question-title" ref={headingRef} tabIndex={-1} lang="en">{question.statement}</h2><p className="ielts-question-hint">{ieltsPilot.instructions}</p><fieldset className="ielts-choices" disabled={submitted}><legend>Pilih satu jawaban</legend>{choices.map((option, optionIndex) => <label key={option.value} className={`ielts-choice ${choice === option.value ? "ielts-choice-selected" : ""} ${submitted && option.value === question.answer ? "ielts-choice-correct" : ""} ${submitted && choice === option.value && !isCorrect ? "ielts-choice-wrong" : ""}`}><input type="radio" name={`ielts-answer-${index}`} value={option.value} checked={choice === option.value} onChange={() => setChoice(option.value)}/><span className="ielts-choice-letter" aria-hidden="true">{String.fromCharCode(65 + optionIndex)}</span><span className="ielts-choice-copy"><strong lang="en">{option.label}</strong><small>{option.help}</small></span><span className="ielts-choice-indicator" aria-hidden="true">{submitted && option.value === question.answer ? <Icon name="check" size={19}/> : submitted && choice === option.value ? <Icon name="close" size={19}/> : ""}</span></label>)}</fieldset>
          {submitted && <div ref={feedbackRef} tabIndex={-1} role="status" aria-live="polite" className={`ielts-feedback ${isCorrect ? "ielts-feedback-good" : "ielts-feedback-try"}`}><div className="ielts-feedback-mark" aria-hidden="true">{isCorrect ? "✦" : "↗"}</div><div><strong>{isCorrect ? "Tepat sekali! +15 XP" : `Belum tepat. Jawabannya: ${question.answer}.`}</strong><p>{question.rationale}</p><small>ALASAN · PARAGRAF {question.sourceParagraph}</small></div></div>}
          <div className="ielts-question-actions"><span>{submitted ? "Lihat alasannya, lalu lanjutkan." : "Tidak perlu terburu-buru. Baca buktinya dulu."}</span><button className="ielts-button ielts-button-primary" disabled={!choice} onClick={submitted ? continueQuest : submit}>{submitted ? index === total - 1 ? "Lihat hasil" : "Lanjut" : "Periksa jawaban"}<Icon name="arrow" size={19}/></button></div></section></div>
        <div className="ielts-source-note"><Icon name="book" size={18}/><div><strong>Catatan sumber & verifikasi</strong><p>{ieltsPilot.source.work}, modul {ieltsPilot.source.module}, halaman PDF {ieltsPilot.source.sourcePages.join(" dan ")}. Kunci jawaban latihan telah diperiksa terhadap halaman PDF sumber; halaman cetak mungkin berbeda. Tidak ada audio terverifikasi untuk latihan ini. Materi pilot independen dan bukan endorsement penerbit.</p></div></div>
      </>}

      {screen === "complete" && <><section className="ielts-finish" aria-labelledby="ielts-finish-title"><div className="ielts-finish-orbit" aria-hidden="true">✦</div><span className="ielts-kicker">READING QUEST COMPLETE</span><h1 id="ielts-finish-title" ref={headingRef} tabIndex={-1}>Satu langkah lagi,<br/><em>you did it!</em></h1><p>Kamu sudah selesai menelusuri bukti. Setiap jawaban—benar atau salah—membuatmu semakin jeli.</p><div className="ielts-finish-stats"><div><span>HASIL LATIHAN</span><strong>{correctCount}<small> / {total}</small></strong><small>jawaban benar</small></div><div><span>HADIAH LATIHAN</span><strong>+{responses.filter((response) => response.correct).length * 15}</strong><small>XP · bukan band score</small></div><div><span>SISA HATI</span><strong>{hearts}<small> / 5</small></strong><small>tetap semangat!</small></div></div><div className="ielts-finish-actions"><button className="ielts-button ielts-button-light" onClick={() => setScreen("overview")}>Ke perjalanan <Icon name="arrow" size={18}/></button><button className="ielts-button ielts-button-ghost" onClick={() => start(true)}><Icon name="refresh" size={18}/> Coba lagi</button></div></section><section className="ielts-review" aria-labelledby="ielts-review-title"><div><span className="ielts-kicker">REVIEW / {total} SOAL</span><h2 id="ielts-review-title">Lihat kembali petunjuknya.</h2><p>Ketuk satu soal untuk membaca alasan dan jawaban yang benar.</p></div><div className="ielts-review-list">{ieltsPilot.questions.map((item, itemIndex) => { const response = responses[itemIndex]; return <details key={item.id}><summary><span className={`ielts-review-status ${response?.correct ? "ielts-review-right" : "ielts-review-incorrect"}`}>{response?.correct ? <Icon name="check" size={17}/> : <Icon name="close" size={17}/>}</span><span><small>SOAL {String(itemIndex + 1).padStart(2,"0")} · PARAGRAF {item.sourceParagraph}</small><strong lang="en">{item.statement}</strong></span><Icon name="chevron" size={18}/></summary><div className="ielts-review-detail"><p>Jawabanmu: <strong lang="en">{response?.choice}</strong> · Jawaban benar: <strong lang="en">{item.answer}</strong></p><p>{item.rationale}</p></div></details>; })}</div></section><div className="ielts-disclaimer">Pilot belajar independen. Hasil ini bukan prediksi band score IELTS.</div></>}
    </main>
  );
}

export default IeltsJourney;
