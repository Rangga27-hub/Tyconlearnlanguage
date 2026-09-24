import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tycon — Little words. Big worlds.",
  description: "A local-first Bahasa Indonesia to English learning journal, with IELTS reading practice."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="tycon-bg-monsters" aria-hidden="true">
          <span className="tycon-bg-bug tycon-bug-a"><i/><b/><em/></span>
          <span className="tycon-bg-bug tycon-bug-b"><i/><b/><em/></span>
          <span className="tycon-bg-bug tycon-bug-c"><i/><b/><em/></span>
          <span className="tycon-bg-bug tycon-bug-d"><i/><b/><em/></span>
          <span className="tycon-bg-bug tycon-bug-e"><i/><b/><em/></span>
          <span className="tycon-bg-bug tycon-bug-f"><i/><b/><em/></span>
        </div>
        {children}
      </body>
    </html>
  );
}
