import Reveal from "@/components/Reveal";

const HABITS = ["Training", "Reading", "Sleep", "Deep work"];

export default function WhoItsFor() {
  return (
    <section className="border-y border-border-hairline bg-background-panel">
      <div className="grain relative mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16">
          <Reveal className="max-w-xs shrink-0">
            <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
              Who it&apos;s for
            </p>
            <h2 className="font-display mt-3 text-3xl leading-tight text-balance text-foreground sm:text-4xl">
              For people building something.
            </h2>
          </Reveal>

          <Reveal delayMs={140} className="max-w-xl">
            <p className="font-serif text-lg leading-relaxed text-foreground-muted">
              You&apos;re a student, a founder, an early-something with big
              plans and a to-do list that never sleeps. Habacus keeps the
              habits that keep you in one place you actually want to open.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {HABITS.map((habit) => (
                <li
                  key={habit}
                  className="rounded-full border border-border-hairline-strong px-4 py-1.5 font-mono text-xs text-foreground-muted"
                >
                  {habit}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
