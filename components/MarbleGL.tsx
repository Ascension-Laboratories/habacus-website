"use client";

import { useEffect, useRef } from "react";
import type { Accent } from "@/lib/accents";
import { MARBLE_CORE_GLSL, compileShader, hexToRgb01 } from "@/lib/marbleShader";

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 v_uv;

uniform vec2 u_size;
uniform float u_time;
uniform vec3 u_color;
uniform vec2 u_seed;
uniform float u_spin;

${MARBLE_CORE_GLSL}

void main() {
  vec2 fc = vec2(v_uv.x * u_size.x, (1.0 - v_uv.y) * u_size.y);
  vec2 center = u_size * 0.5;
  float radius = min(u_size.x, u_size.y) * 0.5 * 0.98;
  fragColor = marble(fc, center, radius, u_time * u_spin, u_color, u_seed, 0.0);
}`;

/**
 * A single gemstone bead, rendered with the exact WebGL2 shader the hero
 * abacus uses for its marbles (lib/marbleShader.ts, shared with
 * components/Hero3DAbacus.tsx) so the two read as the same object rather
 * than a CSS lookalike.
 */
export default function MarbleGL({
  accent,
  className = "w-full",
  seed = [6.4, 9.1],
  spin = 0.4,
}: {
  accent: Accent;
  className?: string;
  seed?: [number, number];
  spin?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
      program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "link failed");
      }
    } catch (e) {
      console.error("[MarbleGL]", e);
      return;
    }
    gl.useProgram(program);

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
    const uSize = u("u_size");
    const uTime = u("u_time");
    const uSeed = u("u_seed");
    const uSpin = u("u_spin");
    const uColor = u("u_color");

    gl.uniform2fv(uSeed, seed);
    gl.uniform1f(uSpin, spin);
    gl.uniform3fv(uColor, hexToRgb01(accent.bead.todayFill));

    function resize() {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uSize, canvas.width, canvas.height);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    gl.clearColor(0, 0, 0, 0);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const start = performance.now();
    function frame(now: number) {
      if (!gl) return;
      const t = (now - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    if (reduce) {
      gl.uniform1f(uTime, 6.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(quad);
    };
    // Rebuilding on accent change re-uploads the bead colour; the shader has
    // no path to re-read it otherwise (mirrors Hero3DAbacus).
  }, [accent, seed, spin]);

  return (
    <span className={`relative block aspect-square overflow-hidden rounded-full ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </span>
  );
}
