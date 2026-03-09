import { PointLike } from "@/lib/geometry/Point";
import { Line, LineOptions } from "@/lib/geometry/Line";
import { Point } from "@/lib/geometry/Point";
import LineGroup from "@/components/CRASHTheme/Utilities/LineGroup";

type BrushstrokeProps = {
  start: PointLike;
  end: PointLike;
  count?: number;
  brushstrokeOptions?: {
    noiseMagnitude: number;
    brussleCount: number;
  };
  lineOptions?: LineOptions;
  strokeOptions?: {
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: "butt" | "round" | "square";
    strokeLinejoin?: "round" | "bevel" | "miter" | "inherit";
  };
};

export default function Brushstroke({
  start,
  end,
  count = 2,
  brushstrokeOptions = {
    noiseMagnitude: 7.5,
    brussleCount: 100
  },
  lineOptions = {
    smoothness: 0.8,
    segments: null,
    segmentLength: 15,
    preSegmentNoiseMagnitudes: 3,
    postSegmentNoiseMagnitudes: 0.2
  },
  strokeOptions = {
    stroke: "#ffffffBB",
    strokeWidth: 1,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
}: BrushstrokeProps) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <LineGroup
          key={i}
          start={new Point(start).applyNoise(brushstrokeOptions.noiseMagnitude)}
          end={new Point(end).applyNoise(brushstrokeOptions.noiseMagnitude)}
          count={brushstrokeOptions.brussleCount}
          options={lineOptions}
          strokeOptions={strokeOptions}
        />
      ))}
    </g>
  );
}