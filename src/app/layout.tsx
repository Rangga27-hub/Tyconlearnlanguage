import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tycon — Little words. Big worlds.",
  description: "A local-first Bahasa Indonesia to English learning journal, with IELTS reading practice."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
