import { useMemo, memo, useState, useEffect } from "react";
import { PointLike } from "@/lib/geometry/Point";
import { Circle, CircleOptions } from "@/lib/geometry/Circle";
import { StrokeOptions } from "@/lib/geometry/Shape";

type CircleGroupProps = {
  center: PointLike;
  radius: number;
  count?: number;
  postNoiseMagnitude?: number;
  options?: CircleOptions
  strokeOptions?: StrokeOptions;
}

function CircleGroup({
  center,
  radius,
  count = 5,
  postNoiseMagnitude = 2,
  options = {
    rotation: -110,
    overhangAngle: 10,
    overhangAngleNoise: 45,
    segments: 3,
    segmentNoiseMagnitudes: 10,
  },
  strokeOptions = {
    stroke: "#FFFFFFDD",
    strokeWidth: 1,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
}: CircleGroupProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const circles = useMemo(() => {
    if (!mounted) return [];
    const baseCircle = new Circle(center, radius, options);
    const result: Circle[] = [];
    for (let i = 0; i < count; i++) {
      result.push(baseCircle.duplicateWithNoise(postNoiseMagnitude));
    }
    return result;
  }, [center, radius, count, postNoiseMagnitude, options, mounted]);

  if (!mounted) return null;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={circles[i].pathData}
          {...strokeOptions}
          fill="none"
        />
      ))}
    </g>
  );
}

export default memo(CircleGroup);