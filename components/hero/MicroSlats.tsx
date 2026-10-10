"use client";

/**
 * Micro Slats background, adapted from React Bits
 * (https://www.reactbits.dev/backgrounds/micro-slats, src/ts-tailwind/Backgrounds/MicroSlats).
 *
 * Copyright (c) 2026 David Haz. Used under the MIT + Commons Clause licence, which
 * permits use as part of a website and requires this notice to be kept:
 * https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
 *
 * Changes from the original, for a decorative hero background:
 * - Removed the cursor fluid simulation, pointer listeners, and slat lean. The
 *   background never reacts to input, so clicks on the video and buttons cost
 *   nothing here and no float render targets are allocated.
 * - Lower pixel budget and a 1.5 device-pixel-ratio cap for mobile GPUs.
 * - Calls `onUnsupported` when WebGL2 is unavailable so the caller can hide it.
 * The wave field and slat shaders, presets, intro sweep, reduced-motion freeze,
 * and off-screen pause are unchanged.
 */

import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { Mesh, Program, RenderTarget, Renderer, Triangle } from "ogl";

type SwellPreset = "swell" | "tide" | "storm" | "signal";
type Rgba = [number, number, number, number];

interface WaveValues {
  scale: number;
  speed: number;
  direction: number;
  chop: number;
  stretch: number;
  glint: number;
  contrast: number;
  perspective: number;
  fog: number;
}

export interface MicroSlatsProps extends Partial<WaveValues> {
  preset?: SwellPreset;
  color?: string;
  glintColor?: string;
  backgroundColor?: string;
  slatWidth?: number;
  slatHeight?: number;
  gap?: number;
  roundness?: number;
  intro?: boolean;
  introDuration?: number;
  paused?: boolean;
  onUnsupported?: () => void;
  className?: string;
  style?: CSSProperties;
}

interface Settings extends WaveValues {
  color: Rgba;
  glintColor: Rgba;
  backgroundColor: Rgba;
  slatWidth: number;
  slatHeight: number;
  gap: number;
  roundness: number;
  intro: boolean;
  introDuration: number;
  paused: boolean;
}

const SWELL_PRESETS: Record<SwellPreset, WaveValues> = {
  swell: { scale: 1.5, speed: 0.6, direction: 250, chop: 0.55, stretch: 0, glint: 0.7, contrast: 1.25, perspective: 0.55, fog: 0.55 },
  tide: { scale: 1.3, speed: 0.5, direction: 262, chop: 0.2, stretch: 0.12, glint: 0.45, contrast: 1.1, perspective: 0.5, fog: 0.4 },
  storm: { scale: 0.55, speed: 1.6, direction: 236, chop: 1, stretch: 0.3, glint: 1.3, contrast: 1.8, perspective: 0.8, fog: 0.35 },
  signal: { scale: 0.85, speed: 1.2, direction: 180, chop: 0.6, stretch: 0.85, glint: 0.25, contrast: 1.2, perspective: 0, fog: 0 },
};

const PIXEL_BUDGET = 2.5e6;
const MAX_DPR = 1.5;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const parseColor = (value: string, fallback: Rgba): Rgba => {
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return fallback;
    ctx.fillStyle = "#000000";
    ctx.fillStyle = value;
    const resolved = ctx.fillStyle;
    if (resolved.startsWith("#")) {
      const n = parseInt(resolved.slice(1), 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
    }
    const parts = resolved.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return fallback;
    return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255, parts[3] ? Number(parts[3]) : 1];
  } catch {
    return fallback;
  }
};

const passVertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// One texel per slat: brightness, length, glint tint.
const fieldFragment = `#version 300 es
precision highp float;
uniform vec2 uSize;
uniform vec4 uGrid;
uniform vec2 uOrigin;
uniform vec2 uSlat;
uniform float uTime;
uniform float uScale;
uniform float uDirection;
uniform float uChop;
uniform float uStretch;
uniform float uGlint;
uniform float uContrast;
uniform float uPerspective;
uniform float uFog;
uniform float uIntro;
out vec4 fragColor;

const float TURN[4] = float[4](0.0, -0.95, 0.78, 1.62);
const float LENGTH[4] = float[4](2.6, 1.7, 1.12, 0.76);
const float HEIGHT[4] = float[4](1.0, 0.75, 0.5, 0.3);
const float SHIFT[4] = float[4](0.0, 2.3, 4.1, 1.1);

void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  float row = uGrid.y - 1.0 - cell.y;
  vec2 center = uOrigin + vec2(cell.x, row) * uGrid.zw + uSlat * 0.5;
  float v = clamp(center.y / uSize.y, 0.0, 1.0);

  float horizon = mix(8.0, 0.5, uPerspective);
  float depth = (1.0 + horizon) / (v + horizon);
  vec2 world = vec2((center.x - uSize.x * 0.5) / uSize.y * depth, (depth - 1.0) * horizon * 2.2);
  world /= max(uScale, 0.05);

  float meander = 0.55 * sin(dot(world, vec2(0.23, 0.41)) * 0.9 + uTime * 0.13)
    + 0.3 * sin(dot(world, vec2(-0.37, 0.19)) * 1.4 - uTime * 0.09);

  float steep = uChop * 0.45;
  float height = 0.0;
  float total = 0.0;
  for (int i = 0; i < 4; i++) {
    float angle = uDirection + TURN[i];
    vec2 heading = vec2(cos(angle), sin(angle));
    float k = 6.2831853 / LENGTH[i];
    float omega = sqrt(9.81 * k) * 0.35;
    float theta = k * dot(world, heading) - omega * uTime + SHIFT[i] + meander * (0.6 + 0.3 * float(i));
    height += HEIGHT[i] * (cos(theta) + steep * cos(2.0 * theta));
    total += HEIGHT[i] * (1.0 + steep);
  }
  float level = clamp(0.5 + 0.5 * height / (total * 0.85), 0.0, 1.0);
  float crest = smoothstep(0.6, 1.0, level);
  float glint = crest * crest * uGlint;

  float haze = mix(1.0, 1.0 - uFog, pow(1.0 - v, 1.4));
  float light = (pow(level, uContrast) + glint * 0.8) * haze;

  float front = uIntro * 1.35;
  float reveal = 1.0 - smoothstep(front - 0.35, front, v);
  float sweep = exp(-pow((v - front + 0.22) / 0.07, 2.0)) * (1.0 - uIntro);
  light = (light + sweep * 0.8) * reveal;
  light = max(light, 0.045 * reveal);
  float span = clamp(mix(1.0 - uStretch, 1.0, level), 0.08, 1.0) * mix(0.1, 1.0, reveal);
  float tint = clamp(glint * 1.4 + sweep, 0.0, 1.0);

  fragColor = vec4(clamp(light, 0.0, 1.0), span, tint, 1.0);
}
`;

// Per pixel: draw the rounded slat of the cell this pixel falls in.
const slatFragment = `#version 300 es
precision highp float;
uniform sampler2D tField;
uniform vec2 uSize;
uniform float uDpr;
uniform vec4 uGrid;
uniform vec2 uOrigin;
uniform vec2 uSlat;
uniform float uRound;
uniform vec3 uColor;
uniform vec3 uGlintColor;
uniform vec4 uBackground;
out vec4 fragColor;

float pill(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 local = p - uOrigin;
  vec2 cell = floor(local / uGrid.zw);
  vec4 background = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  vec4 slat = vec4(0.0);
  if (cell.x >= 0.0 && cell.y >= 0.0 && cell.x < uGrid.x && cell.y < uGrid.y) {
    vec4 field = texelFetch(tField, ivec2(int(cell.x), int(uGrid.y - 1.0 - cell.y)), 0);
    vec2 offset = local - cell * uGrid.zw - uSlat * 0.5;
    vec2 halfSize = vec2(uSlat.x * 0.5, uSlat.y * 0.5 * field.g);
    float radius = uRound * min(halfSize.x, halfSize.y);
    float alpha = clamp(0.5 - pill(offset, halfSize, radius) * uDpr, 0.0, 1.0) * field.r;
    slat = vec4(mix(uColor, uGlintColor, field.b) * alpha, alpha);
  }
  fragColor = slat + background * (1.0 - slat.a);
}
`;

const MicroSlats = ({
  preset = "swell",
  color = "#A855F7",
  glintColor = "#ffffff",
  backgroundColor = "#000000",
  slatWidth = 10,
  slatHeight = 25,
  gap = 3,
  roundness = 0.75,
  scale,
  speed,
  direction,
  chop,
  stretch,
  glint,
  contrast,
  perspective,
  fog,
  intro = true,
  introDuration = 1.5,
  paused = false,
  onUnsupported,
  className = "",
  style,
}: MicroSlatsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<Settings | null>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const unsupportedRef = useRef(onUnsupported);

  const colors = useMemo(
    () => ({
      color: parseColor(color, [0.66, 0.33, 0.97, 1]),
      glintColor: parseColor(glintColor, [1, 1, 1, 1]),
      backgroundColor: parseColor(backgroundColor, [0, 0, 0, 1]),
    }),
    [color, glintColor, backgroundColor],
  );

  // Props flow into the render loop through a ref, so prop changes never rebuild WebGL.
  useEffect(() => {
    const base = SWELL_PRESETS[preset] || SWELL_PRESETS.swell;
    const pick = <K extends keyof WaveValues>(value: WaveValues[K] | undefined, key: K): WaveValues[K] =>
      value === undefined || value === null ? base[key] : value;
    unsupportedRef.current = onUnsupported;
    settingsRef.current = {
      ...colors,
      slatWidth,
      slatHeight,
      gap,
      roundness,
      scale: pick(scale, "scale"),
      speed: pick(speed, "speed"),
      direction: pick(direction, "direction"),
      chop: pick(chop, "chop"),
      stretch: pick(stretch, "stretch"),
      glint: pick(glint, "glint"),
      contrast: pick(contrast, "contrast"),
      perspective: pick(perspective, "perspective"),
      fog: pick(fog, "fog"),
      intro,
      introDuration,
      paused,
    };
    wakeRef.current?.();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    } catch {
      unsupportedRef.current?.();
      return undefined;
    }
    const gl = renderer.gl;
    if (!renderer.isWebgl2) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      unsupportedRef.current?.();
      return undefined;
    }
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const geometry = new Triangle(gl);

    const dispose = (target: RenderTarget) => {
      gl.deleteFramebuffer(target.buffer);
      gl.deleteTexture(target.texture.texture);
    };

    let fieldTarget = new RenderTarget(gl, { width: 1, height: 1, depth: false, minFilter: gl.NEAREST, magFilter: gl.NEAREST });

    const fieldUniforms = {
      uSize: { value: [1, 1] },
      uGrid: { value: [1, 1, 1, 1] },
      uOrigin: { value: [0, 0] },
      uSlat: { value: [1, 1] },
      uTime: { value: 0 },
      uScale: { value: 1 },
      uDirection: { value: 0 },
      uChop: { value: 0.5 },
      uStretch: { value: 0.3 },
      uGlint: { value: 1 },
      uContrast: { value: 1 },
      uPerspective: { value: 0.7 },
      uFog: { value: 0.5 },
      uIntro: { value: 0 },
    };
    const fieldMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, { vertex: passVertex, fragment: fieldFragment, uniforms: fieldUniforms, depthTest: false, depthWrite: false }),
    });

    const slatUniforms = {
      tField: { value: fieldTarget.texture },
      uSize: { value: [1, 1] },
      uDpr: { value: 1 },
      uGrid: { value: [1, 1, 1, 1] },
      uOrigin: { value: [0, 0] },
      uSlat: { value: [1, 1] },
      uRound: { value: 1 },
      uColor: { value: [1, 1, 1] },
      uGlintColor: { value: [1, 1, 1] },
      uBackground: { value: [0, 0, 0, 1] },
    };
    const slatMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, { vertex: passVertex, fragment: slatFragment, uniforms: slatUniforms, depthTest: false, depthWrite: false }),
    });

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let width = 1;
    let height = 1;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let introClock = 0;
    let visible = true;
    let alive = true;

    const layout = (s: Settings) => {
      const slatW = clamp(s.slatWidth, 1, 64);
      const slatH = clamp(s.slatHeight, 2, 240);
      const gapSize = clamp(s.gap, 0, 64);
      const pitchX = slatW + gapSize;
      const pitchY = slatH + gapSize;
      const cols = Math.min(2048, Math.ceil((width + gapSize) / pitchX) + 1);
      const rows = Math.min(2048, Math.ceil((height + gapSize) / pitchY) + 1);
      const originX = (width - (cols * pitchX - gapSize)) / 2;
      const originY = (height - (rows * pitchY - gapSize)) / 2;
      if (fieldTarget.width !== cols || fieldTarget.height !== rows) {
        dispose(fieldTarget);
        fieldTarget = new RenderTarget(gl, { width: cols, height: rows, depth: false, minFilter: gl.NEAREST, magFilter: gl.NEAREST });
        slatUniforms.tField.value = fieldTarget.texture;
      }
      return { slatW, slatH, grid: [cols, rows, pitchX, pitchY], origin: [originX, originY] };
    };

    const frame = (now: number) => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      if (!s) return;

      if (!s.paused && !reducedMotion) time += dt * s.speed;
      introClock = s.intro && !reducedMotion ? introClock + dt / Math.max(0.2, s.introDuration) : 1;
      const introLinear = Math.min(introClock, 1);
      const introEase =
        introLinear < 0.5 ? 4 * introLinear * introLinear * introLinear : 1 - Math.pow(-2 * introLinear + 2, 3) / 2;

      const grid = layout(s);

      fieldUniforms.uSize.value = [width, height];
      fieldUniforms.uGrid.value = grid.grid;
      fieldUniforms.uOrigin.value = grid.origin;
      fieldUniforms.uSlat.value = [grid.slatW, grid.slatH];
      fieldUniforms.uTime.value = time;
      fieldUniforms.uScale.value = s.scale;
      fieldUniforms.uDirection.value = (s.direction * Math.PI) / 180;
      fieldUniforms.uChop.value = clamp(s.chop, 0, 1.5);
      fieldUniforms.uStretch.value = clamp(s.stretch, 0, 0.95);
      fieldUniforms.uGlint.value = Math.max(0, s.glint);
      fieldUniforms.uContrast.value = clamp(s.contrast, 0.2, 4);
      fieldUniforms.uPerspective.value = clamp(s.perspective, 0, 1);
      fieldUniforms.uFog.value = clamp(s.fog, 0, 1);
      fieldUniforms.uIntro.value = introEase;
      renderer.render({ scene: fieldMesh, target: fieldTarget });

      slatUniforms.uSize.value = [width, height];
      slatUniforms.uDpr.value = renderer.dpr;
      slatUniforms.uGrid.value = grid.grid;
      slatUniforms.uOrigin.value = grid.origin;
      slatUniforms.uSlat.value = [grid.slatW, grid.slatH];
      slatUniforms.uRound.value = clamp(s.roundness, 0, 1);
      slatUniforms.uColor.value = s.color.slice(0, 3);
      slatUniforms.uGlintColor.value = s.glintColor.slice(0, 3);
      slatUniforms.uBackground.value = s.backgroundColor;
      renderer.render({ scene: slatMesh });

      // Reduced motion: one static frame, then the loop stops.
      const moving = (!s.paused && !reducedMotion && s.speed !== 0) || introClock < 1;
      if (visible && moving) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      renderer.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR, Math.sqrt(PIXEL_BUDGET / (width * height)));
      renderer.setSize(width, height);
      // Draw once even when paused or reduced, so a resize never leaves a stretched frame.
      if (!raf && alive) raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    intersectionObserver.observe(container);

    wakeRef.current = start;
    resize();

    return () => {
      alive = false;
      visible = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      wakeRef.current = null;
      dispose(fieldTarget);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`.trim()} style={style} />;
};

export default MicroSlats;
