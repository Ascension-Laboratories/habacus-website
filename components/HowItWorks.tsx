import Reveal from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Add your habits",
    body: "Give each one a name and an icon. Every habit becomes a rod on your abacus.",
  },
  {
    n: "02",
    title: "Tap today’s bead",
    body: "One tap and the glowing bead slides across the wire into place, with a gentle haptic. Another day, balanced.",
  },
  {
    n: "03",
    title: "Watch your week take shape",
    body: "Each rod holds your last seven days. Completed days gather to one side of the separator, so you feel your whole week at a glance.",
  },
  {
    n: "04",
    title: "Check in with your people",
    body: "A quiet, tailored feed of the friends you actually want in your corner. React, or send a nudge.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10"
    >
      <Reveal className="max-w-xl">
        <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
          How it works
        </p>
        <h2 className="font-display mt-4 text-4xl leading-tight text-balance text-foreground sm:text-5xl">
          Four small moments a day.
        </h2>
      </Reveal>

      {/* A single wire runs down the section; each step sits on it as a bead,
          alternating sides on desktop like beads settling left and right. */}
      <div className="relative mt-16">
        <div
          aria-hidden="true"
          className="absolute bottom-1 left-[7px] top-1 w-px bg-border-hairline-strong md:left-1/2 md:-translate-x-1/2"
        />
        <ol className="space-y-14 md:space-y-20">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.n} delayMs={i * 90} className="relative pl-10 md:pl-0">
              <span
                aria-hidden="true"
                className="bead-dot absolute left-0 top-1.5 md:left-1/2 md:-translate-x-1/2"
              />
              <div
                className={`md:w-[calc(50%-3.5rem)] ${
                  i % 2 === 1 ? "md:ml-auto" : ""
                }`}
              >
                <span className="font-mono text-sm text-gold">{step.n}</span>
                <h3 className="font-serif mt-3 text-xl text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
