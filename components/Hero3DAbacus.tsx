"use client";

import { useEffect, useRef, useState } from "react";
import { useAccent } from "@/lib/useAccent";
import type { Accent } from "@/lib/accents";
import { MARBLE_CORE_GLSL, hexToRgb01 } from "@/lib/marbleShader";

// -----------------------------------------------------------------------------
// A faithful web port of the app's Skia abacus (components/Abacus.tsx). Both the
// marble/gemstone bead shader and the procedural material frame shader are
// translated from the app's SkSL runtime effects into a single WebGL2 fragment
// shader, and the scene uses the app's exact geometry: horizontal per-habit
// rods, an enclosed material frame ring, thin row dividers, a sliding separator
// per wire, and marble beads packed left (misses) / right (completed) of the
// separator over a rolling 7-day window. Layout, constants and the dark-theme
// palette are copied from the app so the two read as the same object.
// -----------------------------------------------------------------------------

// --- geometry (identical to app/components/Abacus.tsx) -----------------------
const SLOTS = 7;
const CELLS = SLOTS + 1;
const BEAD_R = 13;
const BEAD_SPACING = 30;
const EDGE_W = 16;
const ROD_OVERHANG = 3;
const BAR_H = 16;
const ROW_SEP_H = 8;
const ROD_W = 5;
const ROW_HEIGHT = 2 * BEAD_R + 19; // 45
const SEP_H = ROW_HEIGHT + 2 * ROW_SEP_H; // 61

const cellCenter = (i: number) => EDGE_W + BEAD_SPACING / 2 + i * BEAD_SPACING;
const W = EDGE_W + CELLS * BEAD_SPACING + EDGE_W; // 272
const rowTop = (i: number) => BAR_H + i * (ROW_HEIGHT + ROW_SEP_H);
const rowCy = (i: number) => rowTop(i) + ROW_HEIGHT / 2;

// Display scale + left gutter for the habit-icon column (as in the app).
const SCALE = 1.28;
const ICON_WIDTH = 34;

// --- palette (app dark theme, selected gem accent + stone frame) -------------
// Bead tokens (tamagui.config.ts, dark theme). Only the completed beads carry
// the accent; misses are stone and today's miss pulses white in every gem.
const beadPalette = (accent: Accent) =>
  ({
    completedPast: {
      fill: accent.bead.pastFill,
      glow: accent.bead.pastGlow,
      flag: 0,
    },
    completedToday: {
      fill: accent.bead.todayFill,
      glow: accent.bead.todayGlow,
      flag: 1,
    },
    incompletePast: { fill: "#232326", glow: "#232326", flag: -1 }, // stony
    incompleteToday: { fill: "#FFFFFF", glow: "#FFFFFF", flag: 2 }, // pulsing white
  }) as const;

type BeadState = keyof ReturnType<typeof beadPalette>;

// --- colour helpers (ported from app/lib/color.ts) ---------------------------
function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return { h, s, l };
}
function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
function shiftLightness(hex: string, delta: number): string {
  const { h, s, l } = rgbToHsl(...toRgb(hex));
  return hslToHex(h, s, clamp01(l + delta));
}

// --- stone material (app default: derived from frame token, dark theme) ------
// lib/frames.ts frameStyle("stone", frame, frameStrong) with dark theme tokens.
const FRAME_HEX = "#3A3A40";
const FRAME_STRONG_HEX = "#5C5C64";
const STONE = {
  light: shiftLightness(FRAME_HEX, 0.14),
  base: FRAME_HEX,
  dark: shiftLightness(FRAME_HEX, -0.16),
  rod: FRAME_STRONG_HEX,
  sheen: 0,
  finish: 0, // stone
  grain: 1.0,
  seed: [6.4, 9.1] as [number, number],
};
const ROD_LIGHT = shiftLightness(STONE.rod, 0.12);
const ROD_BASE = STONE.rod;
const ROD_DARK = shiftLightness(STONE.rod, -0.14);

// --- decorative but structurally-real per-row data ---------------------------
// Completion of the last 7 days (oldest -> today); index 6 is "today". Mirrors
// the app's gravity rule via the same packing algorithm below.
const ROWS_DONE: boolean[][] = [
  [true, true, false, true, true, true, true], //   1 miss,  today done
  [true, false, true, true, false, true, false], // 3 misses, today miss
  [true, true, false, true, true, true, false], //  2 misses, today miss
];
const ICONS = ["\u{1F3C3}", "\u{1F4A7}", "\u{1F319}"];
const NUM_ROWS = ROWS_DONE.length;
const H = BAR_H * 2 + NUM_ROWS * ROW_HEIGHT + (NUM_ROWS - 1) * ROW_SEP_H;

interface BeadAttr {
  x: number;
  cy: number;
  fill: [number, number, number];
  glow: [number, number, number];
  flag: number;
  seed: [number, number];
  spin: number;
}
// Beads are keyed by a stable identity (row * SLOTS + dayIdx) rather than
// array position, so a click that reshuffles the miss/complete split can be
// interpolated bead-for-bead instead of snapping.
type SceneMap = Map<number, BeadAttr>;

const IDENTITIES: number[] = [];
for (let r = 0; r < NUM_ROWS; r++)
  for (let d = 0; d < SLOTS; d++) IDENTITIES.push(r * SLOTS + d);

function computeBeadTargets(accent: Accent, rowsDone: boolean[][]) {
  const BEAD = beadPalette(accent);
  const targets: SceneMap = new Map();
  const seps: { x: number; cy: number }[] = [];

  rowsDone.forEach((week, row) => {
    const cy = rowCy(row);
    const done: number[] = [];
    const notDone: number[] = [];
    week.forEach((d, idx) => (d ? done : notDone).push(idx));
    const misses = notDone.length;
    seps.push({ x: cellCenter(misses), cy });

    const set = (dayIdx: number, x: number, state: BeadState) => {
      const b = BEAD[state];
      const id = row * SLOTS + dayIdx;
      targets.set(id, {
        x,
        cy,
        fill: hexToRgb01(b.fill),
        glow: hexToRgb01(b.glow),
        flag: b.flag,
        seed: [(id * 5.1) % 17, (id * 3.3) % 13],
        spin: 0.35 + (id % 6) * 0.06,
      });
    };

    // Misses left of the separator (oldest at far left, today nearest it).
    notDone.forEach((idx, j) =>
      set(idx, cellCenter(j), idx === 6 ? "incompleteToday" : "incompletePast"),
    );
    // Completed right of the separator (most-recent nearest it).
    done
      .slice()
      .reverse()
      .forEach((idx, k) =>
        set(
          idx,
          cellCenter(misses + 1 + k),
          idx === 6 ? "completedToday" : "completedPast",
        ),
      );
  });

  return { targets, seps };
}

// Today's bead (dayIdx 6) always sits immediately next to its row's
// separator, so its x position can be derived from the miss count alone.
function todayBeadX(week: boolean[]): number {
  const misses = week.filter((d) => !d).length;
  return week[6] ? cellCenter(misses + 1) : cellCenter(misses - 1);
}

function flattenScene(targets: SceneMap, seps: { x: number; cy: number }[]) {
  const A = new Float32Array(MAX_BEADS * 4);
  const B = new Float32Array(MAX_BEADS * 4);
  const C = new Float32Array(MAX_BEADS * 4);
  IDENTITIES.forEach((id, i) => {
    const b = targets.get(id);
    if (!b) return;
    A.set([b.x, b.cy, b.seed[0], b.seed[1]], i * 4);
    B.set([b.fill[0], b.fill[1], b.fill[2], b.spin], i * 4);
    C.set([b.glow[0], b.glow[1], b.glow[2], b.flag], i * 4);
  });
  const sepArr = new Float32Array(MAX_ROWS * 2);
  seps.forEach((s, i) => {
    sepArr[i * 2] = s.x;
    sepArr[i * 2 + 1] = s.cy;
  });
  return { A, B, C, sepArr };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function interpolateScene(from: SceneMap, to: SceneMap, t: number): SceneMap {
  const out: SceneMap = new Map();
  IDENTITIES.forEach((id) => {
    const a = from.get(id);
    const b = to.get(id);
    if (!a || !b) return;
    out.set(id, {
      x: lerp(a.x, b.x, t),
      cy: lerp(a.cy, b.cy, t),
      fill: lerp3(a.fill, b.fill, t),
      glow: lerp3(a.glow, b.glow, t),
      // Snap the pulse/steady-glow threshold at the midpoint instead of
      // interpolating the flag itself, which the shader branches on.
      flag: t < 0.5 ? a.flag : b.flag,
      seed: b.seed,
      spin: lerp(a.spin, b.spin, t),
    });
  });
  return out;
}

function interpolateSeps(
  from: { x: number; cy: number }[],
  to: { x: number; cy: number }[],
  t: number,
) {
  return from.map((s, i) => ({ x: lerp(s.x, to[i].x, t), cy: s.cy }));
}

// -----------------------------------------------------------------------------
// WebGL2 fragment shader: the whole scene composited back-to-front, porting the
// app's marble + frame runtime effects verbatim.
// -----------------------------------------------------------------------------
const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const MAX_BEADS = 40;
const MAX_ROWS = 6;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 v_uv;

uniform vec2  u_layout;   // W, H (layout units)
uniform float u_px;       // layout units per device pixel (AA width)
uniform float u_time;     // seconds

// material (stone) uniforms
uniform float u_finish;
uniform vec3  u_light;
uniform vec3  u_base;
uniform vec3  u_dark;
uniform float u_sheen;
uniform float u_grain;
uniform vec2  u_seed;
uniform vec3  u_rodLight;
uniform vec3  u_rodBase;
uniform vec3  u_rodDark;

uniform int   u_numRows;
uniform int   u_numSeps;
uniform vec2  u_sep[${MAX_ROWS}];     // (x, cy) of each sliding separator
uniform int   u_numBeads;
uniform vec4  u_beadA[${MAX_BEADS}];  // (x, cy, seedX, seedY)
uniform vec4  u_beadB[${MAX_BEADS}];  // (fillR, fillG, fillB, spin)
uniform vec4  u_beadC[${MAX_BEADS}];  // (glowR, glowG, glowB, flag)

// geometry constants (match app)
const float EDGE_W = ${EDGE_W.toFixed(1)};
const float BAR_H = ${BAR_H.toFixed(1)};
const float ROW_SEP_H = ${ROW_SEP_H.toFixed(1)};
const float ROD_W = ${ROD_W.toFixed(1)};
const float ROD_OVERHANG = ${ROD_OVERHANG.toFixed(1)};
const float ROW_HEIGHT = ${ROW_HEIGHT.toFixed(1)};
const float SEP_H = ${SEP_H.toFixed(1)};
const float BEAD_R = ${BEAD_R.toFixed(1)};
const float PI = 3.14159265;

${MARBLE_CORE_GLSL}

float fbm4(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

// three-stop material ramp
vec3 ramp(float g) {
  g = clamp(g, 0.0, 1.0);
  return g < 0.5 ? mix(u_light, u_base, g * 2.0)
                 : mix(u_base, u_dark, (g - 0.5) * 2.0);
}

// procedural material shade for a frame piece (ported from frameShader.ts)
vec3 frameShade(vec2 fc, vec4 outer, vec4 inner, float vertical) {
  vec2 o = outer.xy;
  vec2 s = outer.zw;
  bool ring = inner.z > 0.0;
  float an;
  if (ring) {
    float dOut = min(min(fc.x - o.x, o.x + s.x - fc.x),
                     min(fc.y - o.y, o.y + s.y - fc.y));
    vec2 ihalf = inner.zw * 0.5;
    vec2 q = abs(fc - (inner.xy + ihalf)) - ihalf;
    float dIn = length(max(q, vec2(0.0)));
    an = clamp(dOut / max(dOut + dIn, 1.0), 0.0, 1.0);
  } else if (vertical > 0.5) {
    an = (fc.x - o.x) / max(s.x, 1.0);
  } else {
    an = (fc.y - o.y) / max(s.y, 1.0);
  }
  float g = an;
  vec3 col;
  vec2 tp = fc + u_seed * 37.0;
  if (u_finish < 0.5) {
    float grit = fbm4(tp * 0.6);
    float fine = fbm4(tp * 2.3 + 11.3);
    float poreField = fbm4(tp * 0.22 + 24.7);
    float pores = smoothstep(0.60, 0.66, poreField);
    col = ramp(g);
    col *= mix(0.92, 1.06, grit);
    col *= 0.97 + 0.05 * fine;
    col *= 1.0 - pores * 0.30;
  } else if (u_finish < 1.5) {
    float wob = fbm4(tp * 0.03);
    float bands = 0.5 + 0.5 * sin(an * 22.0 + wob * 7.0);
    bands = pow(bands, 1.7);
    float fibre = fbm4(tp * 0.5 + 6.1);
    float grain = bands * 0.72 + fibre * 0.28;
    col = ramp(g);
    col *= mix(1.0 - 0.14 * u_grain, 1.0 + 0.05 * u_grain, grain);
  } else if (u_finish < 2.5) {
    col = ramp(pow(g, 1.25));
    float hi = smoothstep(0.16, 0.06, abs(an - 0.14));
    float hi2 = smoothstep(0.10, 0.03, abs(an - 0.42)) * 0.45;
    float shade = smoothstep(0.70, 1.0, an);
    col += (hi + hi2) * u_light * (0.6 + u_sheen);
    col *= 1.0 - shade * 0.22;
  } else if (u_finish < 3.5) {
    float lines = fbm4(vec2(an * 30.0, (fc.x + fc.y) * 0.02 + u_seed.x));
    float streak = fbm4(tp * 0.06);
    float brush = lines * 0.62 + streak * 0.38;
    col = ramp(g);
    col *= mix(0.90, 1.10, brush);
    float sheenLine = smoothstep(0.32, 0.0, abs(an - 0.20));
    col += sheenLine * u_light * u_sheen * 0.5;
  } else {
    float grit = fbm4(tp * 0.55);
    float flecks = fbm4(tp * 1.4 + 31.9);
    float spark = smoothstep(0.72, 0.82, flecks);
    float darkMin = smoothstep(0.30, 0.22, grit);
    col = ramp(g);
    col *= mix(0.82, 1.14, grit);
    col += spark * (u_light * 0.55 + 0.14);
    col *= 1.0 - darkMin * 0.28;
    float sheenLine = smoothstep(0.30, 0.0, abs(an - 0.16));
    col += sheenLine * u_light * u_sheen * 0.4;
  }
  return clamp(col, 0.0, 1.0);
}

// simple lit gradient for the thin rods (ported from Bar3D rod branch)
vec3 rodShade(vec2 fc, vec4 rect) {
  float t = clamp((fc.y - rect.y) / max(rect.w, 1.0), 0.0, 1.0);
  return t < 0.5 ? mix(u_rodLight, u_rodBase, t * 2.0)
                 : mix(u_rodBase, u_rodDark, (t - 0.5) * 2.0);
}

// signed distance to a rounded box
float sdRoundRect(vec2 fc, vec4 rect, float r) {
  vec2 halfSize = rect.zw * 0.5;
  vec2 p = fc - (rect.xy + halfSize);
  vec2 d = abs(p) - halfSize + vec2(r);
  return min(max(d.x, d.y), 0.0) + length(max(d, vec2(0.0))) - r;
}
float cov(float sd) { return smoothstep(u_px, -u_px, sd); }

// straight-alpha "over"
vec4 over(vec4 dst, vec3 rgb, float a) {
  return vec4(rgb * a + dst.rgb * (1.0 - a), a + dst.a * (1.0 - a));
}
// premultiplied "over"
vec4 overP(vec4 dst, vec4 src) {
  return vec4(src.rgb + dst.rgb * (1.0 - src.a), src.a + dst.a * (1.0 - src.a));
}

float rowCyF(int i) {
  return BAR_H + float(i) * (ROW_HEIGHT + ROW_SEP_H) + ROW_HEIGHT * 0.5;
}
float rowTopF(int i) { return BAR_H + float(i) * (ROW_HEIGHT + ROW_SEP_H); }

void main() {
  float Wv = u_layout.x;
  float Hv = u_layout.y;
  vec2 fc = vec2(v_uv.x * Wv, (1.0 - v_uv.y) * Hv);

  vec4 outc = vec4(0.0);

  // 1) rods (behind everything)
  for (int i = 0; i < ${MAX_ROWS}; i++) {
    if (i >= u_numRows) break;
    vec4 rect = vec4(ROD_OVERHANG, rowCyF(i) - ROD_W * 0.5,
                     Wv - 2.0 * ROD_OVERHANG, ROD_W);
    float c = cov(sdRoundRect(fc, rect, ROD_W * 0.5));
    if (c > 0.001) outc = over(outc, rodShade(fc, rect), c);
  }

  // 2) sliding separators (per wire)
  for (int i = 0; i < ${MAX_ROWS}; i++) {
    if (i >= u_numSeps) break;
    vec2 sp = u_sep[i];
    vec4 rect = vec4(sp.x - EDGE_W * 0.5, sp.y - SEP_H * 0.5, EDGE_W, SEP_H);
    float c = cov(sdRoundRect(fc, rect, EDGE_W * 0.5));
    if (c > 0.001) outc = over(outc, frameShade(fc, rect, vec4(0.0), 1.0), c);
  }

  // 3) thin row dividers (drawn over the separators)
  for (int i = 1; i < ${MAX_ROWS}; i++) {
    if (i >= u_numRows) break;
    vec4 rect = vec4(0.0, rowTopF(i) - ROW_SEP_H, Wv, ROW_SEP_H);
    float c = cov(sdRoundRect(fc, rect, 4.0));
    if (c > 0.001) outc = over(outc, frameShade(fc, rect, vec4(0.0), 0.0), c);
  }

  // 4) outer enclosure ring (caps everything)
  {
    vec4 outer = vec4(0.0, 0.0, Wv, Hv);
    vec4 inner = vec4(EDGE_W, BAR_H, Wv - 2.0 * EDGE_W, Hv - 2.0 * BAR_H);
    float aOuter = cov(sdRoundRect(fc, outer, 4.0));
    float aInner = cov(sdRoundRect(fc, inner, 4.0));
    float ringCov = aOuter * (1.0 - aInner);
    if (ringCov > 0.001)
      outc = over(outc, frameShade(fc, outer, inner, 0.0), ringCov);
  }

  // 5) beads (glow, then marble) on top
  for (int i = 0; i < ${MAX_BEADS}; i++) {
    if (i >= u_numBeads) break;
    vec4 A = u_beadA[i];
    vec4 B = u_beadB[i];
    vec4 C = u_beadC[i];
    vec2 center = A.xy;
    float flag = C.w;

    // today glow (steady for completed, pulsing for the actionable white bead)
    if (flag > 0.5) {
      bool pulse = flag > 1.5;
      float glowR = pulse ? BEAD_R * 1.3 : BEAD_R * 1.4;
      float op = pulse ? (0.15 + (0.5 + 0.5 * sin(u_time * PI)) * 0.4) : 0.22;
      float d = length(fc - center);
      float gc = smoothstep(glowR, glowR * 0.55, d) * op;
      if (gc > 0.001) outc = over(outc, C.xyz, gc);
    }

    float stony = flag < -0.5 ? 1.0 : 0.0;
    float t = stony > 0.5 ? 0.0 : u_time * B.w;
    vec4 m = marble(fc, center, BEAD_R - 0.5, t, B.xyz, A.zw, stony);
    if (m.a > 0.001) outc = overP(outc, m);
  }

  fragColor = outc;
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error("shader compile failed: " + log);
  }
  return sh;
}

export default function Hero3DAbacus() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { accent } = useAccent();

  // Completion state for the rolling 7-day window; index 6 of each row is
  // "today" and is the only bead the user can toggle by clicking.
  const [rowsDone, setRowsDone] = useState<boolean[][]>(() =>
    ROWS_DONE.map((week) => [...week]),
  );

  // The settled scene and an in-flight transition between two settled scenes.
  // Both are plain refs (not state) because the render loop below reads them
  // every frame without needing a React re-render.
  const sceneRef = useRef<{
    targets: SceneMap;
    seps: { x: number; cy: number }[];
  } | null>(null);
  const animRef = useRef<{
    from: SceneMap;
    fromSeps: { x: number; cy: number }[];
    to: SceneMap;
    toSeps: { x: number; cy: number }[];
    start: number;
  } | null>(null);

  const reduce =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // One-time WebGL setup. The render loop pulls bead/separator data from
  // sceneRef/animRef every frame, so toggling completion never requires
  // recompiling the shader program.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    if (!gl) return;

    let program: WebGLProgram;
    try {
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "link failed");
      }
    } catch (e) {
      console.error("[Hero3DAbacus]", e);
      return;
    }
    gl.useProgram(program);

    // fullscreen triangle
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);

    // static uniforms
    gl.uniform2f(u("u_layout"), W, H);
    gl.uniform1f(u("u_finish"), STONE.finish);
    gl.uniform3fv(u("u_light"), hexToRgb01(STONE.light));
    gl.uniform3fv(u("u_base"), hexToRgb01(STONE.base));
    gl.uniform3fv(u("u_dark"), hexToRgb01(STONE.dark));
    gl.uniform1f(u("u_sheen"), STONE.sheen);
    gl.uniform1f(u("u_grain"), STONE.grain);
    gl.uniform2fv(u("u_seed"), STONE.seed);
    gl.uniform3fv(u("u_rodLight"), hexToRgb01(ROD_LIGHT));
    gl.uniform3fv(u("u_rodBase"), hexToRgb01(ROD_BASE));
    gl.uniform3fv(u("u_rodDark"), hexToRgb01(ROD_DARK));
    gl.uniform1i(u("u_numRows"), NUM_ROWS);
    gl.uniform1i(u("u_numSeps"), NUM_ROWS);
    gl.uniform1i(u("u_numBeads"), IDENTITIES.length);

    const uBeadA = u("u_beadA[0]");
    const uBeadB = u("u_beadB[0]");
    const uBeadC = u("u_beadC[0]");
    const uSep = u("u_sep[0]");
    const uTime = u("u_time");
    const uPx = u("u_px");

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = W * SCALE;
      const cssH = H * SCALE;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uPx, H / canvas.height); // layout units per device pixel
    }
    resize();
    window.addEventListener("resize", resize);

    gl.clearColor(0, 0, 0, 0);

    const TRANSITION_MS = 380;
    let raf = 0;
    const start = performance.now();
    function frame(now: number) {
      if (!gl) return;

      if (animRef.current) {
        const { from, fromSeps, to, toSeps, start: aStart } = animRef.current;
        const rawT = Math.min(1, (now - aStart) / TRANSITION_MS);
        const ease = easeInOutCubic(rawT);
        const targets = interpolateScene(from, to, ease);
        const seps = interpolateSeps(fromSeps, toSeps, ease);
        const { A, B, C, sepArr } = flattenScene(targets, seps);
        gl.uniform4fv(uBeadA, A);
        gl.uniform4fv(uBeadB, B);
        gl.uniform4fv(uBeadC, C);
        gl.uniform2fv(uSep, sepArr);
        if (rawT >= 1) {
          sceneRef.current = { targets: to, seps: toSeps };
          animRef.current = null;
        }
      } else if (sceneRef.current) {
        const { A, B, C, sepArr } = flattenScene(
          sceneRef.current.targets,
          sceneRef.current.seps,
        );
        gl.uniform4fv(uBeadA, A);
        gl.uniform4fv(uBeadB, B);
        gl.uniform4fv(uBeadC, C);
        gl.uniform2fv(uSep, sepArr);
      }

      // Reduced motion freezes the marble spin/pulse but still redraws so
      // clicks (handled via instant scene snaps below) remain visible.
      gl.uniform1f(uTime, reduce ? 6.0 : (now - start) / 1000);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteBuffer(quad);
    };
  }, [reduce]);

  // Recompute bead/separator targets whenever the accent or completion state
  // changes, animating between the previous and new layout (or snapping
  // instantly on first mount / reduced motion).
  useEffect(() => {
    const { targets, seps } = computeBeadTargets(accent, rowsDone);
    if (!sceneRef.current || reduce) {
      sceneRef.current = { targets, seps };
      animRef.current = null;
    } else {
      animRef.current = {
        from: sceneRef.current.targets,
        fromSeps: sceneRef.current.seps,
        to: targets,
        toSeps: seps,
        start: performance.now(),
      };
    }
  }, [accent, rowsDone, reduce]);

  function hitTestTodayBead(clientX: number, clientY: number): number {
    const canvas = canvasRef.current;
    if (!canvas) return -1;
    const rect = canvas.getBoundingClientRect();
    const xLayout = ((clientX - rect.left) / rect.width) * W;
    const yLayout = ((clientY - rect.top) / rect.height) * H;
    const HIT_R = BEAD_R * 1.6;
    let bestRow = -1;
    let bestDist = Infinity;
    rowsDone.forEach((week, row) => {
      const dist = Math.hypot(
        xLayout - todayBeadX(week),
        yLayout - rowCy(row),
      );
      if (dist < bestDist) {
        bestDist = dist;
        bestRow = row;
      }
    });
    return bestDist <= HIT_R ? bestRow : -1;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (animRef.current) return; // let an in-flight slide settle first
    const row = hitTestTodayBead(e.clientX, e.clientY);
    if (row === -1) return;
    setRowsDone((prev) =>
      prev.map((week, i) =>
        i === row ? week.map((d, di) => (di === 6 ? !d : d)) : week,
      ),
    );
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hittable =
      !animRef.current && hitTestTodayBead(e.clientX, e.clientY) !== -1;
    canvas.style.cursor = hittable ? "pointer" : "default";
  }

  return (
    <div className="relative mx-auto h-[340px] w-full max-w-2xl select-none sm:h-[380px]">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: W * SCALE, height: H * SCALE }}
      >
        {/* habit-icon gutter, floated to the left of the frame (as in the app) */}
        <div
          className="pointer-events-none absolute"
          style={{ left: -(ICON_WIDTH + 6) * SCALE, top: 0, height: H * SCALE }}
        >
          {ICONS.slice(0, NUM_ROWS).map((icon, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center text-base opacity-90"
              style={{
                top: rowCy(i) * SCALE,
                transform: "translateY(-50%)",
                width: ICON_WIDTH * SCALE,
              }}
            >
              {icon}
            </div>
          ))}
        </div>
        <canvas
          ref={canvasRef}
          className="block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        />
      </div>

      {/* soft ground glow, matching the accent */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--gold) 18%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
