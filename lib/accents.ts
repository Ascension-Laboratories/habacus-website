// The website's accent is a single gemstone, mirroring the accent the app ships
// with. Every accent-coloured surface reads from the four CSS variables below,
// so swapping a gem is a matter of rewriting them on <html>.

export type AccentName = "citrine" | "ruby" | "sapphire" | "emerald";

export interface Accent {
  name: AccentName;
  label: string;
  /** Base accent. */
  gold: string;
  /** Lifted accent, for text and hovers on the matte-black surfaces. */
  goldBright: string;
  /** Deep accent, for tinted fills and selection. */
  goldDim: string;
  /** Shadowed accent, for the underside of marbles. */
  bronze: string;
  /** Bead fills/glows for the hero abacus, matching the app's dark-theme tokens. */
  bead: {
    pastFill: string;
    pastGlow: string;
    todayFill: string;
    todayGlow: string;
  };
}

export const ACCENTS: Record<AccentName, Accent> = {
  citrine: {
    name: "citrine",
    label: "Citrine",
    gold: "#c9a24b",
    goldBright: "#e8c674",
    goldDim: "#4a4128",
    bronze: "#6b5a2e",
    bead: {
      pastFill: "#C9A24B",
      pastGlow: "#E8C674",
      todayFill: "#DDB86D",
      todayGlow: "#F5D89F",
    },
  },
  ruby: {
    name: "ruby",
    label: "Ruby",
    gold: "#c04a5e",
    goldBright: "#e57085",
    goldDim: "#4a2028",
    bronze: "#6b3038",
    bead: {
      pastFill: "#C04A5E",
      pastGlow: "#E57085",
      todayFill: "#D46375",
      todayGlow: "#F09AAA",
    },
  },
  sapphire: {
    name: "sapphire",
    label: "Sapphire",
    gold: "#4a86c9",
    goldBright: "#7ab4e8",
    goldDim: "#23384a",
    bronze: "#2e4f6b",
    bead: {
      pastFill: "#4A86C9",
      pastGlow: "#7AB4E8",
      todayFill: "#6D9FDD",
      todayGlow: "#A3CBF5",
    },
  },
  emerald: {
    name: "emerald",
    label: "Emerald",
    gold: "#4fb87e",
    goldBright: "#7fd9a4",
    goldDim: "#254a34",
    bronze: "#2e6b47",
    bead: {
      pastFill: "#4FB87E",
      pastGlow: "#7FD9A4",
      todayFill: "#6CCB92",
      todayGlow: "#A5EABF",
    },
  },
};

export const ACCENT_ORDER: AccentName[] = [
  "citrine",
  "ruby",
  "sapphire",
  "emerald",
];

export const DEFAULT_ACCENT: AccentName = "citrine";

export const ACCENT_STORAGE_KEY = "habacus:accent";

export function isAccentName(value: unknown): value is AccentName {
  return typeof value === "string" && value in ACCENTS;
}

/** The CSS custom properties that define an accent, keyed by property name. */
export function accentVars(accent: Accent): Record<string, string> {
  return {
    "--gold": accent.gold,
    "--gold-bright": accent.goldBright,
    "--gold-dim": accent.goldDim,
    "--bronze": accent.bronze,
  };
}

export function applyAccent(name: AccentName) {
  const style = document.documentElement.style;
  const vars = accentVars(ACCENTS[name]);
  for (const [prop, value] of Object.entries(vars)) {
    style.setProperty(prop, value);
  }
  document.documentElement.dataset.accent = name;
}

/**
 * Inline script for the document head: paints the stored accent before first
 * paint so a non-default gem never flashes citrine on load.
 */
export function accentBootstrapScript(): string {
  const map = Object.fromEntries(
    ACCENT_ORDER.map((name) => [name, accentVars(ACCENTS[name])]),
  );
  return `(function(){try{var m=${JSON.stringify(map)},d=${JSON.stringify(
    DEFAULT_ACCENT,
  )},k=localStorage.getItem(${JSON.stringify(
    ACCENT_STORAGE_KEY,
  )});if(!m[k])k=d;var s=document.documentElement.style,v=m[k];for(var p in v)s.setProperty(p,v[p]);document.documentElement.dataset.accent=k}catch(e){}})()`;
}
