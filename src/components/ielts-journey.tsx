"use client";

import { useEffect, useRef, useState } from "react";
import { ieltsPilot, type TrueFalseNotGiven } from "@/data/ielts-pilot";
import { Icon } from "@/components/ui-icons";

type Screen = "overview" | "quest" | "complete";
type Response = { questionId: string; choice: TrueFalseNotGiven; correct: boolean };
const choices: { value: TrueFalseNotGiven; label: string; help: string }[] = [
  { value: "TRUE", label: "True", help: "Sesuai dengan teks" },
  { value: "FALSE", label: "False", help: "Bertentangan dengan teks" },
  { value: "NOT GIVEN", label: "Not Given", help: "Tidak disebutkan dalam teks" },
];
const total = ieltsPilot.questions.length;

/** A self-contained visual pilot. Session state is local; persistence belongs to the app integration. */
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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const question = ieltsPilot.questions[index];
  const isCorrect = choice === question.answer;
  const correctCount = responses.filter((response) => response.correct).length;
  const percent = Math.round((responses.length / total) * 100);

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

  return (
    <div className="ielts-journey" lang="id">
      <div className="ielts-page-head">
        <div className="ielts-identity"><span className="ielts-identity-mark" aria-hidden="true">✳</span><span>TYCON <span className="ielts-identity-slash">/</span> IELTS JOURNEY</span></div>
        <div className="ielts-lang-pill"><span aria-hidden="true">🇮🇩</span> Indonesia <span aria-hidden="true">→</span> <span aria-hidden="true">🇬🇧</span> English</div>
      </div>

      {screen === "overview" && <>
        <section className="ielts-hero" aria-labelledby="ielts-title">
          <div className="ielts-hero-copy"><span className="ielts-eyebrow"><span aria-hidden="true">✦</span> LANGKAH KECIL, TUJUAN BESAR</span><h1 id="ielts-title">Your journey<br/>starts <em>here.</em></h1><p>Latihan IELTS yang terasa lebih ringan. Baca dengan teliti, temukan bukti, dan bangun percaya diri—satu pertanyaan setiap kali.</p><button className="ielts-button ielts-button-light" onClick={() => start()}>{!attemptFinished && (responses.length > 0 || choice !== null) ? "Lanjutkan Reading Quest" : "Mulai Reading Quest"} <Icon name="arrow" size={19}/></button><span className="ielts-hero-foot">ACADEMIC READING <span aria-hidden="true">✳</span> PILOT EDITION</span></div>
          <div className="ielts-hero-art" aria-hidden="true"><div className="ielts-orbit ielts-orbit-one"/><div className="ielts-orbit ielts-orbit-two"/><div className="ielts-paper"><span className="ielts-paper-dot">✦</span><span className="ielts-paper-line long"/><span className="ielts-paper-line"/><span className="ielts-paper-line short"/><span className="ielts-paper-answer">T <span>F</span> NG</span></div><span className="ielts-hero-spark spark-a">✳</span><span className="ielts-hero-spark spark-b">✦</span><span className="ielts-hero-spark spark-c">✧</span><div className="ielts-art-sticker"><span>↗</span><strong>Find your way</strong><small>one clue at a time</small></div></div>
        </section>
        <div className="ielts-section-title"><div><span className="ielts-kicker">PETA PERJALANAN</span><h2>Choose your checkpoint<span aria-hidden="true"> ✳</span></h2><p>Dua skill, satu langkah awal yang bisa kamu mulai sekarang.</p></div><span className="ielts-small-badge">01 / 02 TERSEDIA</span></div>
        <div className="ielts-overview-grid"><div className="ielts-skills"><article className="ielts-skill ielts-skill-reading"><div className="ielts-skill-icon" aria-hidden="true">📖</div><div className="ielts-skill-body"><span className="ielts-skill-meta">CHECKPOINT 01 <span>·</span> TERSEDIA</span><h3>Reading Lab</h3><p>Pelajari cara membedakan fakta, bantahan, dan informasi yang tidak ada dalam teks.</p><div className="ielts-skill-tags"><span>True / False / Not Given</span><span>{total} pertanyaan</span></div></div><button className="ielts-card-arrow" onClick={() => start()} aria-label={!attemptFinished && (responses.length > 0 || choice !== null) ? "Lanjutkan Reading Lab" : "Mulai Reading Lab"}><Icon name="arrow" size={20}/></button></article><article className="ielts-skill ielts-skill-listening"><div className="ielts-skill-icon" aria-hidden="true">🎧</div><div className="ielts-skill-body"><span className="ielts-skill-meta">CHECKPOINT 02 <span>·</span> SEGERA HADIR</span><h3>Listening Studio</h3><p>Ruang untuk melatih telinga dan menangkap ide utama. Audio berizin belum tersedia.</p><div className="ielts-skill-tags"><span>Belum tersedia</span></div></div><span className="ielts-locked" aria-label="Terkunci"><Icon name="lock" size={19}/></span></article></div>
          <aside className="ielts-overview-side"><div className="ielts-progress-card"><div className="ielts-progress-head"><span className="ielts-progress-icon" aria-hidden="true">✳</span><span>YOUR LITTLE WINS</span></div><h3>Keep growing,<br/><em>keep going.</em></h3><div className="ielts-stat-row"><span>🏅 <strong>{best === null ? "—" : `${best}/${total}`}</strong><small>skor terbaik</small></span><span>✨ <strong>{xp}</strong><small>XP latihan</small></span></div><div className="ielts-meter" role="progressbar" aria-label="Progres Reading Quest" aria-valuenow={best ?? 0} aria-valuemin={0} aria-valuemax={total}><span style={{ width: `${best === null ? 0 : (best / total) * 100}%` }}/></div><p>{!attemptFinished && (responses.length > 0 || choice !== null) ? `${responses.length} dari ${total} soal terjawab dalam quest aktif.` : best === null ? "Petualangan pertamamu menunggu." : `${best} dari ${total} jawaban benar pada percobaan terbaikmu.`}</p></div><div className="ielts-tip-card"><span aria-hidden="true">💡</span><div><strong>Trik kecil untuk mulai</strong><p>“Not Given” bukan berarti salah. Artinya teks tidak memberi cukup informasi.</p></div></div></aside></div>
        <div className="ielts-disclaimer">Pilot belajar independen. Bukan tes resmi, tidak berafiliasi dengan IELTS maupun penerbit sumber. XP adalah hadiah latihan, bukan prediksi band score.</div>
      </>}

      {screen === "quest" && <>
        <div className="ielts-quest-nav"><button className="ielts-back" onClick={() => setScreen("overview")}><Icon name="back" size={18}/> Kembali ke perjalanan</button><div className="ielts-quest-counters"><span aria-label={`${hearts} hati tersisa`}><Icon name="heart" size={17}/> {hearts}</span><span aria-label={`${xp} XP latihan`}><Icon name="spark" size={17}/> {xp} XP</span></div></div>
        <header className="ielts-quest-header"><div><span className="ielts-kicker">READING LAB / QUEST 01</span><h1>{ieltsPilot.title}</h1><p>{ieltsPilot.learningGoal}</p></div><span className="ielts-verified"><Icon name="check" size={16}/> Kunci dicek</span></header>
        <div className="ielts-quest-progress"><div className="ielts-progress-label"><span>PROGRES QUEST</span><strong>{responses.length} / {total} terjawab</strong></div><div className="ielts-meter" role="progressbar" aria-label="Pertanyaan yang sudah dijawab" aria-valuenow={responses.length} aria-valuemin={0} aria-valuemax={total}><span style={{width:`${percent}%`}}/></div></div>
        <div className="ielts-quest-grid"><aside className="ielts-evidence" aria-labelledby="ielts-evidence-title"><div className="ielts-evidence-top"><div className="ielts-evidence-symbol" aria-hidden="true">▤</div><span className="ielts-kicker">THE EVIDENCE FILE</span><h2 id="ielts-evidence-title">Cari petunjuknya.</h2><p>Ringkasan bukti dari materi bacaan. Bandingkan setiap pernyataan dengan informasi yang tersedia.</p></div><div className="ielts-evidence-list">{ieltsPilot.evidenceSummary.map((evidence) => <section key={evidence.paragraph} className={evidence.paragraph === question.sourceParagraph ? "ielts-evidence-active" : ""} aria-label={`Ringkasan paragraf ${evidence.paragraph}`}><span>PARAGRAF {evidence.paragraph}</span><p lang="en">{evidence.summary}</p></section>)}</div><div className="ielts-evidence-note"><Icon name="spark" size={17}/><span>Catatan ini disingkat. Sebagian detail baru dijelaskan setelah kamu menjawab.</span></div></aside>
        <section className="ielts-question-card" aria-labelledby="ielts-question-title"><div className="ielts-question-top"><span className="ielts-question-count">SOAL {String(index + 1).padStart(2,"0")} <span>/ {String(total).padStart(2,"0")}</span></span><span className="ielts-question-topic">PARAGRAF {question.sourceParagraph}</span></div><span className="ielts-kicker">BACA PERNYATAAN BERIKUT</span><h2 id="ielts-question-title" ref={headingRef} tabIndex={-1} lang="en">{question.statement}</h2><p className="ielts-question-hint" lang="en">{ieltsPilot.instructions}</p><fieldset className="ielts-choices" disabled={submitted}><legend>Pilih satu jawaban</legend>{choices.map((option, optionIndex) => <label key={option.value} className={`ielts-choice ${choice === option.value ? "ielts-choice-selected" : ""} ${submitted && option.value === question.answer ? "ielts-choice-correct" : ""} ${submitted && choice === option.value && !isCorrect ? "ielts-choice-wrong" : ""}`}><input type="radio" name={`ielts-answer-${index}`} value={option.value} checked={choice === option.value} onChange={() => setChoice(option.value)}/><span className="ielts-choice-letter" aria-hidden="true">{String.fromCharCode(65 + optionIndex)}</span><span className="ielts-choice-copy"><strong lang="en">{option.label}</strong><small>{option.help}</small></span><span className="ielts-choice-indicator" aria-hidden="true">{submitted && option.value === question.answer ? <Icon name="check" size={19}/> : submitted && choice === option.value ? <Icon name="close" size={19}/> : ""}</span></label>)}</fieldset>
          {submitted && <div ref={feedbackRef} tabIndex={-1} role="status" aria-live="polite" className={`ielts-feedback ${isCorrect ? "ielts-feedback-good" : "ielts-feedback-try"}`}><div className="ielts-feedback-mark" aria-hidden="true">{isCorrect ? "✦" : "↗"}</div><div><strong>{isCorrect ? "Tepat sekali! +15 XP" : `Belum tepat. Jawabannya: ${question.answer}.`}</strong><p lang="en">{question.rationale}</p><small>ALASAN · PARAGRAF {question.sourceParagraph}</small></div></div>}
          <div className="ielts-question-actions"><span>{submitted ? "Lihat alasannya, lalu lanjutkan." : "Tidak perlu terburu-buru. Baca buktinya dulu."}</span><button className="ielts-button ielts-button-primary" disabled={!choice} onClick={submitted ? continueQuest : submit}>{submitted ? index === total - 1 ? "Lihat hasil" : "Lanjut" : "Periksa jawaban"}<Icon name="arrow" size={19}/></button></div></section></div>
        <div className="ielts-source-note"><Icon name="book" size={18}/><div><strong>Catatan sumber & verifikasi</strong><p>{ieltsPilot.source.work}, modul {ieltsPilot.source.module}, halaman PDF {ieltsPilot.source.sourcePages.join(" dan ")}. Kunci jawaban latihan telah diperiksa terhadap halaman PDF sumber; halaman cetak mungkin berbeda. Tidak ada audio terverifikasi untuk latihan ini. Materi pilot independen dan bukan endorsement penerbit.</p></div></div>
      </>}

      {screen === "complete" && <><section className="ielts-finish" aria-labelledby="ielts-finish-title"><div className="ielts-finish-orbit" aria-hidden="true">✦</div><span className="ielts-kicker">READING QUEST COMPLETE</span><h1 id="ielts-finish-title" ref={headingRef} tabIndex={-1}>Satu langkah lagi,<br/><em>you did it!</em></h1><p>Kamu sudah selesai menelusuri bukti. Setiap jawaban—benar atau salah—membuatmu semakin jeli.</p><div className="ielts-finish-stats"><div><span>HASIL LATIHAN</span><strong>{correctCount}<small> / {total}</small></strong><small>jawaban benar</small></div><div><span>HADIAH LATIHAN</span><strong>+{responses.filter((response) => response.correct).length * 15}</strong><small>XP · bukan band score</small></div><div><span>SISA HATI</span><strong>{hearts}<small> / 5</small></strong><small>tetap semangat!</small></div></div><div className="ielts-finish-actions"><button className="ielts-button ielts-button-light" onClick={() => setScreen("overview")}>Ke perjalanan <Icon name="arrow" size={18}/></button><button className="ielts-button ielts-button-ghost" onClick={() => start(true)}><Icon name="refresh" size={18}/> Coba lagi</button></div></section><section className="ielts-review" aria-labelledby="ielts-review-title"><div><span className="ielts-kicker">REVIEW / {total} SOAL</span><h2 id="ielts-review-title">Lihat kembali petunjuknya.</h2><p>Ketuk satu soal untuk membaca alasan dan jawaban yang benar.</p></div><div className="ielts-review-list">{ieltsPilot.questions.map((item, itemIndex) => { const response = responses[itemIndex]; return <details key={item.id}><summary><span className={`ielts-review-status ${response?.correct ? "ielts-review-right" : "ielts-review-incorrect"}`}>{response?.correct ? <Icon name="check" size={17}/> : <Icon name="close" size={17}/>}</span><span><small>SOAL {String(itemIndex + 1).padStart(2,"0")} · PARAGRAF {item.sourceParagraph}</small><strong lang="en">{item.statement}</strong></span><Icon name="chevron" size={18}/></summary><div className="ielts-review-detail"><p>Jawabanmu: <strong lang="en">{response?.choice}</strong> · Jawaban benar: <strong lang="en">{item.answer}</strong></p><p lang="en">{item.rationale}</p></div></details>; })}</div></section><div className="ielts-disclaimer">Pilot belajar independen. Hasil ini bukan prediksi band score IELTS.</div></>}
    </div>
  );
}

export default IeltsJourney;
