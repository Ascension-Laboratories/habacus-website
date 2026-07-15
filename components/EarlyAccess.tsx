export default function EarlyAccess() {
  return (
    <section
      id="early-access"
      className="border-t border-border-hairline bg-background-raised"
    >
      <div className="mx-auto max-w-4xl scroll-mt-24 px-6 py-28 text-center sm:px-10">
        <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
          Early access
        </p>
        <h2 className="font-display mt-4 text-4xl leading-tight text-balance text-foreground sm:text-5xl">
          Habacus is currently in private beta.
        </h2>
        <p className="font-serif mt-6 text-lg leading-relaxed text-foreground-muted">
          We&apos;re letting a small group in before the wider iOS launch. Say
          hello and we&apos;ll reach out when there&apos;s a seat for you.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:hello@habacus.app?subject=Habacus%20early%20access"
            className="rounded-full bg-gold px-8 py-3.5 font-eyebrow text-sm uppercase tracking-[0.1em] text-background transition-colors hover:bg-gold-bright"
          >
            Request early access
          </a>
          <a
            href="#philosophy"
            className="rounded-full border border-border-hairline-strong px-8 py-3.5 font-eyebrow text-sm uppercase tracking-[0.1em] text-foreground-muted transition-colors hover:border-gold/50 hover:text-foreground"
          >
            Read the philosophy
          </a>
        </div>

        <p className="mt-8 font-mono text-xs text-foreground-faint">
          Built by Ascension Labs — a small studio working on quieter,
          calmer software.
        </p>
      </div>
    </section>
  );
}
