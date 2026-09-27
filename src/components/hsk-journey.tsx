"use client";

import { useMemo, useState } from "react";
import { hsk1H10901, type HskQuestion } from "@/data/hsk/hsk-1-h10901";
import { Icon } from "@/components/ui-icons";

type SectionKey = "listening" | "reading";

const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

function isCorrect(question: HskQuestion, answer: string) {
  const normalized = normalize(answer);
  return Boolean(normalized) && question.acceptedAnswers.some((accepted) => normalize(accepted) === normalized);
}

export function HskJourney() {
  const [section, setSection] = useState<SectionKey>("listening");
  const questions = hsk1H10901.sections[section];
  const [answers, setAnswers] = useState<Record<SectionKey, string[]>>({
    listening: Array(hsk1H10901.sections.listening.length).fill(""),
    reading: Array(hsk1H10901.sections.reading.length).fill(""),
  });
  const [submitted, setSubmitted] = useState<Record<SectionKey, boolean>>({ listening: false, reading: false });
  const correctCount = useMemo(() => questions.filter((question, index) => isCorrect(question, answers[section][index] ?? "")).length, [answers, questions, section]);

  function updateAnswer(index: number, value: string) {
    setAnswers((current) => ({ ...current, [section]: current[section].map((item, itemIndex) => itemIndex === index ? value : item) }));
    setSubmitted((current) => ({ ...current, [section]: false }));
  }

  return (
    <main className="hsk-journey" lang="id">
      <section className="hsk-hero" aria-labelledby="hsk-title">
        <div className="hsk-hero-copy">
          <span className="section-kicker">MANDARIN / HSK JOURNEY</span>
          <h1 id="hsk-title">HSK 1 Starter<br/><em>{hsk1H10901.code}</em></h1>
          <p>Latihan Mandarin level awal dengan audio HSK 1. Jawab ringkas menggunakan √, ×, atau huruf pilihan A–F sesuai tipe soal.</p>
          <div className="hsk-hero-actions"><button className="primary-button" onClick={() => setSection("listening")}>Start listening <Icon name="arrow" size={18}/></button><button className="outline-button" onClick={() => setSection("reading")}>Open reading</button></div>
        </div>
        <div className="hsk-mascot" aria-hidden="true"><span>中</span><i/><b/><em/></div>
      </section>

      <section className="hsk-panel" aria-label="HSK section selector">
        <div className="hsk-tabs">
          <button className={section === "listening" ? "active" : ""} onClick={() => setSection("listening")}>🎧 Listening 1–20</button>
          <button className={section === "reading" ? "active" : ""} onClick={() => setSection("reading")}>📖 Reading 21–40</button>
        </div>
        <div className="hsk-audio-card">
          <div><span className="section-kicker">AUDIO PLAYER</span><h2>{hsk1H10901.audio.label}</h2><p>{hsk1H10901.audio.note}</p></div>
          <audio controls preload="metadata" src={hsk1H10901.audio.path}>Browser kamu tidak mendukung audio.</audio>
        </div>
      </section>

      <section className="hsk-question-card" aria-labelledby="hsk-section-title">
        <div className="hsk-question-head"><div><span className="section-kicker">{section.toUpperCase()} QUEST</span><h2 id="hsk-section-title">{section === "listening" ? "Listen and answer." : "Read and answer."}</h2></div><span className="hsk-score">{submitted[section] ? `${correctCount}/${questions.length}` : `${questions.length} questions`}</span></div>
        <div className="hsk-question-grid">
          {questions.map((question, index) => {
            const checked = submitted[section];
            const correct = isCorrect(question, answers[section][index] ?? "");
            return <label key={question.id} className={`hsk-question-item ${checked ? correct ? "right" : "wrong" : ""}`}><span><strong>{question.number}.</strong> {question.prompt}</span><small>{question.part}</small><input value={answers[section][index] ?? ""} onChange={(event) => updateAnswer(index, event.target.value)} placeholder={question.kind === "true-false" ? "√ / ×" : "A, B, C..."} aria-label={`Jawaban nomor ${question.number}`}/>{checked && <em>{correct ? "Benar" : `Jawaban: ${question.answer}`}</em>}</label>;
          })}
        </div>
        <div className="hsk-actions"><span>Source: {hsk1H10901.sourceFile}. UI ini hanya menampilkan latihan ringkas dan kunci jawaban, bukan salinan penuh PDF.</span><button className="primary-button" onClick={() => setSubmitted((current) => ({ ...current, [section]: true }))}>Check answers <Icon name="check" size={18}/></button></div>
      </section>
    </main>
  );
}
