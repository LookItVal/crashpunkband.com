import { PointLike } from "@/lib/geometry/Point";
import { Line, LineOptions } from "@/lib/geometry/Line";

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

export default function LineGroup({
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
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={new Line(start, end, options).pathData}
          {...strokeOptions}
        />
      ))}
    </g>
  );
}