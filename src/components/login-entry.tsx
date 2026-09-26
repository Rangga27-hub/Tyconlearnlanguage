"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui-icons";
import { emptyState, STORAGE_KEY } from "@/lib/learning";
import type { PersistedState } from "@/lib/types";

function makeVisitorState(): PersistedState {
  const now = new Date().toISOString();
  return {
    ...emptyState(),
    profile: {
      id: crypto.randomUUID(),
      sourceLanguage: "id",
      targetLanguage: "en",
      uiLanguage: "en",
      dailyGoal: 12,
      createdAt: now,
    },
  };
}

export function LoginEntry() {
  const router = useRouter();

  function enterAsVisitor() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(makeVisitorState())); } catch { /* Visitor mode can still continue without saved storage. */ }
    router.push("/learn");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    enterAsVisitor();
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><Logo /><span>LANGUAGE QUEST</span></div>
        <div className="login-monster" aria-hidden="true"><span><i/><b/><em/></span></div>
        <p className="section-kicker">WELCOME BACK</p>
        <h1 id="login-title">Log in to continue your journey.</h1>
        <p className="login-copy">Save your progress, keep your worlds, and continue learning English with Tycon.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email<input type="email" placeholder="you@example.com" autoComplete="email" /></label>
          <label>Password<input type="password" placeholder="••••••••" autoComplete="current-password" /></label>
          <button className="primary-button login-submit" type="submit">Login</button>
        </form>
        <div className="login-register">New here? <button type="button" onClick={enterAsVisitor}>Register as a visitor</button></div>
        <button className="visitor-link" type="button" onClick={enterAsVisitor}>continue as a visitor — no login needed</button>
        <Link className="login-ielts-link" href="/ielts">or jump into IELTS Journey</Link>
      </section>
    </main>
  );
}
