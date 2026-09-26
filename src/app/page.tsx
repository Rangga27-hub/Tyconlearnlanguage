import Link from "next/link";
import { Logo } from "@/components/ui-icons";

export default function HomePage() {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><Logo /><span>LANGUAGE QUEST</span></div>
        <div className="login-monster" aria-hidden="true"><span><i/><b/><em/></span></div>
        <p className="section-kicker">WELCOME BACK</p>
        <h1 id="login-title">Log in to continue your journey.</h1>
        <p className="login-copy">Save your progress, keep your worlds, and continue learning English with Tycon.</p>
        <form className="login-form">
          <label>Email<input type="email" placeholder="you@example.com" /></label>
          <label>Password<input type="password" placeholder="••••••••" /></label>
          <Link className="primary-button login-submit" href="/learn">Login</Link>
        </form>
        <div className="login-register">New here? <Link href="/learn">Register</Link></div>
        <Link className="visitor-link" href="/learn">continue as a visitor — no login needed</Link>
      </section>
    </main>
  );
}
