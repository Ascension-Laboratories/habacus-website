"use client";

import { useEffect, useRef } from "react";

// One IntersectionObserver shared by every revealed element on the page; each
// element is revealed once and immediately unobserved. The hidden start state
// lives in globals.css (.reveal), gated on html[data-accent] and
// prefers-reduced-motion so content is never hidden without JS or animated
// against the visitor's wishes.

let observer: IntersectionObserver | null = null;

function observe(el: Element) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer?.unobserve(entry.target);
      }
    },
    // Start the ease-in once a sliver of the element clears the fold.
    { rootMargin: "0px 0px -8% 0px" },
  );
  observer.observe(el);
  return () => observer?.unobserve(el);
}

export default function Reveal({
  children,
  className = "",
  delayMs = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset for grid/list items. */
  delayMs?: number;
  as?: "div" | "section" | "li" | "figure";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(el);
  }, []);

  return (
    <Tag
      // React's ref types are per-element; one callback serves every Tag.
      ref={ref as React.Ref<never>}
      className={`reveal ${className}`}
      style={delayMs ? { ["--reveal-delay" as string]: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
