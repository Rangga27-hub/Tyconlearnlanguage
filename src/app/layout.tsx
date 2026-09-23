import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tycon — Little words. Big worlds.",
  description: "A playful place to explore new languages, one little word at a time.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
