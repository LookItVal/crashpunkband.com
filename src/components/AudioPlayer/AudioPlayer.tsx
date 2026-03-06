"use client";

import { useState, useEffect } from "react";

type AudioPlayerProps = {
  audioSrc: string;
};

function fract(value: number) {
  return value - Math.floor(value);
}

function hashNoise(value: number, s: number) {
  const n = Math.sin(value * 12.9898 + s * 78.233) * 43758.5453;
  return fract(n) * 2 - 1;
}

function createRoughCirclePath(
  cx: number,
  cy: number,
  radius: number,
  seed: number,
  segments: number = 15,
  curveSmoothness: number = 0.7,
  amplitude: number = 0.035,
  connect: boolean = false,
  overhang: number = 5,
  overhangRandomness: number = 5
) {
  // Generate radius offsets for each segment
  const radii: number[] = [];
  for (let i = 0; i < segments; i++) {
    const noise = hashNoise(i, seed);
    radii.push(radius * (1 + noise * amplitude));
  }

  // Build points from radii
  const points = radii.map((r, i) => {
    const angle = (i / segments) * Math.PI * 2;
    return { x: cx + Math.cos(angle+80) * r, y: cy + Math.sin(angle+80) * r };
  });

  // If not connected, offset the first and last points by overhang degrees
  if (!connect) {
    const overhangRad = (overhang * Math.PI) / 180;
    const overhangNoise = (hashNoise(seed + 99, seed) * overhangRandomness);

    // First point: shift backwards (before angle 0)
    const firstOffset = -(overhangRad + overhangNoise * overhangRad);
    const firstR = radii[0];
    points[0] = {
      x: cx + Math.cos(firstOffset+80) * firstR,
      y: cy + Math.sin(firstOffset+80) * firstR,
    };

    // Last point: shift forwards (past where the circle would close)
    const lastBaseAngle = ((segments - 1) / segments) * Math.PI * 2;
    const lastNoise = hashNoise(seed + 100, seed) * overhangRandomness;
    const lastOffset = lastBaseAngle + overhangRad + lastNoise * overhangRad;
    const lastR = radii[segments - 1];
    points[segments - 1] = {
      x: cx + Math.cos(lastOffset+80) * lastR,
      y: cy + Math.sin(lastOffset+80) * lastR,
    };
  }

  // Compute cubic bezier control points using Catmull-Rom → cubic conversion
  // curveSmoothness controls the tension (0 = sharp corners, 1 = very smooth)
  const tension = curveSmoothness;
  let d = `M ${points[0].x.toFixed(3)} ${points[0].y.toFixed(3)}`;

  const lastIdx = connect ? segments : segments - 1;
  for (let i = 0; i < lastIdx; i++) {
    const p0 = points[(i - 1 + segments) % segments];
    const p1 = points[i];
    const p2 = points[(i + 1) % segments];
    const p3 = points[(i + 2) % segments];

    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;

    d += ` C ${cp1x.toFixed(3)} ${cp1y.toFixed(3)}, ${cp2x.toFixed(3)} ${cp2y.toFixed(3)}, ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`;
  }

  if (connect) {
    d += " Z";
  }

  return d;
}


function createRoughLinePath(
  start: { x: number; y: number }, 
  end: { x: number; y: number },
  seed: number,
  segments: number = 5,
  curveSmoothness: number = 0.2,
  amplitude: number = 0.4,
  overhang: number = 10,
  overhangRandomness: number = 25,
  angleOffsetRamdomness: number = 0.01
) {
  // Calculate line direction
  let dx = end.x - start.x;
  let dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  const unitX = dx / length;
  const unitY = dy / length;
  const perpX = -unitY;
  const perpY = unitX;

  // Apply angle offset randomness
  const angleNoise = hashNoise(seed, seed) * angleOffsetRamdomness;
  const cos = Math.cos(angleNoise);
  const sin = Math.sin(angleNoise);
  const rotatedUnitX = unitX * cos - unitY * sin;
  const rotatedUnitY = unitX * sin + unitY * cos;

  // Generate points along the line with perpendicular noise
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const baseX = start.x + rotatedUnitX * length * t;
    const baseY = start.y + rotatedUnitY * length * t;

    let noise = 0;
    if (i > 0 && i < segments) {
      noise = hashNoise(i, seed) * amplitude;
    } else if (i === 0 || i === segments) {
      // Overhang at endpoints
      const overhangRad = (overhang * Math.PI) / 180;
      const overhangNoise = hashNoise(seed + (i === 0 ? 99 : 100), seed) * overhangRandomness;
      noise = (overhangRad + overhangNoise * overhangRad) * (i === 0 ? -1 : 1);
    }

    points.push({
      x: baseX + perpX * noise,
      y: baseY + perpY * noise,
    });
  }

  // Build path using cubic bezier curves
  const tension = curveSmoothness;
  let d = `M ${points[0].x.toFixed(3)} ${points[0].y.toFixed(3)}`;

  for (let i = 0; i < segments; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i === segments - 1 ? points[segments] : points[i + 2];

    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;

    d += ` C ${cp1x.toFixed(3)} ${cp1y.toFixed(3)}, ${cp2x.toFixed(3)} ${cp2y.toFixed(3)}, ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`;
  }

  return d;
}



export default function AudioPlayer({ audioSrc }: AudioPlayerProps) {
  const [seed, setSeed] = useState(123);

  useEffect(() => {
    setSeed(Math.random() * Date.now() * 0.001);
  }, []);

  return (
    <div className="flex ">
      <svg viewBox="0 0 100 100" className="w-14 h-14 overflow-visible">
        <path d={createRoughCirclePath(50, 50, 45, seed)} fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <g id="playbutton" className="hidden">
          <path d={createRoughLinePath({ x: 40, y: 35 }, { x: 40, y: 65 }, seed + 1)} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <path d={createRoughLinePath({ x: 40, y: 35 }, { x: 65, y: 50 }, seed + 2)} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <path d={createRoughLinePath({ x: 40, y: 65 }, { x: 65, y: 50 }, seed + 3)} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g id="pausebutton" className="">
          <path d={createRoughLinePath({ x: 40, y: 35 }, { x: 40, y: 65 }, seed + 4)} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <path d={createRoughLinePath({ x: 60, y: 35 }, { x: 60, y: 65 }, seed + 5)} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
      <p>long play track</p>
      <p>volume controls</p>
    </div>
  );
}