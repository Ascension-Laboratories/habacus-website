"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AccentSwitcher from "@/components/AccentSwitcher";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 py-3 sm:px-6 sm:py-4">
      {/* Centered independently of the switcher below — no shared container,
          no reserved-space calc, so its position on screen can't be nudged
          by the switcher's presence or its expanded width. */}
      <div className="mx-auto max-w-[calc(100%-12rem)] lg:max-w-[69.3rem]">
        <div
          className={`flex h-[var(--nav-pill-h)] items-center justify-between rounded-full border px-5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out sm:px-8 ${
            scrolled
              ? "border-border-hairline bg-background/70 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md"
              : "border-transparent bg-transparent shadow-none"
          }`}
        >
          <Link
            href="/"
            className="font-display text-xl tracking-wide text-foreground"
          >
            habacus
          </Link>

          <div className="flex items-center gap-9">
            <nav className="hidden items-center gap-9 md:flex">
              <Link
                href="/#philosophy"
                className="font-eyebrow text-[13px] uppercase tracking-[0.14em] text-foreground-muted transition-colors hover:text-foreground"
              >
                Philosophy
              </Link>
              <Link
                href="/#how-it-works"
                className="font-eyebrow text-[13px] uppercase tracking-[0.14em] text-foreground-muted transition-colors hover:text-foreground"
              >
                How it works
              </Link>
            </nav>

            <Link
              href="/#early-access"
              className="rounded-full border border-gold/40 bg-gold-dim/30 px-5 py-2.5 font-eyebrow text-[13px] uppercase tracking-[0.1em] text-gold-bright transition-colors hover:bg-gold-dim/50"
            >
              Early access
            </Link>
          </div>
        </div>
      </div>

      {/* top-3/sm:top-4 matches the header's own py-3/sm:py-4, so this
          starts at the same y as the pill above despite being positioned
          independently of it. */}
      <div className="absolute right-4 top-3 sm:right-6 sm:top-4">
        <AccentSwitcher scrolled={scrolled} />
      </div>
    </header>
  );
}
