import { memo, useMemo } from "react";
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
    return Array.from({ length: count }, () => new Line(start, end, options).pathData);
  }, [start.x, start.y, end.x, end.y, count,
    options.smoothness, options.segments, options.segmentLength,
    options.preSegmentNoiseMagnitudes, options.postSegmentNoiseMagnitudes]);

  return (
    <g>
      {pathData.map((path, i) => (
        <path
          key={i}
          d={path}
          {...strokeOptions}
          fill="none"
          suppressHydrationWarning
        />
      ))}
    </g>
  );
}

export default memo(LineGroup);