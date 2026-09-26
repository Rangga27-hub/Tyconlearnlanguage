import Link from "next/link";
import { Logo } from "@/components/ui-icons";

const questCards = [
  { title: "IELTS QUEST", description: "Ace my IELTS", status: "AVAILABLE", href: "/ielts", icon: "📖", available: true },
  { title: "ENGLISH BASICS", description: "Build my English", status: "COMING SOON", href: "#", icon: "✨", available: false },
  { title: "MANDARIN", description: "Learn Mandarin", status: "COMING SOON", href: "#", icon: "🐉", available: false },
  { title: "SPEAKING QUEST", description: "Practice Speaking", status: "COMING SOON", href: "#", icon: "🎙️", available: false },
];

export default function HomePage() {
  return (
    <main className="onboarding-page">
      <section className="onboarding-shell" aria-labelledby="onboarding-title">
        <header className="onboarding-header">
          <Logo />
          <span>LANGUAGE QUEST</span>
        </header>

        <div className="onboarding-mascot" aria-hidden="true">
          <span className="onboarding-mascot-body"><i/><b/><em/></span>
          <span className="onboarding-spark spark-one">✦</span>
          <span className="onboarding-spark spark-two">✳</span>
        </div>

        <div className="onboarding-copy">
          <p className="section-kicker">LANGUAGE QUEST</p>
          <h1 id="onboarding-title">Your next quest awaits.</h1>
          <p>What do you want to conquer first?</p>
        </div>

        <div className="quest-choice-grid" aria-label="Choose a learning quest">
          {questCards.map((quest) => quest.available ? (
            <Link key={quest.title} className="quest-choice-card quest-available" href={quest.href}>
              <span className="quest-choice-icon" aria-hidden="true">{quest.icon}</span>
              <strong>{quest.title}</strong>
              <small>{quest.description}</small>
              <em>{quest.status}</em>
            </Link>
          ) : (
            <button key={quest.title} className="quest-choice-card quest-locked" disabled>
              <span className="quest-choice-icon" aria-hidden="true">{quest.icon}</span>
              <strong>{quest.title}</strong>
              <small>{quest.description}</small>
              <em>{quest.status}</em>
            </button>
          ))}
        </div>

        <footer className="onboarding-footer">
          <span>Already on a quest?</span>
          <Link href="/login">Log in</Link>
          <span>or</span>
          <Link href="/login" className="visitor-word">visit</Link>
        </footer>
      </section>
    </main>
  );
}
