import { memo, useMemo } from "react";
import { PointLike } from "@/lib/geometry/Point";
import { Line, LineOptions } from "@/lib/geometry/Line";

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeededRandom<T>(seed: number, run: () => T): T {
  const originalRandom = Math.random;
  const seededRandom = mulberry32(seed || 1);
  Math.random = seededRandom;
  try {
    return run();
  } finally {
    Math.random = originalRandom;
  }
}

type LineGroupProps = {
  start: PointLike;
  end: PointLike;
  count?: number;
  options?: LineOptions;
  strokeOptions?: {
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: "butt" | "round" | "square";
    strokeLinejoin?: "round" | "bevel" | "miter" | "inherit";
  };
};

function LineGroup({
  start,
  end,
  count = 2,
  options = {
    smoothness: 0.8,
    segments: null,
    segmentLength: 15,
    preSegmentNoiseMagnitudes: 4,
    postSegmentNoiseMagnitudes: 0.6
  },
  strokeOptions = {
    stroke: "white",
    strokeWidth: 1,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
}: LineGroupProps) {
  const pathData = useMemo(() => {
    const seedInput = [
      start.x,
      start.y,
      end.x,
      end.y,
      count,
      options.smoothness,
      options.segments,
      options.segmentLength,
      options.preSegmentNoiseMagnitudes,
      options.postSegmentNoiseMagnitudes,
    ].join("|");
    const baseSeed = hashString(seedInput);

    return Array.from({ length: count }, (_, i) => {
      return withSeededRandom(baseSeed + i + 1, () => new Line(start, end, options).pathData);
    });
  }, [
    start.x,
    start.y,
    end.x,
    end.y,
    count,
    options.smoothness,
    options.segments,
    options.segmentLength,
    options.preSegmentNoiseMagnitudes,
    options.postSegmentNoiseMagnitudes,
  ]);

  return (
    <g>
      {pathData.map((path, i) => (
        <path
          key={i}
          d={path}
          {...strokeOptions}
          fill="none"
        />
      ))}
    </g>
  );
}

export default memo(LineGroup);