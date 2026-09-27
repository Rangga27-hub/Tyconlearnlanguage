import type { Metadata } from "next";
import Link from "next/link";
import { HskJourney } from "@/components/hsk-journey";

export const metadata: Metadata = {
  title: "HSK Journey — Tycon",
  description: "A Mandarin HSK 1 practice journey with audio support.",
};

export default function HskPage() {
  return <><div className="ielts-back-to-tycon"><Link href="/learn">← Dasbor Tycon</Link></div><HskJourney /></>;
}
