import { Curve, CurveOptions } from "@/lib/geometry/Curve";
import { StrokeOptions } from "@/lib/geometry/Shape";
import { PointLike } from "@/lib/geometry/Point";
import { VectorLike } from "@/lib/geometry/Vector";

type CurveGroupProps = {
  startPoint: PointLike;
  startVector: VectorLike;
  endPoint: PointLike;
  endVector: VectorLike;
  count?: number;
  options?: CurveOptions;
  strokeOptions?: StrokeOptions;
};

export default function CurveGroup({
  startPoint,
  startVector,
  endPoint,
  endVector,
  count = 2,
  options = {},
  strokeOptions = {
    stroke: "white",
    strokeWidth: 1,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
}: CurveGroupProps) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={new Curve(startPoint, startVector, endPoint, endVector, options).pathData}
          {...strokeOptions}
          fill="none"
        />
      ))}
    </g>
  );
}