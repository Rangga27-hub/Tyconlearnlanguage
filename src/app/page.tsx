"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, Logo } from "@/components/ui-icons";
import { WorldArt } from "@/components/world-art";

type LanguageKey = "Spanish" | "Japanese" | "French";
type View = "welcome" | "home" | "map" | "lesson" | "collection";
type Question = { prompt: string; word: string; options: string[]; answer: string; hint: string };

const languages: Record<LanguageKey, { flag: string; hello: string; color: string; detail: string; questions: Question[] }> = {
  Spanish: {
    flag: "🇪🇸", hello: "¡Hola!", color: "peach", detail: "A sunny start to a new story",
    questions: [
      { prompt: "What does this word mean?", word: "Hola", options: ["Hello", "Goodbye", "Thank you"], answer: "Hello", hint: "A friendly way to say hi!" },
      { prompt: "Choose the right meaning", word: "Gracias", options: ["Please", "Thank you", "Good morning"], answer: "Thank you", hint: "Say this when someone helps you." },
      { prompt: "One more for the road!", word: "Amigo", options: ["Friend", "House", "Water"], answer: "Friend", hint: "Someone you love spending time with." },
    ],
  },
  Japanese: {
    flag: "🇯🇵", hello: "こんにちは", color: "lavender", detail: "Small steps, big discoveries",
    questions: [
      { prompt: "What does this word mean?", word: "こんにちは", options: ["Hello", "Goodbye", "Please"], answer: "Hello", hint: "A greeting for daytime." },
      { prompt: "Choose the right meaning", word: "ありがとう", options: ["Good night", "Thank you", "Friend"], answer: "Thank you", hint: "A little gratitude goes a long way." },
      { prompt: "One more for the road!", word: "ねこ", options: ["Dog", "Bird", "Cat"], answer: "Cat", hint: "A tiny furry companion." },
    ],
  },
  French: {
    flag: "🇫🇷", hello: "Bonjour!", color: "mint", detail: "A whole world of possibilities",
    questions: [
      { prompt: "What does this word mean?", word: "Bonjour", options: ["Hello", "Goodbye", "Thank you"], answer: "Hello", hint: "A greeting to brighten the day." },
      { prompt: "Choose the right meaning", word: "Merci", options: ["Please", "Thank you", "Friend"], answer: "Thank you", hint: "The polite word for gratitude." },
      { prompt: "One more for the road!", word: "Chat", options: ["House", "Cat", "Book"], answer: "Cat", hint: "A purring little friend." },
    ],
  },
};
const languageKeys = Object.keys(languages) as LanguageKey[];
const stages = ["The first hello", "Little conversations", "Around the corner", "A world of words"];

export default function Home() {
  const [view, setView] = useState<View>("welcome");
  const [language, setLanguage] = useState<LanguageKey>("Spanish");
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [stage, setStage] = useState(0);
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [lessonDone, setLessonDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const modalRef = useRef<HTMLElement>(null);
  const course = languages[language];
  const current = course.questions[question];
  const correct = selected === current.answer;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowLanguagePicker(false);
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!showLanguagePicker) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const modal = modalRef.current;
    modal?.querySelector<HTMLButtonElement>("button")?.focus();
    function trapFocus(event: KeyboardEvent) {
      if (event.key !== "Tab" || !modal) return;
      const buttons = Array.from(modal.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
      if (!buttons.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", trapFocus);
    return () => { document.removeEventListener("keydown", trapFocus); previousFocus?.focus(); };
  }, [showLanguagePicker]);

  function navigate(next: View) { setView(next); setMenuOpen(false); }
  function startLesson(nextStage = Math.min(completed, stages.length - 1)) {
    setStage(nextStage); setQuestion(0); setSelected(null); setChecked(false); setHearts(5); setLessonDone(false); setShowHint(false); navigate("lesson");
  }
  function nextQuestion() {
    if (!correct) { setSelected(null); setChecked(false); return; }
    if (question < course.questions.length - 1) { setQuestion(question + 1); setSelected(null); setChecked(false); setShowHint(false); }
    else { setCompleted(Math.max(completed, stage + 1)); setLessonDone(true); }
  }
  function changeLanguage(next: LanguageKey) {
    setLanguage(next); setCompleted(0); setShowLanguagePicker(false); setQuestion(0);
  }

  if (view === "welcome") return (
    <main className="welcome-page">
      <div className="welcome-noise" aria-hidden="true" />
      <header className="welcome-header wrap"><Logo /><button className="text-button" onClick={() => navigate("home")}>Skip intro <Icon name="arrow" size={17} /></button></header>
      <div className="welcome-grid wrap">
        <section className="welcome-copy">
          <div className="eyebrow"><span className="eyebrow-star">✳</span> A NEW WAY TO LEARN</div>
          <h1>Little words.<br /><span>Big worlds.</span></h1>
          <p className="welcome-description">Language learning that feels less like homework and more like somewhere wonderful to go.</p>
          <div className="picker-heading"><div><span className="step-number">01</span><h2>Where to first?</h2></div><p>Pick a language to begin your adventure.</p></div>
          <div className="language-options" role="group" aria-label="Choose a language">
            {languageKeys.map((item) => <button key={item} className={`language-option ${language === item ? "chosen" : ""}`} onClick={() => setLanguage(item)} aria-pressed={language === item}><span className="language-flag">{languages[item].flag}</span><span className="language-option-text"><strong>{item}</strong><small>{languages[item].hello}</small></span><span className="option-radio" aria-hidden="true">{language === item && <Icon name="check" size={14} />}</span></button>)}
          </div>
          <button className="primary-button welcome-cta" onClick={() => navigate("home")}>Let&apos;s go exploring <Icon name="arrow" size={20} /></button>
          <p className="welcome-note">No pressure. No perfection. Just progress. <span>✦</span></p>
        </section>
        <aside className="welcome-art" aria-label="Preview of your adventure">
          <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
          <div className="floating-note note-top"><span className="note-icon">✦</span><span><strong>Your story starts here</strong><small>One word at a time</small></span></div>
          <WorldArt className="welcome-world" />
          <div className="floating-note note-bottom"><span className="note-emoji">🌱</span><span><strong>Grow as you go</strong><small>Every step counts</small></span></div>
          <div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✦</div><div className="art-spark spark-three">✧</div>
          <span className="art-caption">THE ADVENTURE IS YOURS</span>
        </aside>
      </div>
      <footer className="welcome-footer wrap"><span>TYCON / LEARN WITH WONDER</span><span>Made for the curious minds <span aria-hidden="true">✳</span></span></footer>
    </main>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-top"><Logo /><button className="mobile-close icon-button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><Icon name="close" /></button></div>
        <div className="sidebar-label">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Explore">
          <button className={view === "home" ? "active" : ""} onClick={() => navigate("home")}><Icon name="home" /> Home</button>
          <button className={view === "map" || view === "lesson" ? "active" : ""} onClick={() => navigate("map")}><Icon name="map" /> Adventure map</button>
          <button onClick={() => startLesson()}><Icon name="book" /> Practice</button>
          <button className={view === "collection" ? "active" : ""} onClick={() => navigate("collection")}><Icon name="trophy" /> My collection</button>
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-tip"><span>✳</span><strong>A little every day adds up.</strong><p>Keep your curiosity growing!</p></div><button className="sidebar-language" onClick={() => setShowLanguagePicker(true)} aria-label={`Change language, currently ${language}`}><span className="flag-round">{course.flag}</span><span><small>LEARNING</small><strong>{language}</strong></span><Icon name="chevron" size={17} /></button></div>
      </aside>
      {menuOpen && <button className="menu-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <div className="main-area">
        <header className="topbar"><button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Icon name="menu" /></button><div className="topbar-title"><span>THE TYCON CLUB <span aria-hidden="true">✦</span></span><strong>{view === "home" ? "Your little corner of the world" : view === "map" ? "Adventure map" : view === "lesson" ? "Word workshop" : "Your collection"}</strong></div><div className="topbar-actions"><span className="stat-pill streak" title="Adventure streak"><Icon name="flame" size={18} /> <strong>{completed > 0 ? 1 : 0}</strong><span className="stat-label">day streak</span></span><span className="stat-pill hearts" title="Hearts remaining"><Icon name="heart" size={18} /> <strong>{hearts}</strong></span><span className="avatar" aria-label="Explorer profile">☺</span></div></header>
        <main className="content">
          {view === "home" && <>
            <div className="page-intro"><div><p className="section-kicker">YOUR DASHBOARD / {course.flag} {language.toUpperCase()}</p><h1>Hey, explorer <span aria-hidden="true">✳</span></h1><p>Ready to make a little magic today?</p></div><span className="date-chip">✦ &nbsp; A fresh start looks good on you</span></div>
            <div className="dashboard-grid">
              <div className="dashboard-main">
                <section className="hero-card"><div className="hero-copy"><div className="hero-tag"><span/> YOUR NEXT CHAPTER</div><h2>Every great story<br />starts with <em>hello.</em></h2><p>Step into your {language} adventure. New words and wonderful little wins are waiting.</p><button className="light-button" onClick={() => navigate("map")}>Explore the map <Icon name="arrow" size={19} /></button><span className="hero-footnote">✳ LEARN AT YOUR OWN PACE</span></div><div className="hero-visual"><WorldArt className="hero-world" /><span className="hero-visual-star">✦</span></div></section>
                <div className="section-heading"><div><p className="section-kicker">A LITTLE SOMETHING FOR YOU</p><h2>Pick up where you left off</h2></div><button className="inline-link" onClick={() => navigate("map")}>View map <Icon name="arrow" size={17}/></button></div>
                <button className="course-card" onClick={() => startLesson()}><span className="course-icon">{course.flag}</span><span className="course-info"><small>UNIT {String(Math.min(completed + 1, stages.length)).padStart(2, "0")} · {language.toUpperCase()}</small><strong>{stages[Math.min(completed, stages.length - 1)]}</strong><span>{completed ? "Keep the momentum going" : "Your journey begins here"}</span></span><span className="course-action"><Icon name="arrow" size={22} /></span></button>
                <div className="mini-cards"><div className="mini-card"><span className="mini-emoji">🎯</span><div><strong>Little wins</strong><p>{completed} {completed === 1 ? "lesson" : "lessons"} completed</p></div></div><div className="mini-card"><span className="mini-emoji">✨</span><div><strong>Words collected</strong><p>{completed * 3} new words so far</p></div></div></div>
              </div>
              <div className="dashboard-aside"><section className="daily-card"><div className="daily-top"><span className="small-icon">✳</span><span>TODAY&apos;S SPARK</span></div><h2>Make today<br />a good word day.</h2><p>One tiny lesson is all it takes to keep your adventure moving.</p><div className="progress-line"><span style={{ width: `${Math.min(completed * 25, 100)}%` }} /></div><div className="daily-progress"><span>Daily goal</span><strong>{Math.min(completed, 4)} / 4 lessons</strong></div></section><section className="map-teaser"><div className="teaser-top"><div><span className="section-kicker">YOUR WORLD</span><h2>The path ahead</h2></div><button className="round-arrow" aria-label="Open adventure map" onClick={() => navigate("map")}><Icon name="arrow" size={19} /></button></div><div className="teaser-scene"><WorldArt /><span className="teaser-badge">✦ &nbsp; {completed ? "KEEP GOING" : "START HERE"}</span></div></section></div>
            </div>
          </>}
          {view === "map" && <><div className="page-intro"><div><p className="section-kicker">YOUR JOURNEY / {language.toUpperCase()}</p><h1>The adventure map <span aria-hidden="true">✳</span></h1><p>Every little step takes you somewhere new.</p></div><button className="outline-button" onClick={() => setShowLanguagePicker(true)}><Icon name="globe" size={18}/> {course.flag} {language} <Icon name="chevron" size={16}/></button></div><div className="map-layout"><section className="map-panel"><div className="map-panel-head"><div><span className="section-kicker">CHAPTER ONE · THE BEGINNING</span><h2>A world of firsts</h2></div><span className="map-counter">{completed} / {stages.length} complete</span></div><div className="journey-scene"><div className="journey-glow"/><div className="journey-path" aria-hidden="true"/><div className="map-decoration decor-one">✦</div><div className="map-decoration decor-two">✳</div><div className="map-decoration decor-three">✧</div>{stages.map((title, index) => { const unlocked = index <= completed; return <button key={title} className={`journey-stop stop-${index} ${unlocked ? "unlocked" : "locked"} ${index < completed ? "finished" : ""}`} disabled={!unlocked} onClick={() => startLesson(index)} aria-label={`${title}, ${index < completed ? "completed, replay lesson" : unlocked ? "start lesson" : "locked"}`}><span className="stop-node">{index < completed ? <Icon name="check" size={24}/> : unlocked ? <span>✦</span> : <Icon name="lock" size={20}/>}</span><span className="stop-label"><small>LESSON {String(index + 1).padStart(2, "0")}</small><strong>{title}</strong></span></button>; })}</div></section><aside className="map-side"><div className="map-side-art"><span>YOUR LITTLE WORLD</span><WorldArt /></div><div className="next-up"><span className="section-kicker">UP NEXT</span><h2>{stages[Math.min(completed, stages.length - 1)]}</h2><p>{course.detail}. Learn three useful words in a bite-sized lesson.</p><button className="primary-button" onClick={() => startLesson()}>{completed >= stages.length ? "Replay a lesson" : "Start lesson"} <Icon name="arrow" size={18}/></button></div><div className="side-reminder">✳ <span>There&apos;s no rush. This is your journey.</span></div></aside></div></>}
          {view === "lesson" && <div className="lesson-wrap"><div className="lesson-top"><button className="icon-button lesson-back" aria-label="Leave lesson and return to map" onClick={() => navigate("map")}><Icon name="close"/></button><div className="lesson-progress" role="progressbar" aria-label="Lesson progress" aria-valuenow={lessonDone ? 3 : question} aria-valuemin={0} aria-valuemax={3}><span style={{ width: `${(lessonDone ? 3 : question) / 3 * 100}%` }}/></div><div className="lesson-hearts"><Icon name="heart" size={19}/> {hearts}</div></div>{lessonDone ? <section className="lesson-complete"><div className="complete-burst" aria-hidden="true">✦</div><span className="section-kicker">LESSON COMPLETE</span><h1>Look at you go!</h1><p>Three new words in your pocket. That&apos;s a pretty wonderful start.</p><div className="reward-row"><span>✨</span><strong>+3 words collected</strong></div><button className="primary-button" onClick={() => navigate("map")}>Back to the map <Icon name="arrow" size={19}/></button></section> : <section className="lesson-card"><div className="lesson-meta"><span>LESSON {String(stage + 1).padStart(2, "0")} · {stages[stage].toUpperCase()}</span><span>{question + 1} OF 3</span></div><h1>{current.prompt}</h1><p className="lesson-instruction">Take a guess! You can always try again.</p><div className="word-display"><span className="word-spark" aria-hidden="true">✦</span><span className="word-label">{language.toUpperCase()} WORD</span><strong>{current.word}</strong><button className="sound-button" aria-label={`Show hint for ${current.word}`} aria-expanded={showHint} onClick={() => setShowHint(!showHint)}><Icon name="spark" size={20}/></button></div>{showHint && <p className="word-hint" role="status">✳ &nbsp; Hint: {current.hint}</p>}<span className="answer-label">CHOOSE THE MEANING</span><div className="answer-options">{current.options.map((option, index) => <button key={option} className={`answer-option ${selected === option ? "selected" : ""} ${checked && selected === option ? correct ? "correct" : "incorrect" : ""}`} onClick={() => { if (!checked) setSelected(option); }} disabled={checked} aria-pressed={selected === option}><span className="answer-letter">{String.fromCharCode(65 + index)}</span>{option}{checked && selected === option && <Icon name={correct ? "check" : "close"} size={20}/>}</button>)}</div><div className={`lesson-feedback ${checked ? correct ? "feedback-correct" : "feedback-wrong" : ""}`} role="status" aria-live="polite">{checked ? <><strong>{correct ? "Beautifully done! ✨" : hearts === 0 ? "No worries — try again!" : "Not quite, but you've got this!"}</strong><span>{correct ? current.hint : "Give it another shot. Learning is all about trying."}</span></> : <span>Trust your instincts. You&apos;ve got this!</span>}</div><button className="primary-button lesson-submit" disabled={!selected} onClick={() => { if (!checked) { setChecked(true); if (!correct) setHearts(Math.max(0, hearts - 1)); } else nextQuestion(); }}>{checked ? correct ? question === 2 ? "Finish lesson" : "Continue" : "Try again" : "Check answer"} <Icon name="arrow" size={19}/></button></section>}</div>}
          {view === "collection" && <><div className="page-intro"><div><p className="section-kicker">YOUR LITTLE TREASURES</p><h1>The good stuff <span aria-hidden="true">✳</span></h1><p>Look at everything you&apos;re becoming.</p></div></div><div className="collection-grid"><div className="collection-hero"><span className="collection-spark">✦</span><span className="section-kicker">YOUR GROWING COLLECTION</span><h2>Every word is a new doorway.</h2><p>Keep learning, keep wondering, and see how far you can go.</p><button className="light-button" onClick={() => navigate("map")}>Keep exploring <Icon name="arrow" size={18}/></button></div><div className="collection-stats"><div><span>✨</span><strong>{completed * 3}</strong><small>WORDS LEARNED</small></div><div><span>🏅</span><strong>{completed}</strong><small>LESSONS FINISHED</small></div><div><span>🌱</span><strong>{completed > 0 ? 1 : 0}</strong><small>DAYS EXPLORED</small></div></div></div><div className="section-heading"><div><p className="section-kicker">MILESTONES</p><h2>Moments worth celebrating</h2></div></div><div className="badge-grid"><div className={`badge-card ${completed ? "earned" : ""}`}><span>🌟</span><strong>First steps</strong><p>{completed ? "You completed your first lesson!" : "Complete a lesson to unlock"}</p></div><div className={`badge-card ${completed >= 3 ? "earned" : ""}`}><span>🪄</span><strong>Word wizard</strong><p>{completed >= 3 ? "Three lessons down. Magic!" : "Complete three lessons to unlock"}</p></div><div className={`badge-card ${completed >= 4 ? "earned" : ""}`}><span>🗺️</span><strong>Trailblazer</strong><p>{completed >= 4 ? "You explored the whole chapter!" : "Finish the chapter to unlock"}</p></div></div></>}
        </main>
      </div>
      {showLanguagePicker && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowLanguagePicker(false); }}><section ref={modalRef} className="language-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="icon-button modal-close" aria-label="Close language picker" onClick={() => setShowLanguagePicker(false)}><Icon name="close"/></button><span className="section-kicker">CHOOSE YOUR PATH</span><h2 id="modal-title">Where to next?</h2><p>Pick a language to explore. Switching starts a fresh adventure.</p><div className="modal-options">{languageKeys.map((item) => <button key={item} className={language === item ? "current" : ""} onClick={() => changeLanguage(item)}><span>{languages[item].flag}</span><strong>{item}</strong><small>{languages[item].hello}</small>{language === item && <Icon name="check" size={18}/>}</button>)}</div></section></div>}
    </div>
  );
}
