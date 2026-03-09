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

export default function CircleGroup({
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
  const baseCircle = new Circle(center, radius, options);
  const circles: Circle[] = [];
  for (let i = 0; i < count; i++) {
    circles.push(baseCircle.duplicateWithNoise(postNoiseMagnitude));
  }
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