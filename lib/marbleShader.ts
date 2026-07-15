// The gemstone bead shader, factored out of components/Hero3DAbacus.tsx so
// components/MarbleGL.tsx can render the exact same marble (not an
// approximation of it) anywhere in the site.

export function hexToRgb01(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// hash/noise/fbm3 + the marble() bead shader itself, ported verbatim from
// the app's marbleShader.ts SkSL runtime effect.
export const MARBLE_CORE_GLSL = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm3(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

// marble/gemstone bead (ported from marbleShader.ts), premultiplied result
vec4 marble(vec2 fc, vec2 center, float radius, float time,
            vec3 color, vec2 seed, float stony) {
  vec2 uv = (fc - center) / radius;
  float r2 = dot(uv, uv);
  if (r2 > 1.0) return vec4(0.0);
  float z = sqrt(1.0 - r2);
  vec3 N = vec3(uv.x, -uv.y, z);
  vec3 L = normalize(vec3(-0.45, 0.55, 0.75));
  float ndl = dot(N, L);
  float diff = pow(ndl * 0.5 + 0.5, 1.2);
  float lon = asin(clamp(N.x, -1.0, 1.0));
  float lat = atan(N.y, N.z) + time;
  float shadeMod; float spec; float amb; float dmul;
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 Hh = normalize(L + V);
  float ndh = max(dot(N, Hh), 0.0);
  if (stony > 0.5) {
    vec2 p = vec2(lon, lat) * 2.6 + seed;
    float cells = hash(floor(p * 3.2));
    float fine = fbm3(p * 5.0);
    float grain = mix(cells, fine, 0.45);
    shadeMod = mix(0.68, 1.12, grain);
    spec = pow(ndh, 4.0) * 0.05; amb = 0.36; dmul = 0.50;
  } else {
    vec2 p = vec2(lon, lat) * 1.3 + seed;
    vec2 q = vec2(fbm3(p), fbm3(p + vec2(2.7, 1.3)));
    vec2 warp = p + 2.2 * q;
    float turb = fbm3(warp) - 0.5;
    float m = 0.5 + 0.5 * sin((warp.x + warp.y * 0.5 + turb * 3.0) * 4.2);
    float veins = smoothstep(0.30, 0.55, m);
    shadeMod = mix(0.70, 1.30, veins);
    spec = pow(ndh, 6.0) * 0.28 + pow(ndh, 22.0) * 0.50;
    amb = 0.28; dmul = 0.58;
  }
  vec3 base = color * shadeMod;
  vec3 col = base * (amb + dmul * diff);
  col += vec3(spec);
  float fres = pow(1.0 - z, 3.0);
  float fresTint = stony > 0.5 ? 0.22 : 0.55;
  float fresLift = stony > 0.5 ? 0.04 : 0.12;
  col += color * fres * fresTint + vec3(fres * fresLift);
  col = clamp(col, 0.0, 1.0);
  float aa = smoothstep(1.0, 0.94, r2);
  return vec4(col * aa, aa);
}
`;

export function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
) {
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
