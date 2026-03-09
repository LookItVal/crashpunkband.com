import Shape from "@/components/CRASHTheme/Utilities/Shape";
import { ShapeBuilder, StrokeOptions } from "@/lib/geometry/Shape";

type PlayIconProps = {
  size?: number;
  position?: { x: number; y: number };
  fill?: string;
  strokeOptions?: StrokeOptions;
};

export default function PlayIcon({
  size = 100,
  position = { x: 0, y: 0 },
  strokeOptions: strokeOptions = {
    stroke: "white",
    strokeWidth: 0.5,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
}: PlayIconProps) {
  const shape = new ShapeBuilder()
    .addLine({ x: 0.5, y: 0.5 }, { x: 0.5, y: -0.5 })
    .addLine({ x: 0.5, y: -0.5 }, { x: -0.5, y: -0.5 })
    .addLine({ x: -0.5, y: -0.5 }, { x: -0.5, y: 0.5 })
    .addLine({ x: -0.5, y: 0.5 }, { x: 0.5, y: 0.5 })
    .addLine({ x: -0.25, y: -0.3 }, { x: -0.25, y: 0.3 })
    .addLine({ x: -0.25, y: -0.3 }, { x: 0.3, y: 0 })
    .addLine({ x: -0.25, y: 0.3 }, { x: 0.3, y: 0 })
    .makeAllLines()
    .scale(size)
    .translate(position)
    .applyOptions({
      type: "line",
      count: 1,
      lineOptions: {
        segmentLength: 1,
        preSegmentNoiseMagnitudes: 1,
        postSegmentNoiseMagnitudes: 0.5,
      }
    }).build();

  return (
    <g>
      <Shape shape={shape} defaultStrokeOptions={{ ...strokeOptions }} />
    </g>
  );
}