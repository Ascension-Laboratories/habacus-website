"use client";

import { useEffect, useRef, useState } from "react";
import { useAccent } from "@/lib/useAccent";
import { ACCENTS, ACCENT_ORDER, type Accent } from "@/lib/accents";
import MarbleGL from "@/components/MarbleGL";

// Per-gem seed/spin variety, using the same formula the abacus assigns its
// beads (lib/marbleShader.ts via Hero3DAbacus's per-bead identity), keyed by
// each gem's fixed position in ACCENT_ORDER instead of a bead index.
function marbleVariety(name: Accent["name"]) {
  const id = ACCENT_ORDER.indexOf(name);
  return {
    seed: [(id * 5.1) % 17, (id * 3.3) % 13] as [number, number],
    spin: 0.35 + (id % 6) * 0.06,
  };
}

export default function AccentSwitcher({ scrolled }: { scrolled: boolean }) {
  const { accent, setAccent } = useAccent();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const expanded = open || hovered;
  const selectedIndex = ACCENT_ORDER.indexOf(accent.name);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative h-[var(--nav-pill-h)] w-[var(--nav-h)] shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        role="group"
        aria-label="Accent colour"
        className={`absolute right-0 top-0 overflow-hidden border p-1 transition-[width,height,border-radius,background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out ${
          expanded || scrolled
            ? "border-border-hairline bg-background/70 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md"
            : "border-transparent bg-transparent shadow-none"
        }`}
        style={{
          // Closed: one marble tall/wide, a perfect circle. Expanded: the
          // padding cancels out to exactly four nav heights (rows have no gap
          // between them, so the stride below stays exact), and the width
          // grows leftward to fit each gem's name. Closed needs the same
          // padding+border cancellation (0.5rem padding + 2px border) so the
          // single visible row's content box is exactly one nav-h square —
          // otherwise the marble sits off-centre in the housing. A fixed
          // radius (not rounded-full) keeps the corners from eating into the
          // first/last row once the panel is nearly square.
          height: expanded
            ? "calc(var(--nav-h) * 4 + 0.5rem)"
            : "var(--nav-pill-h)",
          width: expanded
            ? "calc(var(--nav-h) + 6.48rem)"
            : "var(--nav-pill-h)",
          // A concrete radius (half the closed box, still a perfect circle
          // since it's square) rather than 9999px: browsers clamp
          // border-radius to half the box's shorter side, so animating from
          // an arbitrarily huge value keeps it clamped to that ever-growing
          // max for nearly the whole transition, then snaps to 1.75rem right
          // at the end.
          borderRadius: expanded
            ? "1.75rem"
            : "calc(var(--nav-pill-h) / 2)",
        }}
      >
        <div
          className="flex flex-col transition-transform duration-300 ease-out"
          style={{
            // Rows are un-gapped, so the stride between marbles is exactly one
            // nav height — scrolling the selected gem into the single visible
            // slot is one exact multiple of it.
            transform: expanded
              ? "translateY(0)"
              : `translateY(calc(var(--nav-h) * -${selectedIndex}))`,
          }}
        >
          {ACCENT_ORDER.map((name) => {
            const gem = ACCENTS[name];
            const isSelected = name === accent.name;
            const hidden = !expanded && !isSelected;

            return (
              <button
                key={name}
                type="button"
                inert={hidden}
                aria-hidden={hidden}
                aria-expanded={isSelected ? expanded : undefined}
                aria-pressed={expanded ? isSelected : undefined}
                aria-label={
                  expanded
                    ? `${gem.label} accent`
                    : `Change accent colour, currently ${gem.label}`
                }
                onClick={() => {
                  if (!expanded) {
                    setOpen(true);
                    return;
                  }
                  setAccent(name);
                  setOpen(false);
                }}
                className={`flex w-full shrink-0 cursor-pointer items-center justify-end gap-3 rounded-full transition-[opacity] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                  expanded && !isSelected ? "opacity-70 hover:opacity-100" : ""
                }`}
              >
                <span
                  className={`font-eyebrow whitespace-nowrap text-[13px] uppercase tracking-[0.14em] text-foreground transition-opacity duration-300 ${
                    expanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {gem.label}
                </span>
                <span className="flex aspect-square w-[var(--nav-h)] shrink-0 items-center justify-center transition-transform duration-300 hover:scale-[1.06]">
                  <MarbleGL accent={gem} className="w-[70%]" {...marbleVariety(name)} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
