"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { useAccent } from "@/lib/useAccent";
import { composeAbacusCard } from "@/lib/abacusExport";

export default function ShareAbacus() {
  const { accent } = useAccent();
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");

  async function handleShare() {
    if (status === "working") return;
    setStatus("working");
    try {
      const blob = await composeAbacusCard(accent.label);
      if (!blob) throw new Error("abacus snapshot unavailable");

      const file = new File([blob], `habacus-${accent.name}.png`, {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Habacus" });
        } catch {
          // Visitor dismissed the share sheet — nothing to recover from.
        }
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      }
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="share" className="mx-auto max-w-6xl px-6 py-28 sm:px-10">
      <Reveal>
        <div className="grain relative overflow-hidden rounded-[var(--radius-lg)] border border-border-hairline bg-background-panel px-8 py-12 sm:px-14 sm:py-16">
          {/* accent wash behind the plaque */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 90% at 85% 20%, color-mix(in srgb, var(--gold) 9%, transparent), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
            <div className="max-w-md">
              <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
                Show it off
              </p>
              <h2 className="font-display mt-4 text-3xl leading-tight text-balance text-foreground sm:text-4xl">
                An abacus worth showing off.
              </h2>
              <p className="font-serif mt-5 text-lg leading-relaxed text-foreground-muted">
                Pick your gemstone, watch your week fill in, and drop it
                straight to your story.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <button
                type="button"
                onClick={handleShare}
                disabled={status === "working"}
                className="rounded-full bg-gold px-8 py-3.5 font-eyebrow text-sm uppercase tracking-[0.1em] text-white transition-colors hover:bg-gold-bright hover:[text-shadow:0_0_0.6px_currentColor,0_0_0.6px_currentColor] disabled:cursor-wait disabled:opacity-60"
              >
                {status === "working" ? "Polishing…" : "Share your abacus"}
              </button>
              <p className="font-mono text-xs text-foreground-faint">
                {status === "error"
                  ? "The abacus is still warming up. Try again in a moment."
                  : "Saved as an image, sized for your story."}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
