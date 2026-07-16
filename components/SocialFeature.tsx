import Reveal from "@/components/Reveal";

// The real app screenshot drops in here. To swap it, replace the
// <PlaceholderScreen /> below with a single fill image, e.g.:
//   <Image src="/feed.png" alt="The Habacus friends feed" fill className="object-cover" />
const SCREEN = <PlaceholderScreen />;

export default function SocialFeature() {
  return (
    <section className="border-y border-border-hairline bg-background-raised">
      <div className="mx-auto max-w-6xl px-6 py-28 sm:px-10">
        <div className="grid items-center gap-14 md:grid-cols-2 md:gap-12 lg:gap-20">
          <Reveal>
            <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
              With your people
            </p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-balance text-foreground sm:text-5xl">
              Let your circle see you show up.
            </h2>
            <p className="font-serif mt-6 text-lg leading-relaxed text-foreground-muted">
              Share your progress with a handful of friends in a feed
              that&apos;s calm by design. You choose exactly which habits each
              person sees, so the gym crew get your training and the rest stays
              yours. Accountability, on your terms.
            </p>
          </Reveal>

          <Reveal delayMs={140} className="mx-auto w-full max-w-[300px]">
            <PhoneFrame>{SCREEN}</PhoneFrame>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** An iPhone-shaped device frame; whatever is passed fills the screen. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    // Decorative until a real screenshot (with its own alt text) replaces the
    // placeholder inside.
    <div aria-hidden="true" className="relative aspect-[9/19.5] w-full">
      {/* side buttons */}
      <span className="absolute -left-[3px] top-[18%] h-8 w-[3px] rounded-l-sm bg-border-hairline-strong" />
      <span className="absolute -left-[3px] top-[26%] h-12 w-[3px] rounded-l-sm bg-border-hairline-strong" />
      <span className="absolute -right-[3px] top-[22%] h-16 w-[3px] rounded-r-sm bg-border-hairline-strong" />

      {/* body */}
      <div className="relative h-full w-full rounded-[2.9rem] border border-border-hairline-strong bg-[#211d19] p-[9px] shadow-[0_32px_80px_-32px_rgba(0,0,0,0.85)]">
        {/* screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.35rem] bg-background-panel">
          {children}
          {/* dynamic island */}
          <span className="absolute left-1/2 top-2.5 h-[24px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

/** Clearly-labelled stand-in for the feed screenshot. */
function PlaceholderScreen() {
  return (
    <div className="flex h-full w-full flex-col justify-between border border-dashed border-border-hairline-strong p-5 pt-14">
      <div className="space-y-4">
        {[0.9, 0.65, 0.8].map((width, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-sm)] border border-border-hairline bg-background-raised p-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-7 w-7 shrink-0 rounded-full bg-gold-dim" />
              <span
                className="h-2 rounded-full bg-border-hairline-strong"
                style={{ width: `${width * 55}%` }}
              />
            </div>
            <div className="mt-3 flex gap-1.5">
              {Array.from({ length: 7 }, (_, day) => (
                <span
                  key={day}
                  className={`h-2.5 w-2.5 rounded-full ${
                    day < 4 + ((i * 3) % 3) ? "bg-gold" : "bg-border-hairline-strong"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="pb-4 text-center font-mono text-[11px] leading-relaxed text-foreground-faint">
        App screenshot
        <br />
        placeholder
      </p>
    </div>
  );
}
