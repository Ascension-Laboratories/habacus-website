import Hero3DAbacus from "@/components/Hero3DAbacus";
import Philosophy from "@/components/Philosophy";
import HowItWorks from "@/components/HowItWorks";
import EarlyAccess from "@/components/EarlyAccess";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 sm:px-10 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display mt-5 text-5xl leading-[1.05] text-balance text-foreground sm:text-6xl">
            Make your habits count.
          </h1>
          <p className="font-serif mt-6 text-lg leading-relaxed text-foreground-muted sm:text-xl">
            Slide your beads and watch how fast you lock in.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#early-access"
              className="rounded-full bg-gold px-8 py-3.5 font-eyebrow text-sm uppercase tracking-[0.1em] text-background transition-colors hover:bg-gold-bright"
            >
              Join early access
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-border-hairline-strong px-8 py-3.5 font-eyebrow text-sm uppercase tracking-[0.1em] text-foreground-muted transition-colors hover:border-gold/50 hover:text-foreground"
            >
              See how it works
            </a>
          </div>
        </div>

        <Hero3DAbacus />

        <p className="font-mono mx-auto -mt-6 max-w-xs text-center text-xs text-foreground-faint sm:mt-0">
          Currently in private beta on iOS
        </p>
      </section>

      <Philosophy />
      <HowItWorks />
      <EarlyAccess />
    </div>
  );
}
