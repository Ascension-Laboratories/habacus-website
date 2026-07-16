import Reveal from "@/components/Reveal";
import WaitlistButton from "@/components/WaitlistButton";

export default function EarlyAccess() {
  return (
    <section
      id="early-access"
      className="border-t border-border-hairline bg-background-raised"
    >
      <div className="mx-auto max-w-4xl scroll-mt-24 px-6 py-28 text-center sm:px-10">
        <Reveal>
          <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
            Early access
          </p>
          <h2 className="font-display mt-4 text-4xl leading-tight text-balance text-foreground sm:text-5xl">
            Come in early.
          </h2>
          <p className="font-serif mt-6 text-lg leading-relaxed text-foreground-muted">
            We&apos;re opening Habacus to a small group before the wider iOS
            launch.
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground-muted">
            Say hello and we&apos;ll be in contact when a seat&apos;s
            available.
          </p>

          <div className="mt-10 flex justify-center">
            <WaitlistButton className="rounded-full bg-gold px-8 py-3.5 font-eyebrow text-sm uppercase tracking-[0.1em] text-background transition-colors hover:bg-gold-bright">
              Request early access
            </WaitlistButton>
          </div>

          <p className="mt-8 font-mono text-xs text-foreground-faint">
            Built by Ascension Labs, a small studio working on quieter, calmer
            software.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
