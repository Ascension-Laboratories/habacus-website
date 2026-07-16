import Reveal from "@/components/Reveal";

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10"
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-5">
          <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
            Philosophy
          </p>
          <h2 className="font-display mt-4 text-4xl leading-tight text-balance text-foreground sm:text-5xl">
            Ritualise your lock-in
          </h2>
        </Reveal>

        <div className="md:col-span-6 md:col-start-7 md:pt-12">
          <Reveal delayMs={120}>
            <p className="font-serif text-lg leading-relaxed text-foreground-muted">
              Every habit becomes a rod on your abacus. Each day you show up, a
              bead slides across the wire and settles into place. Small,
              physical, quietly satisfying.
            </p>
          </Reveal>
          <Reveal delayMs={240}>
            <p className="font-serif mt-6 text-lg leading-relaxed text-foreground">
              It turns consistency into something you can feel, hold, and watch
              grow.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
