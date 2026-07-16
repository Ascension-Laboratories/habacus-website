// Share-card export for the hero abacus. Hero3DAbacus registers a snapshotter
// that draws its current scene and reads the pixels back in the same task
// (no preserveDrawingBuffer, no extra per-frame cost); composeAbacusCard()
// lays that snapshot onto a captioned story card using the site's own tokens
// and fonts so the export reads as the same object as the page.

export interface AbacusSnapshot {
  /** Straight-alpha RGBA, top row first — ready for ImageData. */
  pixels: Uint8ClampedArray<ArrayBuffer>;
  width: number;
  height: number;
}

let snapshotter: (() => AbacusSnapshot | null) | null = null;

export function registerAbacusSnapshotter(
  fn: () => AbacusSnapshot | null,
): () => void {
  snapshotter = fn;
  return () => {
    if (snapshotter === fn) snapshotter = null;
  };
}

// 4:5 portrait — sits well in both stories and feeds.
const CARD_W = 1080;
const CARD_H = 1350;

function cssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export async function composeAbacusCard(
  gemLabel: string,
): Promise<Blob | null> {
  const snapshot = snapshotter?.();
  if (!snapshot) return null;

  const background = cssVar("--background", "#0c0a08");
  const foreground = cssVar("--foreground", "#f2efe9");
  const muted = cssVar("--foreground-muted", "#aaa294");
  const gold = cssVar("--gold", "#c9a24b");
  const displayFont = cssVar("--font-dm-serif-display", "serif");
  const serifFont = cssVar("--font-source-serif-4", "serif");
  const monoFont = cssVar("--font-dm-mono", "monospace");

  // Canvas text doesn't trigger font loading the way the DOM does, so ask for
  // the faces explicitly before drawing (best-effort; fallbacks still render).
  try {
    await Promise.all([
      document.fonts.load(`96px ${displayFont}`),
      document.fonts.load(`44px ${serifFont}`),
      document.fonts.load(`30px ${monoFont}`),
    ]);
  } catch {
    // Font loading is a nicety; the card is still valid without it.
  }

  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Matte base + a soft accent glow behind the abacus.
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  const glow = ctx.createRadialGradient(
    CARD_W / 2,
    CARD_H * 0.52,
    60,
    CARD_W / 2,
    CARD_H * 0.52,
    640,
  );
  glow.addColorStop(0, withAlpha(gold, 0.14));
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Hairline frame, matching the site's panel treatment.
  ctx.strokeStyle = withAlpha(foreground, 0.14);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(28, 28, CARD_W - 56, CARD_H - 56, 44);
  ctx.stroke();

  // The abacus itself, centred; only a slight upscale from device pixels.
  const abacus = document.createElement("canvas");
  abacus.width = snapshot.width;
  abacus.height = snapshot.height;
  abacus
    .getContext("2d")
    ?.putImageData(
      new ImageData(snapshot.pixels, snapshot.width, snapshot.height),
      0,
      0,
    );
  const targetW = Math.min(780, CARD_W - 240);
  const targetH = (snapshot.height / snapshot.width) * targetW;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    abacus,
    (CARD_W - targetW) / 2,
    CARD_H * 0.52 - targetH / 2,
    targetW,
    targetH,
  );

  // Wordmark and caption.
  ctx.textAlign = "center";
  ctx.fillStyle = foreground;
  ctx.font = `96px ${displayFont}`;
  ctx.fillText("habacus", CARD_W / 2, 208);

  ctx.fillStyle = muted;
  ctx.font = `44px ${serifFont}`;
  ctx.fillText("Make your habits count.", CARD_W / 2, CARD_H - 200);

  ctx.fillStyle = gold;
  ctx.font = `30px ${monoFont}`;
  ctx.fillText(
    `${gemLabel} · habacus.app`.toLowerCase(),
    CARD_W / 2,
    CARD_H - 128,
  );

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
