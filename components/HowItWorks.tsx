const STEPS = [
  {
    n: "01",
    title: "Add your habits",
    body: "Give each one a name and an icon. Every habit becomes a rod on your abacus.",
  },
  {
    n: "02",
    title: "Tap today’s bead",
    body: "One tap on the glowing bead and it slides across the wire into place, with a gentle haptic. Another day balanced.",
  },
  {
    n: "03",
    title: "Watch your week take shape",
    body: "Each rod holds your last seven days. Completed days gather on one side of the separator, missed days on the other, so you feel your week at a glance. No streaks to break.",
  },
  {
    n: "04",
    title: "Check in with people who matter",
    body: "A quiet, BeReal-style feed with the people you actually want cheering you on. React, or send a nudge.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-border-hairline bg-background-raised"
    >
      <div className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10">
        <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
          How it works
        </p>
        <h2 className="font-display mt-4 max-w-xl text-4xl leading-tight text-balance text-foreground sm:text-5xl">
          Four small moments a day.
        </h2>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="relative pl-2">
              <span className="font-mono text-sm text-gold">{s.n}</span>
              <h3 className="font-serif mt-3 text-xl text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
