import Hero3DAbacus from "@/components/Hero3DAbacus";
import Philosophy from "@/components/Philosophy";
import WhoItsFor from "@/components/WhoItsFor";
import HowItWorks from "@/components/HowItWorks";
import SocialFeature from "@/components/SocialFeature";
import ShareAbacus from "@/components/ShareAbacus";
import EarlyAccess from "@/components/EarlyAccess";
import Faq from "@/components/Faq";
import WaitlistButton from "@/components/WaitlistButton";
import { getWaitlistCount } from "@/lib/waitlist";

export default async function Home() {
  const waitlistCount = await getWaitlistCount();

  return (
    <div className="relative overflow-hidden">
      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 sm:px-10 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display mt-5 text-5xl leading-[1.05] text-balance text-foreground sm:text-6xl">
            Make your habits count.
          </h1>
          <p className="font-serif mt-6 text-lg leading-relaxed text-foreground-muted sm:text-xl">
            An abacus for your habits. Tap once a day, feel the bead slide
            home, and watch your week take shape.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <WaitlistButton className="rounded-full bg-gold px-8 py-3.5 font-eyebrow text-sm uppercase tracking-[0.1em] text-background transition-colors hover:bg-gold-bright">
              Join early access
            </WaitlistButton>
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
          On iOS · {waitlistCount.toLocaleString("en-US")} already sliding
        </p>
      </section>

      <Philosophy />
      <WhoItsFor />
      <HowItWorks />
      <SocialFeature />
      <ShareAbacus />
      <EarlyAccess />
      <Faq />
    </div>
  );
}
