"use client";

/* eslint-disable react-hooks/set-state-in-effect -- browser hydration and persistence synchronization */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon, Logo } from "@/components/ui-icons";
import { WorldArt } from "@/components/world-art";
import { PixelWorldArt } from "@/components/pixel-world-art";
import { AngelWorldArt } from "@/components/angel-world-art";
import { HalloweenWorldArt } from "@/components/halloween-world-art";
import { award, catalog, consumeRecoveryNotice, emptyState, languageNames, lessonProgress, localDate, readState, streak, totalXp, STORAGE_KEY, quizReducer } from "@/lib/learning";
import type { LanguageCode, PersistedState, QuizAnswer, QuizState, SessionResult } from "@/lib/types";

export type View = "learn" | "map" | "lesson" | "journal" | "settings";
const freshQuiz = (): QuizState => ({ phase: "idle" });
function speak(text: string, lang: LanguageCode) { return <span lang={lang}>{text}</span>; }

export default function TyconApp({ initialView = "learn", requestedLessonId, showEntryPrompt = false }: { initialView?: View; requestedLessonId?: string; showEntryPrompt?: boolean }) {
  const router = useRouter();
  const [data, setData] = useState<PersistedState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>(initialView);
  const [quiz, setQuiz] = useState<QuizState>(freshQuiz);
  const [storageWarning, setStorageWarning] = useState(false);
  const promptRef = useRef<HTMLHeadingElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [notice, setNotice] = useState("");
  const source: LanguageCode = "id";
  const target: LanguageCode = "en";
  const [goal, setGoal] = useState(12);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLearnIntro, setShowLearnIntro] = useState(false);
  type IslandTheme = "classic" | "pixel" | "angel" | "halloween";
  const [islandTheme, setIslandTheme] = useState<IslandTheme>("classic");

  useEffect(() => {
    const saved = readState();
    let message = consumeRecoveryNotice();
    if (saved.profile) {
      setGoal(saved.profile.dailyGoal);
      if (initialView === "lesson") {
        const selectedCourse = catalog.courses.find(item => item.sourceLanguage === saved.profile?.sourceLanguage && item.targetLanguage === saved.profile?.targetLanguage);
        const requestedLesson = catalog.lessons.find(item => item.id === requestedLessonId && item.courseId === selectedCourse?.id);
        if (saved.activeSession && (!requestedLessonId || saved.activeSession.session.lessonId === requestedLessonId)) {
          setQuiz(saved.activeSession);
        } else if (!saved.activeSession && requestedLesson && selectedCourse) {
          const started = quizReducer(freshQuiz(), { type: "START", courseId: selectedCourse.id, lessonId: requestedLesson.id });
          if (started.phase === "question") { saved.activeSession = started; setQuiz(started); }
        } else {
          setView("map");
          setQuiz(saved.activeSession ?? freshQuiz());
          router.replace("/map");
          message = saved.activeSession ? "Another lesson is already in progress. Resume it or leave it before opening a different lesson." : "That lesson is not available for your current language path.";
        }
      } else {
        setView(initialView);
        setQuiz(saved.activeSession ?? freshQuiz());
        if (initialView === "learn" && showEntryPrompt) setShowLearnIntro(true);
      }
    } else {
      setView("learn");
      if (initialView !== "learn") router.replace("/");
    }
    setData(saved);
    setNotice(message);
    setHydrated(true);
  }, [initialView, requestedLessonId, router, showEntryPrompt]);
  useEffect(() => {
    if (!hydrated) return;
    setView(initialView);
  }, [initialView, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = "en";
    const savedTheme = localStorage.getItem("tycon:island-theme");
    if (savedTheme === "pixel" || savedTheme === "classic" || savedTheme === "angel" || savedTheme === "halloween") setIslandTheme(savedTheme);
  }, [hydrated]);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const focusable = Array.from(sidebarRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled), [href], select") ?? []);
    focusable[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMobileOpen(false); menuButtonRef.current?.focus(); return; }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (data.profile) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      else localStorage.removeItem(STORAGE_KEY);
      setStorageWarning(false);
    } catch { setStorageWarning(true); }
  }, [data, hydrated]);

  const profile = data.profile;
  const ui: LanguageCode = "en";
  const course = catalog.courses.find(item => item.sourceLanguage === (profile?.sourceLanguage ?? source) && item.targetLanguage === (profile?.targetLanguage ?? target));
  const unit = catalog.units.find(item => item.courseId === course?.id);
  const lessons = unit?.lessonIds.map(id => catalog.lessons.find(item => item.id === id)!).filter(Boolean) ?? [];
  const done = lessonProgress(data);
  const xp = totalXp(data);
  const todayXp = Object.values(data.completedSessions).filter(item => item.completedOn === localDate()).reduce((sum, item) => sum + item.xpEarned, 0);
  const nextLesson = lessons.find(item => !done.has(item.id)) ?? lessons[0];
  const currentDoneCount = lessons.filter(item => done.has(item.id)).length;
  const quizIndex = quiz.phase === "question" || quiz.phase === "feedback" ? quiz.index : -1;
  const activeExercise = quiz.phase === "question" || quiz.phase === "feedback" ? catalog.exercises.find(item => item.id === quiz.session.exerciseIds[quiz.index]) : undefined;
  const orderExercise = activeExercise?.kind === "order" ? activeExercise : undefined;
  const submittedChoice = quiz.phase === "feedback" && quiz.record.answer.kind === "choice" ? quiz.record.answer.optionId : null;
  const tokenDraft = quiz.phase === "question" && quiz.draft?.kind === "order" ? quiz.draft.tokenIds : [];
  const activeLesson = quiz.phase === "question" || quiz.phase === "feedback" ? catalog.lessons.find(item => item.id === quiz.session.lessonId) : quiz.phase === "complete" ? catalog.lessons.find(item => item.id === quiz.result.lessonId) : undefined;

  useEffect(() => {
    if (view === "lesson" && quiz.phase === "question") promptRef.current?.focus();
  }, [view, quiz.phase, quizIndex]);
  useEffect(() => {
    if (quiz.phase === "complete") {
      setData(previous => {
        if (previous.completedSessions[quiz.result.sessionId]) return { ...previous, activeSession: null };
        const result = award(previous, quiz.result);
        return { ...previous, activeSession: null, completedSessions: { ...previous.completedSessions, [result.sessionId]: result } };
      });
    } else if (quiz.phase === "question" || quiz.phase === "feedback") setData(previous => ({ ...previous, activeSession: quiz }));
    else setData(previous => ({ ...previous, activeSession: null }));
  }, [quiz]);

  function closeMobileMenu() { setMobileOpen(false); menuButtonRef.current?.focus(); }
  function closeLearnIntro() {
    setShowLearnIntro(false);
    if (showEntryPrompt && window.location.pathname === "/") router.push("/learn");
  }
  function switchIslandTheme(next?: IslandTheme) {
    const islandThemes: IslandTheme[] = ["classic", "pixel", "angel", "halloween"];
    const value = next ?? islandThemes[(islandThemes.indexOf(islandTheme) + 1) % islandThemes.length];
    setIslandTheme(value);
    try { localStorage.setItem("tycon:island-theme", value); } catch { /* Theme still changes even if storage is blocked. */ }
  }
  function saveImmediately(next: PersistedState) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageWarning(false); }
    catch { setStorageWarning(true); }
  }
  function navigate(next: View, lessonId?: string) {
    const paths: Record<Exclude<View, "lesson">, string> = { learn: "/learn", map: "/map", journal: "/progress", settings: "/settings" };
    setMobileOpen(false); setView(next);
    router.push(next === "lesson" && lessonId ? `/lesson/${encodeURIComponent(lessonId)}` : next === "lesson" ? "/map" : paths[next]);
  }
  function start(lessonId: string) {
    if (!profile || !course) return;
    if (quiz.phase === "question" || quiz.phase === "feedback") {
      if (quiz.session.courseId === course.id && quiz.session.lessonId === lessonId) { setNotice(""); navigate("lesson", lessonId); return; }
      if (!window.confirm("Starting another lesson will discard the current attempt without a reward. Continue?")) return;
    }
    const started = quizReducer(quiz.phase === "question" || quiz.phase === "feedback" ? freshQuiz() : quiz, { type: "START", courseId: course.id, lessonId });
    if (started.phase !== "question") { setNotice("This lesson could not be opened. Please choose another lesson."); navigate("map"); return; }
    const nextData = { ...data, activeSession: started };
    setQuiz(started); setData(nextData); saveImmediately(nextData);
    setNotice(""); navigate("lesson", lessonId);
  }
  function select(answer: QuizAnswer) { setQuiz(current => quizReducer(current, { type: "SET_DRAFT", answer })); }
  function dispatch(type: "SUBMIT" | "CONTINUE" | "QUIT") { setQuiz(current => quizReducer(current, { type })); }
  function completeOnboarding() {
    const now = new Date();
    const nextData: PersistedState = { ...emptyState(), profile: { id: crypto.randomUUID(), sourceLanguage: "id", targetLanguage: "en", uiLanguage: "en", dailyGoal: goal, createdAt: now.toISOString() } };
    setData(nextData); saveImmediately(nextData);
    navigate("learn"); setNotice("");
  }
  function savePreferences() {
    if (!profile) return;
    const nextData: PersistedState = { ...data, profile: { ...profile, sourceLanguage: "id", targetLanguage: "en", uiLanguage: "en", dailyGoal: goal } };
    setData(nextData); saveImmediately(nextData); setNotice("Daily goal saved.");
  }
  function quit() {
    if (window.confirm("Leave this lesson? Your answers so far won't earn XP.")) {
      const nextData = { ...data, activeSession: null };
      setQuiz(freshQuiz()); setData(nextData); saveImmediately(nextData); navigate("map");
    }
  }
  function reset() { if (window.confirm("Reset all progress on this device? This cannot be undone.")) { localStorage.removeItem(STORAGE_KEY); setData(emptyState()); setQuiz(freshQuiz()); setMobileOpen(false); setView("learn"); router.push("/"); setNotice(""); } }

  const resultRecords = Object.values(data.completedSessions).filter(item => item.courseId === course?.id);
  const islandLabels: Record<IslandTheme, string> = { classic: "Classic island", pixel: "Pixel island", angel: "Angel island", halloween: "Halloween island" };
  const islandBadges: Record<IslandTheme, string> = { classic: currentDoneCount ? "KEEP GOING" : "START HERE", pixel: "PIXEL MODE", angel: "ANGEL MODE", halloween: "HALLOWEEN MODE" };
  const islandArt = islandTheme === "pixel" ? <PixelWorldArt/> : islandTheme === "angel" ? <AngelWorldArt/> : islandTheme === "halloween" ? <HalloweenWorldArt/> : <WorldArt/>;
  if (!hydrated) return <main className="welcome-page"><header className="welcome-header wrap"><Logo /></header><p className="wrap">Opening your notebook…</p></main>;
  if (!profile) return <main className="welcome-page"><div className="welcome-noise"/><header className="welcome-header wrap"><Logo/><span className="section-kicker">YOUR PERSONAL LEARNING JOURNAL</span></header><div className="welcome-grid wrap"><section className="welcome-copy"><div className="eyebrow"><span className="eyebrow-star">✳</span> A NEW WAY TO LEARN</div><h1>Little words.<br/><span>Big worlds.</span></h1><p className="welcome-description">A local-first learning journal for one clear path: Bahasa Indonesia → English.</p><div className="course-card onboarding-course"><span className="course-icon" aria-hidden="true">🇮🇩</span><span className="course-info"><small>YOUR LEARNING PATH</small><strong>Bahasa Indonesia → English</strong><span>Build useful everyday English, one lesson at a time.</span></span></div>{notice && <p role="alert" className="word-hint">{notice}</p>}<button className="primary-button welcome-cta" onClick={completeOnboarding}>Start exploring <Icon name="arrow" size={20}/></button><p className="welcome-note">Your progress stays on this device. No account needed.</p></section><aside className="welcome-art" aria-label="A colorful floating island"><div className="art-orbit orbit-one"/><WorldArt className="welcome-world"/><div className="floating-note note-top"><span className="note-icon">✦</span><span><strong>Your story starts here</strong><small>One word at a time</small></span></div><div className="floating-note note-bottom"><span className="note-emoji">🌱</span><span><strong>Grow as you go</strong><small>Every step counts</small></span></div></aside></div><footer className="welcome-footer wrap"><span>TYCON / LEARN WITH WONDER</span><span>Made for curious minds ✳</span></footer></main>;

  return <div className={`app-shell tycon-theme-${islandTheme}`}>{showLearnIntro && view === "learn" && <div className="learn-intro-overlay" role="dialog" aria-modal="true" aria-labelledby="learn-intro-title"><div className="learn-intro-monsters" aria-hidden="true"><span className="learn-monster monster-one"><i/><b/><em/></span><span className="learn-monster monster-two"><i/><b/><em/></span><span className="learn-monster monster-three"><i/><b/><em/></span></div><section className="learn-intro-popup"><span className="section-kicker">TYCON CREW CHECK-IN</span><h2 id="learn-intro-title">What would you like to learn today?</h2><p>Pick a path and your little study monsters will guide the way.</p><div className="learn-auth-row"><button className="learn-auth-choice" onClick={closeLearnIntro}>Login</button><button className="learn-auth-choice learn-auth-visitor" onClick={closeLearnIntro}>Register as a visitor</button></div><div className="learn-intro-actions"><button className="primary-button" onClick={() => { closeLearnIntro(); if (nextLesson) start(nextLesson.id); else navigate("map"); }}>Start a quick English lesson <Icon name="arrow" size={18}/></button><button className="outline-button" onClick={() => { closeLearnIntro(); navigate("map"); }}>Explore the adventure map</button><Link className="outline-button" href="/ielts" onClick={closeLearnIntro}>Practice IELTS Journey</Link></div><button className="learn-intro-skip" onClick={closeLearnIntro}>Maybe later</button></section></div>}{mobileOpen && <button className="menu-scrim" aria-label="Close navigation menu" onClick={closeMobileMenu}/>}<aside ref={sidebarRef} id="main-sidebar" className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`} aria-hidden={isMobile && !mobileOpen} inert={isMobile && !mobileOpen ? true : undefined}><div className="sidebar-top"><Logo/><button className="icon-button mobile-close" aria-label="Close navigation menu" onClick={closeMobileMenu}><Icon name="close"/></button></div><div className="sidebar-label">YOUR SPACE</div><nav className="side-nav" aria-label="Main navigation"><button className={view === "learn" ? "active" : ""} aria-current={view === "learn" ? "page" : undefined} onClick={() => navigate("learn")}><Icon name="home"/> Learn</button><button className={view === "map" || view === "lesson" ? "active" : ""} aria-current={view === "map" || view === "lesson" ? "page" : undefined} onClick={() => navigate("map")}><Icon name="map"/> Adventure map</button><button className={view === "journal" ? "active" : ""} aria-current={view === "journal" ? "page" : undefined} onClick={() => navigate("journal")}><Icon name="trophy"/> Journal</button><Link className="ielts-side-link" href="/ielts"><Icon name="book"/> IELTS Journey</Link><button className={view === "settings" ? "active" : ""} aria-current={view === "settings" ? "page" : undefined} onClick={() => {setGoal(profile.dailyGoal);navigate("settings");}}><Icon name="spark"/> Settings</button></nav><div className="sidebar-bottom"><div className="sidebar-tip"><span>✳</span><strong>A little every day adds up.</strong><p>Keep your curiosity growing!</p></div><div className="sidebar-language"><span className="flag-round">✳</span><span><small>LEARNING</small><strong>{languageNames[profile.targetLanguage]}</strong></span></div></div></aside><div className="main-area"><header className="topbar"><button ref={menuButtonRef} className="icon-button mobile-menu" aria-label="Open navigation menu" aria-controls="main-sidebar" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Icon name="menu"/></button><div className="topbar-title"><span>THE TYCON CLUB <span>✦</span></span><strong>{view === "learn" ? "Your little corner of the world" : view === "map" ? "Adventure map" : view === "lesson" ? "Word workshop" : view === "journal" ? "Your learning journal" : "Your preferences"}</strong></div><div className="topbar-actions"><span className="stat-pill streak" aria-label={`${streak(data)} day streak`}><Icon name="flame" size={18}/><strong>{streak(data)}</strong><span className="stat-label">day streak</span></span><span className="stat-pill" aria-label={`${xp} experience points`}><strong>{xp}</strong><span className="stat-label">XP</span></span></div></header><main className="content">
    {storageWarning && <div className="word-hint" role="alert">Progress may not be saved because browser storage is unavailable.</div>}{notice && <p className="word-hint" role="status">{notice}</p>}
    {view === "learn" && <><div className="page-intro"><div><p className="section-kicker">YOUR DASHBOARD / {languageNames[profile.targetLanguage].toUpperCase()}</p><h1>Hey, explorer <span>✳</span></h1><p>Ready to make a little magic today?</p></div><span className="date-chip">✦ &nbsp; A fresh start looks good on you</span></div><div className="dashboard-grid"><div className="dashboard-main"><section className="hero-card"><div className="hero-copy"><div className="hero-tag"><span/> YOUR NEXT CHAPTER</div><h2>Every great story<br/>starts with <em>hello.</em></h2><p>Step into your {languageNames[profile.targetLanguage]} adventure. New words and wonderful little wins are waiting.</p><button className="light-button" onClick={() => navigate("map")}>Explore the map <Icon name="arrow" size={19}/></button><span className="hero-footnote">✳ LEARN AT YOUR OWN PACE</span></div><div className="hero-visual"><WorldArt className="hero-world"/></div></section><div className="section-heading"><div><p className="section-kicker">A LITTLE SOMETHING FOR YOU</p><h2>Pick up where you left off</h2></div><button className="inline-link" onClick={() => navigate("map")}>View map <Icon name="arrow" size={17}/></button></div>{nextLesson ? <button className="course-card" onClick={() => start(nextLesson.id)}><span className="course-icon">✳</span><span className="course-info"><small>LESSON · {languageNames[profile.targetLanguage].toUpperCase()}</small><strong>{nextLesson.title[ui]}</strong><span>{done.has(nextLesson.id) ? "Replay this lesson" : "Your journey begins here"}</span></span><span className="course-action"><Icon name="arrow" size={22}/></span></button> : <p>No lessons are available for this path yet.</p>}<Link className="course-card ielts-launch-card" href="/ielts"><span className="course-icon">📖</span><span className="course-info"><small>NEW · IELTS PREPARATION</small><strong>IELTS Journey</strong><span>Build reading skills with the Indonesian → English pilot.</span></span><span className="course-action"><Icon name="arrow" size={22}/></span></Link><div className="mini-cards"><div className="mini-card"><span className="mini-emoji">🎯</span><div><strong>Little wins</strong><p>{currentDoneCount} lessons completed</p></div></div><div className="mini-card"><span className="mini-emoji">✨</span><div><strong>XP collected</strong><p>{xp} points earned</p></div></div></div></div><div className="dashboard-aside"><section className="daily-card"><div className="daily-top"><span>✳</span><span>TODAY&apos;S SPARK</span></div><h2>Make today<br/>a good word day.</h2><p>One tiny lesson is all it takes to keep your adventure moving.</p><div className="progress-line"><span style={{width:`${Math.min(100,todayXp / profile.dailyGoal * 100)}%`}}/></div><div className="daily-progress"><span>Daily XP goal</span><strong>{todayXp} / {profile.dailyGoal} XP</strong></div></section><section className="map-teaser"><div className="teaser-top"><div><span className="section-kicker">YOUR WORLD</span><h2>{islandLabels[islandTheme]}</h2></div><div className="island-switcher" aria-label="Choose island theme"><button className="round-arrow" aria-label="Previous island theme" onClick={() => switchIslandTheme()}><Icon name="back"/></button><button className="round-arrow" aria-label="Next island theme" onClick={() => switchIslandTheme()}><Icon name="arrow"/></button></div></div><div className="teaser-scene">{islandArt}<span className="teaser-badge">✦ &nbsp; {islandBadges[islandTheme]}</span></div><div className="island-theme-dots" aria-label="Island themes"><button className={islandTheme === "classic" ? "active" : ""} onClick={() => switchIslandTheme("classic")}>Classic</button><button className={islandTheme === "pixel" ? "active" : ""} onClick={() => switchIslandTheme("pixel")}>Pixel</button><button className={islandTheme === "angel" ? "active" : ""} onClick={() => switchIslandTheme("angel")}>Angel</button><button className={islandTheme === "halloween" ? "active" : ""} onClick={() => switchIslandTheme("halloween")}>Dark</button></div></section></div></div></>}
    {view === "map" && <><div className="page-intro"><div><p className="section-kicker">YOUR JOURNEY / {languageNames[profile.targetLanguage].toUpperCase()}</p><h1>The adventure map <span>✳</span></h1><p>Every little step takes you somewhere new.</p></div><span className="outline-button">Bahasa Indonesia → English</span></div><div className="map-layout"><section className="map-panel"><div className="map-panel-head"><div><span className="section-kicker">CHAPTER ONE · THE BEGINNING</span><h2>A world of firsts</h2></div><span className="map-counter">{lessons.filter(item => done.has(item.id)).length} / {lessons.length} complete</span></div><div className="journey-scene" style={{minHeight:`${Math.max(570, 100 + lessons.length * 112)}px`}}><div className="journey-glow"/><div className="journey-path" aria-hidden="true"/><div className="map-decoration decor-one">✦</div><div className="map-decoration decor-two">✳</div>{lessons.map((item,index) => {const completed=done.has(item.id); const unlocked=index===0||done.has(lessons[index-1]?.id); return <button key={item.id} className={`journey-stop ${unlocked ? "unlocked" : "locked"} ${completed ? "finished" : ""}`} style={{top:`${40+index*112}px`,...(index%2===0?{left:"8%"}:{right:"8%",flexDirection:"row-reverse",textAlign:"right"})}} disabled={!unlocked} onClick={() => start(item.id)} aria-label={`${item.title[ui]}, ${completed ? "completed, replay lesson" : unlocked ? "start lesson" : "locked"}`}><span className="stop-node">{completed?<Icon name="check" size={24}/>:unlocked?<span>✦</span>:<Icon name="lock"/>}</span><span className="stop-label"><small>LESSON {String(index+1).padStart(2,"0")}</small><strong>{item.title[ui]}</strong></span></button>;})}</div></section><aside className="map-side"><div className="map-side-art"><span>YOUR LITTLE WORLD</span>{islandArt}<div className="island-theme-dots map-theme-dots" aria-label="Island themes"><button className={islandTheme === "classic" ? "active" : ""} onClick={() => switchIslandTheme("classic")}>Classic</button><button className={islandTheme === "pixel" ? "active" : ""} onClick={() => switchIslandTheme("pixel")}>Pixel</button><button className={islandTheme === "angel" ? "active" : ""} onClick={() => switchIslandTheme("angel")}>Angel</button><button className={islandTheme === "halloween" ? "active" : ""} onClick={() => switchIslandTheme("halloween")}>Dark</button></div></div><div className="next-up"><span className="section-kicker">UP NEXT</span><h2>{nextLesson?.title[ui] ?? "All caught up"}</h2><p>A bite-sized lesson from your {languageNames[profile.targetLanguage]} path. Take it at your own pace.</p><button className="primary-button" disabled={!nextLesson} onClick={() => nextLesson && start(nextLesson.id)}>{nextLesson ? done.has(nextLesson.id) ? "Replay first lesson" : "Start lesson" : "No lessons available"} <Icon name="arrow"/></button><Link className="outline-button ielts-map-link" href="/ielts">Explore IELTS Journey <Icon name="arrow" size={17}/></Link></div></aside></div></>}
    {view === "lesson" && <div className="lesson-wrap"><div className="lesson-top"><button className="icon-button" aria-label="Leave lesson" onClick={quit}><Icon name="close"/></button><div className="lesson-progress" role="progressbar" aria-label="Lesson progress" aria-valuenow={quiz.phase === "complete" ? quiz.result.questionCount : (quiz.phase === "question" || quiz.phase === "feedback" ? quiz.index + (quiz.phase === "feedback" ? 1 : 0) : 0)} aria-valuemin={0} aria-valuemax={quiz.phase === "complete" ? quiz.result.questionCount : quiz.phase === "question" || quiz.phase === "feedback" ? quiz.session.exerciseIds.length : 1}><span style={{width:`${quiz.phase === "complete" ? 100 : quiz.phase === "question" || quiz.phase === "feedback" ? (quiz.index + (quiz.phase === "feedback" ? 1 : 0)) / quiz.session.exerciseIds.length * 100 : 0}%`}}/></div><span className="lesson-count">{quiz.phase === "complete" ? "Complete" : quiz.phase === "question" || quiz.phase === "feedback" ? `${quiz.index + 1} / ${quiz.session.exerciseIds.length}` : ""}</span></div>{quiz.phase === "complete" ? <section className="lesson-complete"><div className="complete-burst" aria-hidden="true">✦</div><span className="section-kicker">LESSON COMPLETE</span><h1>Look at you go!</h1><p>You answered {quiz.result.correctCount} of {quiz.result.questionCount} correctly. Every step is progress.</p><div className="reward-row"><span>✨</span><strong>+{data.completedSessions[quiz.result.sessionId]?.xpEarned ?? (Object.values(data.completedSessions).some(item => item.lessonId === quiz.result.lessonId && item.sessionId !== quiz.result.sessionId) ? 0 : 10 + quiz.result.correctCount * 2)} XP earned</strong></div><button className="primary-button" onClick={() => {setQuiz(freshQuiz());navigate("map");}}>Back to the map <Icon name="arrow"/></button><button className="inline-link" onClick={() => activeLesson && start(activeLesson.id)}>Restart lesson <Icon name="refresh" size={17}/></button></section> : (quiz.phase === "question" || quiz.phase === "feedback") && activeExercise ? <section className="lesson-card"><div className="lesson-meta"><span>{activeLesson?.title[ui]?.toUpperCase()}</span><span>QUESTION {quiz.index + 1} OF {quiz.session.exerciseIds.length}</span></div><h1 ref={promptRef} tabIndex={-1}>{speak(activeExercise.prompt.text,activeExercise.prompt.language)}</h1><p className="lesson-instruction" lang={activeExercise.instruction.language}>{activeExercise.instruction.text}</p>{activeExercise.kind === "choice" ? <div className="answer-options" role="group" aria-label="Answer choices">{activeExercise.options.map((option,index) => <button key={option.id} aria-pressed={quiz.phase === "question" && quiz.draft?.kind === "choice" ? quiz.draft.optionId === option.id : quiz.phase === "feedback" && submittedChoice === option.id} className={`answer-option ${quiz.phase === "question" && quiz.draft?.kind === "choice" && quiz.draft.optionId === option.id ? "selected" : ""} ${quiz.phase === "feedback" && submittedChoice === option.id ? quiz.record.isCorrect ? "correct" : "incorrect" : ""}`} disabled={quiz.phase === "feedback"} onClick={() => select({kind:"choice",optionId:option.id})}><span className="answer-letter">{String.fromCharCode(65+index)}</span>{speak(option.text.text,option.text.language)}{quiz.phase === "feedback" && option.id === activeExercise.correctOptionId && <Icon name="check"/>}</button>)}</div> : <><div className="word-display"><span className="word-label">BUILD THE PHRASE</span><div className="token-answer" aria-live="polite">{tokenDraft.length ? tokenDraft.map((id,index) => {const token=orderExercise!.tokens.find(item=>item.id===id)! ;return <button key={id} className="token-chip" disabled={quiz.phase === "feedback"} aria-label={`Remove ${token.text.text}, position ${index+1}`} onClick={() => {const next=tokenDraft.filter((_,i)=>i!==index);select({kind:"order",tokenIds:next});}}>{speak(token.text.text,token.text.language)} ×</button>}) : <span className="token-placeholder">Choose words below in order</span>}</div></div><div className="answer-options token-options" aria-label="Available words">{orderExercise!.tokens.filter(token=>!tokenDraft.includes(token.id)).map(token=><button key={token.id} className="answer-option" disabled={quiz.phase === "feedback"} onClick={() => {const next=[...tokenDraft,token.id];select({kind:"order",tokenIds:next});}}>{speak(token.text.text,token.text.language)} <span className="answer-letter" aria-hidden="true">+</span></button>)}</div></>}{quiz.phase === "feedback" ? <div className={`lesson-feedback ${quiz.record.isCorrect ? "feedback-correct" : "feedback-wrong"}`} role="status" aria-live="polite"><strong>{quiz.record.isCorrect ? "That's right — lovely work!" : "Not quite. Keep exploring!"}</strong><span lang={activeExercise.explanation.language}>{activeExercise.explanation.text}</span>{!quiz.record.isCorrect && <span>Correct answer: {activeExercise.kind === "choice" ? activeExercise.options.find(item=>item.id===activeExercise.correctOptionId)?.text.text : activeExercise.correctTokenIds.map(id=>activeExercise.tokens.find(token=>token.id===id)?.text.text).join(" ")}</span>}</div> : <div className="lesson-feedback" aria-live="polite"><span>Choose an answer, then check your work.</span></div>}<button className="primary-button lesson-submit" disabled={quiz.phase === "question" && (!quiz.draft || (quiz.draft.kind === "order" && quiz.draft.tokenIds.length !== (orderExercise?.tokens.length ?? 0)))} onClick={() => dispatch(quiz.phase === "feedback" ? "CONTINUE" : "SUBMIT")}>{quiz.phase === "feedback" ? quiz.index === quiz.session.exerciseIds.length-1 ? "Finish lesson" : "Continue" : "Check answer"} <Icon name="arrow"/></button></section> : <div className="lesson-card"><h1>Choose a lesson from your map</h1><button className="primary-button" onClick={() => navigate("map")}>Open map</button></div>}</div>}
    {view === "journal" && <><div className="page-intro"><div><p className="section-kicker">YOUR LITTLE TREASURES</p><h1>The learning journal <span>✳</span></h1><p>Your progress, kept close and right here on this device.</p></div></div><div className="collection-grid"><section className="collection-hero"><span className="section-kicker">YOUR GROWING COLLECTION</span><h2>Every word is a new doorway.</h2><p>{xp} XP collected · {streak(data)} day streak</p><button className="light-button" onClick={() => navigate("map")}>Keep exploring <Icon name="arrow"/></button></section><section className="collection-stats"><div><span>✨</span><strong>{xp}</strong><small>TOTAL XP</small></div><div><span>🏅</span><strong>{currentDoneCount}</strong><small>LESSONS FINISHED</small></div><div><span>🌱</span><strong>{streak(data)}</strong><small>DAY STREAK</small></div></section></div><div className="section-heading"><div><p className="section-kicker">THIS PATH</p><h2>Lesson stamps</h2></div></div><div className="badge-grid">{lessons.map(item=><article key={item.id} className={`badge-card ${done.has(item.id)?"earned":""}`}><span>{done.has(item.id)?"🌟":"✧"}</span><strong>{item.title[ui]}</strong><p>{done.has(item.id) ? formatLessonResult(resultRecords.filter(result => result.lessonId === item.id)) : "Ready when you are"}</p></article>)}</div></>}
    {view === "settings" && <><div className="page-intro"><div><p className="section-kicker">YOUR SPACE, YOUR WAY</p><h1>Settings <span>✳</span></h1><p>Your active learning path is Bahasa Indonesia → English.</p></div></div><section className="lesson-card settings-card"><div className="date-chip">BAHASA INDONESIA → ENGLISH</div><label className="goal-control">Daily XP goal <select value={goal} onChange={event=>setGoal(Number(event.target.value))}><option value={8}>8 XP</option><option value={12}>12 XP</option><option value={20}>20 XP</option><option value={30}>30 XP</option></select></label><button className="primary-button" onClick={savePreferences}>Save preferences <Icon name="check"/></button><hr/><button className="outline-button" onClick={reset}>Reset local progress</button><p>Your journal is stored only in this browser. IELTS Journey progress is saved separately.</p></section></>}
    </main></div></div>;
}

function formatLessonResult(results: SessionResult[]) {
  const best = results.reduce((score, result) => Math.max(score, result.correctCount), 0);
  const questions = results[0]?.questionCount ?? 0;
  return `Best ${best} / ${questions} · ${results.length} ${results.length === 1 ? "attempt" : "attempts"}`;
}
