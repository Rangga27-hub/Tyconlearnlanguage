import type { SVGProps } from "react";

type IconName = "home" | "map" | "book" | "trophy" | "spark" | "arrow" | "chevron" | "check" | "close" | "heart" | "flame" | "sound" | "pause" | "back" | "globe" | "lock" | "menu" | "refresh";

export function Icon({ name, size = 20, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/></>,
    map: <><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2z"/><path d="M9 3v16M15 5v16"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></>,
    trophy: <><path d="M7 3h10v8a5 5 0 0 1-10 0zM7 5H4v3a4 4 0 0 0 3 4m10-7h3v3a4 4 0 0 1-3 4M12 16v4m-4 1h8"/></>,
    spark: <><path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9zM19 17l.6 1.4L21 19l-1.4.6L19 21l-.6-1.4L17 19l1.4-.6z"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="M18 6 6 18M6 6l12 12"/>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>,
    flame: <path d="M12 22c4.4 0 7-3 7-7 0-3.5-2-5.5-3-6-.2 2-1.6 3.1-2.5 3.5.5-3-1-7-4.5-10.5.2 3-1 5-2.8 7C4.8 10.6 5 13 5 15c0 4 2.6 7 7 7z"/>,
    sound: <><path d="M11 5 6 9H3v6h3l5 4zM15 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/></>,
    pause: <><path d="M8 5v14M16 5v14"/></>,
    back: <><path d="M19 12H5m6 6-6-6 6-6"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    refresh: <><path d="M20 11a8 8 0 1 0-2.4 6.7M20 4v7h-7"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

export function Logo() {
  return <span className="brand" aria-label="Tycon"><span className="brand-mark" aria-hidden="true"><span/><span/><span/><span/></span><span>tycon<span className="brand-dot">.</span></span></span>;
}
