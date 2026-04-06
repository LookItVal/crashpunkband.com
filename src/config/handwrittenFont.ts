import { ShapeBuilder, ShapeDefinition } from "@/lib/geometry/Shape";

/**
 * Character definitions for the hand-drawn font.
 *
 * Each glyph is drawn inside a unit cell whose logical coordinate space is
 *   x: 0 → CELL_WIDTH   (horizontal)
 *   y: 0 → CELL_HEIGHT   (vertical, top-down)
 *
 * The HandwrittenParagraph component scales each cell so the rendered size
 * matches one character of the invisible monospace overlay.
 *
 * To edit a character, replace the ShapeBuilder chain for that key.
 * All strokes should use straight lines to match the desired style.
 */

// Aspect ratio of the monospace font character cell.
// Standard monospace fonts have a width:height ratio of ~0.6:1.
export const CELL_WIDTH = 0.6;
export const CELL_HEIGHT = 1;

// ── Helper ──────────────────────────────────────────────────────────────
function placeholder(): ShapeDefinition {
  // A small "X" as a placeholder so every character renders *something*.
  return new ShapeBuilder()
    .addLine({ x: 0.05, y: 0.1 }, { x: 0.55, y: 0.9 })
    .addLine({ x: 0.55, y: 0.1 }, { x: 0.05, y: 0.9 })
    .build();
}

// ── Uppercase letters ───────────────────────────────────────────────────
const uppercase: Record<string, ShapeDefinition> = {
  A: new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.01, y: 0.9 })
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.59, y: 0.9 })
    .addLine({ x: 0.05, y: 0.5 }, { x: 0.55, y: 0.5 })
    .build(),
  B: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.45, y: 0.3 })
    .addLine({ x: 0.45, y: 0.3 }, { x: 0.1, y: 0.5 })
    .addLine({ x: 0.1, y: 0.5 }, { x: 0.5, y: 0.65 })
    .addLine({ x: 0.5, y: 0.65 }, { x: 0.1, y: 0.9 })
    .build(),
  C: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.6 }, { x: 0.5, y: 0.175 })
    .addLine({ x: 0.1, y: 0.6 }, { x: 0.55, y: 0.9 })
    .addLine({ x: 0.5, y: 0.1 }, { x: 0.5, y: 0.35 })
    .build(),
  D: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.55, y: 0.35 })
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.55, y: 0.35 })
    .build(),
  E: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.1 })
    .addLine({ x: 0.1, y: 0.5 }, { x: 0.4, y: 0.5 })
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.5, y: 0.9 })
    .build(),
  F: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.1 })
    .addLine({ x: 0.1, y: 0.5 }, { x: 0.4, y: 0.5 })
    .build(),
  G: new ShapeBuilder()
    .addLine({ x: 0.4, y: 0.4 }, { x: 0.25, y: 0.1 })
    .addLine({ x: 0.25, y: 0.1 }, { x: 0.05, y: 0.5 })
    .addLine({ x: 0.05, y: 0.5 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.5, y: 0.6 })
    .addLine({ x: 0.4, y: 0.6 }, { x: 0.6, y: 0.6 })
    .addLine({ x: 0.5, y: 0.6 }, { x: 0.5, y: 0.8 })
    .build(),
  H: new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.1 }, { x: 0.15, y: 0.9 })
    .addLine({ x: 0.45, y: 0.1 }, { x: 0.45, y: 0.9 })
    .addLine({ x: 0.05, y: 0.5 }, { x: 0.55, y: 0.5 })
    .build(),
  I: new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.1 })
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.5, y: 0.9 })
    .build(),
  J: new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.1 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0, y: 0.7 })
    .build(),
  K: new ShapeBuilder()
    .addLine({ x: 0.125, y: 0.1 }, { x: 0.125, y: 0.9 })
    .addLine({ x: 0.5, y: 0.1 }, { x: 0.1, y: 0.55 })
    .addLine({ x: 0.5, y: 0.9 }, { x: 0.1, y: 0.55 })
    .build(),
  L: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.5, y: 0.9 })
    .build(),
  M: new ShapeBuilder()
    .addLine({ x: 0.05, y: 0.9 }, { x: 0.15, y: 0.1 })
    .addLine({ x: 0.15, y: 0.1 }, { x: 0.3, y: 0.6 })
    .addLine({ x: 0.3, y: 0.6 }, { x: 0.45, y: 0.1 })
    .addLine({ x: 0.45, y: 0.1 }, { x: 0.55, y: 0.9 })
    .build(),
  N: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.1, y: 0.1 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.9 })
    .addLine({ x: 0.5, y: 0.9 }, { x: 0.5, y: 0.1 })
    .build(),
  O: new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.05, y: 0.5 })
    .addLine({ x: 0.05, y: 0.5 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.55, y: 0.5 })
    .addLine({ x: 0.55, y: 0.5 }, { x: 0.3, y: 0.1 })
    .addLine({ x: 0.3, y: 0.475 }, { x: 0.3, y: 0.525 })
    .build(),
  P: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.25 })
    .addLine({ x: 0.5, y: 0.25 }, { x: 0.1, y: 0.5 })
    .build(),
  Q: new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.05, y: 0.5 })
    .addLine({ x: 0.05, y: 0.5 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.55, y: 0.5 })
    .addLine({ x: 0.55, y: 0.5 }, { x: 0.3, y: 0.1 })
    .addLine({ x: 0.35, y: 0.6 }, { x: 0.6, y: 0.85 })
    .build(),
  R: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.25 })
    .addLine({ x: 0.5, y: 0.25 }, { x: 0.1, y: 0.5 })
    .addLine({ x: 0.2, y: 0.45 }, { x: 0.55, y: 0.9 })
    .build(),
  S: new ShapeBuilder()
    .addLine({ x: 0.4, y: 0.1 }, { x: 0.4, y: 0.4 })
    .addLine({ x: 0.4, y: 0.2 }, { x: 0.15, y: 0.45 })
    .addLine({ x: 0.15, y: 0.45 }, { x: 0.45, y: 0.65 })
    .addLine({ x: 0.45, y: 0.65 }, { x: 0.2, y: 0.9 })
    .build(),
  T: new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.05, y: 0.1 }, { x: 0.55, y: 0.1 })
    .build(),
  U: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.7 })
    .addLine({ x: 0.1, y: 0.7 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.5, y: 0.7 })
    .addLine({ x: 0.5, y: 0.7 }, { x: 0.5, y: 0.1 })
    .build(),
  V: new ShapeBuilder()
    .addLine({ x: 0.05, y: 0.1 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.55, y: 0.1 })
    .build(),
  W: new ShapeBuilder()
    .addLine({ x: 0.05, y: 0.1 }, { x: 0.2, y: 0.9 })
    .addLine({ x: 0.2, y: 0.9 }, { x: 0.3, y: 0.5 })
    .addLine({ x: 0.3, y: 0.5 }, { x: 0.4, y: 0.9 })
    .addLine({ x: 0.4, y: 0.9 }, { x: 0.55, y: 0.1 })
    .build(),
  X: new ShapeBuilder()
    .addLine({ x: 0.05, y: 0.1 }, { x: 0.55, y: 0.9 })
    .addLine({ x: 0.55, y: 0.1 }, { x: 0.05, y: 0.9 })
    .build(),
  Y: new ShapeBuilder()
    .addLine({ x: 0.05, y: 0.1 }, { x: 0.3, y: 0.5 })
    .addLine({ x: 0.55, y: 0.1 }, { x: 0.3, y: 0.5 })
    .addLine({ x: 0.3, y: 0.5 }, { x: 0.3, y: 0.9 })
    .build(),
  Z: new ShapeBuilder()
    .addLine({ x: 0.05, y: 0.1 }, { x: 0.55, y: 0.1 })
    .addLine({ x: 0.55, y: 0.1 }, { x: 0.05, y: 0.9 })
    .addLine({ x: 0.05, y: 0.9 }, { x: 0.55, y: 0.9 })
    .build(),
};

// ── Lowercase letters ───────────────────────────────────────────────────
const lowercase: Record<string, ShapeDefinition> = {
  a: new ShapeBuilder()
    .addLine({ x: 0.4, y: 0.5 }, { x: 0.5, y: 0.9 })
    .addLine({ x: 0.4, y: 0.55 }, { x: 0.1, y: 0.75 })
    .addLine({ x: 0.1, y: 0.75 }, { x: 0.45, y: 0.8 })
    .build(),
  b: new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.1 }, { x: 0.15, y: 0.9 })
    .addLine({ x: 0.15, y: 0.55 }, { x: 0.45, y: 0.65 })
    .addLine({ x: 0.15, y: 0.9 }, { x: 0.45, y: 0.65 })
    .build(),
  c: new ShapeBuilder()
    .addLine({ x: 0.5, y: 0.5 }, { x: 0.1, y: 0.7 })
    .addLine({ x: 0.1, y: 0.7 }, { x: 0.5, y: 0.9 })
    .build(),
  d: new ShapeBuilder()
    .addLine({ x: 0.45, y: 0.1 }, { x: 0.45, y: 0.9 })
    .addLine({ x: 0.45, y: 0.55 }, { x: 0.15, y: 0.65 })
    .addLine({ x: 0.45, y: 0.9 }, { x: 0.15, y: 0.65 })
    .build(),
  e: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.7 }, { x: 0.5, y: 0.65 })
    .addLine({ x: 0.5, y: 0.65 }, { x: 0.35, y: 0.4 })
    .addLine({ x: 0.35, y: 0.4}, { x: 0.1, y: 0.7 })
    .addLine({ x: 0.1, y: 0.7 }, { x: 0.4, y: 0.9 })
    .build(),
  f: new ShapeBuilder()
    .addLine({ x: 0.25, y: 0.1 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.25, y: 0.1 }, { x: 0.45, y: 0.4 })
    .addLine({ x: 0.15, y: 0.7 }, { x: 0.45, y: 0.7 })
    .build(),
  g: new ShapeBuilder()
    .addLine({ x: 0.45, y: 0.5 }, { x: 0.45, y: 1.3 })
    .addLine({ x: 0.45, y: 0.6 }, { x: 0.15, y: 0.75 })
    .addLine({ x: 0.15, y: 0.75 }, { x: 0.45, y: 0.8 })
    .addLine({ x: 0.45, y: 1.3 }, { x: 0.15, y: 1.15 })
    .build(),
  h: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.3, y: 0.5 })
    .addLine({ x: 0.3, y: 0.5 }, { x: 0.5, y: 0.9 })
    .build(),
  i: new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.65 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.4 }, { x: 0.3, y: 0.41 })
    .build(),
  j: new ShapeBuilder()
    .addLine({ x: 0.4, y: 0.65 }, { x: 0.4, y: 1.3 })
    .addLine({ x: 0.4, y: 0.4 }, { x: 0.4, y: 0.41 })
    .addLine({ x: 0.4, y: 1.3 }, { x: 0.2, y: 1.15 })
    .build(),
  k: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.7 }, { x: 0.45, y: 0.5 })
    .addLine({ x: 0.1, y: 0.7 }, { x: 0.5, y: 0.9 })
    .build(),
  l: new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.3, y: 0.9 })
    .build(),
  m: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.6 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.2, y: 0.6 })
    .addLine({ x: 0.2, y: 0.6 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.4, y: 0.6 })
    .addLine({ x: 0.4, y: 0.6 }, { x: 0.5, y: 0.9 })
    .build(),
  n: new ShapeBuilder()
    .addLine({ x: 0.175, y: 0.6 }, { x: 0.175, y: 0.9 })
    .addLine({ x: 0.175, y: 0.9 }, { x: 0.3, y: 0.6 })
    .addLine({ x: 0.3, y: 0.6 }, { x: 0.425, y: 0.9 })
    .build(),
  o: new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.5 }, { x: 0.1, y: 0.7 })
    .addLine({ x: 0.1, y: 0.7 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.5, y: 0.7 })
    .addLine({ x: 0.5, y: 0.7 }, { x: 0.3, y: 0.5 })
    .build(),
  p: new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.55 }, { x: 0.15, y: 1.3 })
    .addLine({ x: 0.15, y: 0.55 }, { x: 0.45, y: 0.65 })
    .addLine({ x: 0.15, y: 0.9 }, { x: 0.45, y: 0.65 })
    .build(),
  q: new ShapeBuilder()
    .addLine({ x: 0.45, y: 0.55 }, { x: 0.45, y: 1.3 })
    .addLine({ x: 0.45, y: 0.55 }, { x: 0.15, y: 0.65 })
    .addLine({ x: 0.45, y: 0.9 }, { x: 0.15, y: 0.65 })
    .build(),
  r: new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.5 }, { x: 0.15, y: 0.9 })
    .addLine({ x: 0.15, y: 0.9 }, { x: 0.3, y: 0.475 })
    .addLine({ x: 0.3, y: 0.475 }, { x: 0.45, y: 0.65 })
    .build(),
  s: new ShapeBuilder()
    .addLine({ x: 0.375, y: 0.45 }, { x: 0.2, y: 0.625 })
    .addLine({ x: 0.2, y: 0.625 }, { x: 0.4, y: 0.7 })
    .addLine({ x: 0.4, y: 0.7 }, { x: 0.2, y: 0.9 })
    .build(),
  t: new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.2 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.15, y: 0.4 }, { x: 0.45, y: 0.4 })
    .build(),
  u: new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.6 }, { x: 0.25, y: 0.9 })
    .addLine({ x: 0.25, y: 0.9 }, { x: 0.45, y: 0.6 })
    .addLine({ x: 0.45, y: 0.6 }, { x: 0.45, y: 0.9 })
    .build(),
  v: new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.5 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.45, y: 0.5 })
    .build(),
  w: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.5 }, { x: 0.2, y: 0.9 })
    .addLine({ x: 0.2, y: 0.9 }, { x: 0.3, y: 0.7 })
    .addLine({ x: 0.3, y: 0.7 }, { x: 0.4, y: 0.9 })
    .addLine({ x: 0.4, y: 0.9 }, { x: 0.5, y: 0.5 })
    .build(),
  x: new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.5 }, { x: 0.45, y: 0.9 })
    .addLine({ x: 0.45, y: 0.5 }, { x: 0.15, y: 0.9 })
    .build(),
  y: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.5 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.5, y: 0.5 }, { x: 0.1, y: 1.3 })
    .build(),
  z: new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.5 }, { x: 0.5, y: 0.5 })
    .addLine({ x: 0.5, y: 0.5 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.5, y: 0.9 })
    .build(),
};

// ── Digits ──────────────────────────────────────────────────────────────
const digits: Record<string, ShapeDefinition> = {
  "0": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.05, y: 0.5 })
    .addLine({ x: 0.05, y: 0.5 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.55, y: 0.5 })
    .addLine({ x: 0.55, y: 0.5 }, { x: 0.3, y: 0.1 })
    .addLine({ x: 0.175, y: 0.7 }, { x: 0.425, y: 0.3 })
    .build(),
  "1": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.15, y: 0.25 }, { x: 0.3, y: 0.1 })
    .addLine({ x: 0.15, y: 0.9 }, { x: 0.45, y: 0.9 })
    .build(),
  "2": new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.3 }, { x: 0.3, y: 0.1 })
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.5, y: 0.3 })
    .addLine({ x: 0.5, y: 0.3 }, { x: 0.1, y: 0.9 })
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.5, y: 0.9 })
    .build(),
  "3": new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.3 }, { x: 0.3, y: 0.1 })
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.5, y: 0.3 })
    .addLine({ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.5 })
    .addLine({ x: 0.3, y: 0.5 }, { x: 0.5, y: 0.7 })
    .addLine({ x: 0.5, y: 0.7 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.1, y: 0.7 })
    .build(),
  "4": new ShapeBuilder()
    .addLine({ x: 0.4, y: 0.1 }, { x: 0.4, y: 0.9 })
    .addLine({ x: 0.1, y: 0.5 }, { x: 0.55, y: 0.5 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.5 })
    .build(),
  "5": new ShapeBuilder()
    .addLine({ x: 0.5, y: 0.1 }, { x: 0.1, y: 0.1 })
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.1, y: 0.5 })
    .addLine({ x: 0.1, y: 0.5 }, { x: 0.3, y: 0.4 })
    .addLine({ x: 0.3, y: 0.4 }, { x: 0.5, y: 0.65 })
    .addLine({ x: 0.5, y: 0.65 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.1, y: 0.7 })
    .build(),
  "6": new ShapeBuilder()
    .addLine({ x: 0.45, y: 0.25 }, { x: 0.3, y: 0.1 })
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.1, y: 0.5 })
    .addLine({ x: 0.1, y: 0.5 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.5, y: 0.6 })
    .addLine({ x: 0.5, y: 0.6 }, { x: 0.15, y: 0.6 })
    .build(),
  "7": new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.1 })
    .addLine({ x: 0.5, y: 0.1 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.45 }, { x: 0.5, y: 0.45 })
    .build(),
  "8": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.1, y: 0.3 })
    .addLine({ x: 0.1, y: 0.3 }, { x: 0.5, y: 0.7 })
    .addLine({ x: 0.5, y: 0.7 }, { x: 0.3, y: 0.9 })
    .addLine({ x: 0.3, y: 0.9 }, { x: 0.1, y: 0.7 })
    .addLine({ x: 0.1, y: 0.7 }, { x: 0.5, y: 0.3 })
    .addLine({ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.1 })
    .build(),
  "9": new ShapeBuilder()
    .addLine({ x: 0.45, y: 0.1 }, { x: 0.45, y: 0.9 })
    .addLine({ x: 0.45, y: 0.1 }, { x: 0.15, y: 0.3 })
    .addLine({ x: 0.15, y: 0.3 }, { x: 0.45, y: 0.5 })
    .build()
};

// ── Punctuation / symbols ───────────────────────────────────────────────
// !?;:'/\\@$#%&*[]()<>"'“”-+=_
const symbols: Record<string, ShapeDefinition> = {
  "!": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.3, y: 0.6 })
    .addLine({ x: 0.3, y: 0.85 }, { x: 0.3, y: 0.9 })
    .build(),
  "?": new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.1 }, { x: 0.45, y: 0.25 })
    .addLine({ x: 0.45, y: 0.25 }, { x: 0.15, y: 0.5 })
    .addLine({ x: 0.15, y: 0.5 }, { x: 0.15, y: 0.6 })
    .addLine({ x: 0.15, y: 0.85 }, { x: 0.15, y: 0.9 })
    .build(),
  ";": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.2 }, { x: 0.3, y: 0.25 })
    .addLine({ x: 0.3, y: 0.8 }, { x: 0.2, y: 1 })
    .build(),
  ":": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.2 }, { x: 0.3, y: 0.25 })
    .addLine({ x: 0.3, y: 0.8 }, { x: 0.3, y: 0.85 })
    .build(),
  "'": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.3, y: 0.25 })
    .build(),
  "/": new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.5, y: 0.1 })
    .build(),
  "\\": new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.9 })
    .build(),
  "@": new ShapeBuilder()
    .addLine({ x: 0.35, y: 0.525 }, { x: 0.35, y: 0.775 })
    .addLine({ x: 0.35, y: 0.55 }, { x: 0.2, y: 0.65 })
    .addLine({ x: 0.2, y: 0.65 }, { x: 0.35, y: 0.725 })
    .addLine({ x: 0.35, y: 0.775 }, { x: 0.55, y: 0.65 })
    .addLine({ x: 0.55, y: 0.65 }, { x: 0.4, y: 0.4 })
    .addLine({ x: 0.4, y: 0.4 }, { x: 0.1, y: 0.55 })
    .addLine({ x: 0.1, y: 0.55 }, { x: 0.1, y: 0.8 })
    .addLine({ x: 0.1, y: 0.8 }, { x: 0.35, y: 0.9 })
    .addLine({ x: 0.35, y: 0.9 }, { x: 0.5, y: 0.825 })
    .build(),
  "$": new ShapeBuilder()
    .addLine({ x: 0.5, y: 0.35 }, { x: 0.3, y: 0.2 })
    .addLine({ x: 0.3, y: 0.2 }, { x: 0.1, y: 0.4 })
    .addLine({ x: 0.1, y: 0.4 }, { x: 0.5, y: 0.6 })
    .addLine({ x: 0.5, y: 0.6 }, { x: 0.3, y: 0.8 })
    .addLine({ x: 0.3, y: 0.8 }, { x: 0.1, y: 0.65 })
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.3, y: 0.9 })
    .build(),
  "#": new ShapeBuilder()
    .addLine({ x: 0.2, y: 0.25 }, { x: 0.2, y: 0.75 })
    .addLine({ x: 0.4, y: 0.25 }, { x: 0.4, y: 0.75 })
    .addLine({ x: 0.1, y: 0.375 }, { x: 0.5, y: 0.375 })
    .addLine({ x: 0.1, y: 0.625 }, { x: 0.5, y: 0.625 })
    .build(),
  "%": new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.5, y: 0.1 })
    .addLine({ x: 0.15, y: 0.15 }, { x: 0.05, y: 0.25 })
    .addLine({ x: 0.05, y: 0.25 }, { x: 0.15, y: 0.35 })
    .addLine({ x: 0.15, y: 0.35 }, { x: 0.25, y: 0.25 })
    .addLine({ x: 0.25, y: 0.25 }, { x: 0.15, y: 0.15 })
    .addLine({ x: 0.45, y: 0.85 }, { x: 0.35, y: 0.75 })
    .addLine({ x: 0.35, y: 0.75 }, { x: 0.45, y: 0.65 })
    .addLine({ x: 0.45, y: 0.65 }, { x: 0.55, y: 0.75 })
    .addLine({ x: 0.55, y: 0.75 }, { x: 0.45, y: 0.85 })
    .build(),
  "&": new ShapeBuilder()
    .addLine({ x: 0.55, y: 0.85 }, { x: 0.1, y: 0.3 })
    .addLine({ x: 0.1, y: 0.3 }, { x: 0.25, y: 0.1 })
    .addLine({ x: 0.25, y: 0.1 }, { x: 0.4, y: 0.3 })
    .addLine({ x: 0.4, y: 0.3 }, { x: 0.05, y: 0.7 })
    .addLine({ x: 0.05, y: 0.7 }, { x: 0.25, y: 0.9 })
    .addLine({ x: 0.25, y: 0.9 }, { x: 0.55, y: 0.55 })
    .build(),
  "*": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.2 }, { x: 0.3, y: 0.5 })
    .addLine({ x: 0.15, y: 0.35 }, { x: 0.45, y: 0.35 })
    .addLine({ x: 0.2, y: 0.25 }, { x: 0.4, y: 0.45 })
    .addLine({ x: 0.4, y: 0.25 }, { x: 0.2, y: 0.45 })
    .build(),
  "[": new ShapeBuilder()
    .addLine({ x: 0.2, y: 0.1 }, { x: 0.2, y: 0.9 })
    .addLine({ x: 0.2, y: 0.1 }, { x: 0.4, y: 0.1 })
    .addLine({ x: 0.2, y: 0.9 }, { x: 0.4, y: 0.9 })
    .build(),
  "]": new ShapeBuilder()
    .addLine({ x: 0.4, y: 0.1 }, { x: 0.4, y: 0.9 })
    .addLine({ x: 0.2, y: 0.1 }, { x: 0.4, y: 0.1 })
    .addLine({ x: 0.2, y: 0.9 }, { x: 0.4, y: 0.9 })
    .build(),
  "(": new ShapeBuilder()
    .addLine({ x: 0.4, y: 0.1 }, { x: 0.2, y: 0.5 })
    .addLine({ x: 0.2, y: 0.5 }, { x: 0.4, y: 0.9 })
    .build(),
  ")": new ShapeBuilder()
    .addLine({ x: 0.2, y: 0.1 }, { x: 0.4, y: 0.5 })
    .addLine({ x: 0.4, y: 0.5 }, { x: 0.2, y: 0.9 })
    .build(),
  "<": new ShapeBuilder()
    .addLine({ x: 0.45, y: 0.5 }, { x: 0.15, y: 0.7 })
    .addLine({ x: 0.15, y: 0.7 }, { x: 0.45, y: 0.9 })
    .build(),
  ">": new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.5 }, { x: 0.45, y: 0.7 })
    .addLine({ x: 0.45, y: 0.7 }, { x: 0.15, y: 0.9 })
    .build(),
  '"': new ShapeBuilder()
    .addLine({ x: 0.2, y: 0.1 }, { x: 0.2, y: 0.25 })
    .addLine({ x: 0.4, y: 0.1 }, { x: 0.4, y: 0.25 })
    .build(),
  "“": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.1 }, { x: 0.2, y: 0.25 })
    .addLine({ x: 0.5, y: 0.1 }, { x: 0.4, y: 0.25 })
    .build(),
  "”": new ShapeBuilder()
    .addLine({ x: 0.2, y: 0.1 }, { x: 0.3, y: 0.25 })
    .addLine({ x: 0.4, y: 0.1 }, { x: 0.5, y: 0.25 })
    .build(),
  "-": new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.5 }, { x: 0.45, y: 0.5 })
    .build(),
  "+": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.35 }, { x: 0.3, y: 0.65 })
    .addLine({ x: 0.15, y: 0.5 }, { x: 0.45, y: 0.5 })
    .build(),
  "=": new ShapeBuilder()
    .addLine({ x: 0.15, y: 0.4 }, { x: 0.45, y: 0.4 })
    .addLine({ x: 0.15, y: 0.6 }, { x: 0.45, y: 0.6 })
    .build(),
  "_": new ShapeBuilder()
    .addLine({ x: 0.1, y: 0.9 }, { x: 0.5, y: 0.9 })
    .build(),
  ",": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.8 }, { x: 0.2, y: 1 })
    .build(),
  ".": new ShapeBuilder()
    .addLine({ x: 0.3, y: 0.85 }, { x: 0.3, y: 0.9 })
    .build(),
  "©": new ShapeBuilder()
    .addLine({ x: 0.35, y: 0.55 }, { x: 0.2, y: 0.65 })
    .addLine({ x: 0.2, y: 0.65 }, { x: 0.35, y: 0.75 })
    .addLine({ x: 0.6, y: 0.65 }, { x: 0.4, y: 0.4 })
    .addLine({ x: 0.4, y: 0.4 }, { x: 0.1, y: 0.55 })
    .addLine({ x: 0.1, y: 0.55 }, { x: 0.1, y: 0.8 })
    .addLine({ x: 0.1, y: 0.8 }, { x: 0.35, y: 0.9 })
    .addLine({ x: 0.4, y: 0.9 }, { x: 0.6, y: 0.65 })
    .build(),
};

// ── Merged lookup ───────────────────────────────────────────────────────
export const CHAR_MAP: Record<string, ShapeDefinition> = {
  ...uppercase,
  ...lowercase,
  ...digits,
  ...symbols,
};

/**
 * Look up the ShapeDefinition for a character.
 * Returns undefined for characters that should be rendered as whitespace
 * (space, tab, etc.) or that have no definition yet.
 */
export function getCharShape(char: string): ShapeDefinition | undefined {
  return CHAR_MAP[char];
}
