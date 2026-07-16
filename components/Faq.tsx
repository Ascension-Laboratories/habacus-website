"use client";

import { useId, useState } from "react";
import Reveal from "@/components/Reveal";

const FAQS = [
  {
    q: "What does Habacus cost?",
    a: "Habacus is free to start. We’ll share more on pricing closer to launch.",
  },
  {
    q: "When can I get in?",
    a: "We let people in a group at a time. Join the list and we’ll be in contact when a seat’s available.",
  },
  {
    q: "Can I choose what my friends see?",
    a: "Yes. You set the visibility on every habit, friend by friend. Share your training and keep the rest to yourself.",
  },
  {
    q: "Is my data private?",
    a: "Your habits are yours. You decide what’s shared and with whom, and the default is private.",
  },
  {
    q: "Is there an Android version?",
    a: "Habacus starts on iOS. Android is on the map.",
  },
  {
    q: "What if I miss a day?",
    a: "Your week keeps its shape and the bead waits for you. Streaks are there if you want them, tucked away if you don’t.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section
      id="faq"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10"
    >
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
            Questions
          </p>
          <h2 className="font-display mt-4 text-4xl leading-tight text-foreground">
            Asked, answered.
          </h2>
        </Reveal>

        <div className="md:col-span-7 md:col-start-6">
          <ul className="divide-y divide-border-hairline border-y border-border-hairline">
            {FAQS.map((faq, i) => {
              const open = openIndex === i;
              const headerId = `${baseId}-q${i}`;
              const panelId = `${baseId}-a${i}`;
              return (
                <Reveal as="li" key={faq.q} delayMs={i * 60}>
                  <h3>
                    <button
                      type="button"
                      id={headerId}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? null : i)}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                    >
                      <span className="font-serif text-lg text-foreground">
                        {faq.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`shrink-0 font-mono text-xl leading-none text-gold transition-transform duration-300 ${
                          open ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                  </h3>
                  {/* 0fr -> 1fr grid rows animate the fold without measuring. */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headerId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-lg pb-5 text-sm leading-relaxed text-foreground-muted">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
