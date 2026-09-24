import type { Metadata } from "next";
import Link from "next/link";
import IeltsJourney from "@/components/ielts-journey";

export const metadata: Metadata = {
  title: "IELTS Journey — Tycon",
  description: "A local-first Indonesian-to-English IELTS reading practice pilot.",
};

export default function IeltsPage() {
  return <><div className="ielts-back-to-tycon"><Link href="/learn">← Dasbor Tycon</Link></div><IeltsJourney /></>;
}
