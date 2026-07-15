import type { ReactNode } from "react";

export function LegalDoc({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20 sm:px-10 sm:py-28">
      <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
        Legal
      </p>
      <h1 className="font-display mt-4 text-4xl leading-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="font-mono mt-4 text-xs text-foreground-faint">
        Last updated {updated}
      </p>

      {intro && (
        <p className="font-serif mt-8 text-lg leading-relaxed text-foreground-muted">
          {intro}
        </p>
      )}

      <div className="legal-body mt-12 space-y-10 text-[15px] leading-relaxed text-foreground-muted">
        {children}
      </div>
    </article>
  );
}

export function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl text-foreground">{heading}</h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}
