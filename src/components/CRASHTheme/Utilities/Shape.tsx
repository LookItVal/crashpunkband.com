import LineGroup from "@/components/CRASHTheme/Utilities/LineGroup";
import { LineOptions } from "@/lib/geometry/Line";
import { ShapeDefinition, StrokeOptions } from "@/lib/geometry/Shape";
import Brushstroke from "@/components/CRASHTheme/Utilities/Brushstroke";
import CircleGroup from "@/components/CRASHTheme/Utilities/CircleGroup";

type ShapeProps = {
  ref?: React.Ref<SVGElement>;
	shape: ShapeDefinition;
	defaultCount?: number;
  defaultBrushstrokeOptions?: {
    noiseMagnitude: number;
    brussleCount: number;
  };
	defaultLineOptions?: LineOptions;
	defaultStrokeOptions?: StrokeOptions;
};

export default function Shape({
  ref,
	shape,
	defaultCount,
  defaultBrushstrokeOptions,
	defaultLineOptions,
	defaultStrokeOptions = {
    stroke: "white",
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
}: ShapeProps) {
	return (
		<g>
			{shape.shapeSegments.map((segment, i) => (
        (segment.type === "line") ? (
          (segment.brush) ? (
            <Brushstroke
              key={`${"shape"}-${i}`}
              start={segment.start}
              end={segment.end}
              count={segment.count ?? defaultCount}
              brushstrokeOptions={segment.brushstrokeOptions ?? defaultBrushstrokeOptions}
              lineOptions={segment.lineOptions ?? defaultLineOptions}
              strokeOptions={ segment.strokeOptions ?? defaultStrokeOptions }
            />
          ) : (
            <LineGroup
              key={`${"shape"}-${i}`}
              start={segment.start}
              end={segment.end}
              count={segment.count ?? defaultCount}
              options={segment.lineOptions ?? defaultLineOptions}
              strokeOptions={segment.strokeOptions ?? defaultStrokeOptions}
            />
          )) : (
            <CircleGroup 
              key={`${"shape"}-${i}`}
              center={segment.center}
              radius={segment.radius}
              count={segment.count ?? defaultCount}
              postNoiseMagnitude={segment.postNoiseMagnitude}
              options={segment.circleOptions}
              strokeOptions={segment.strokeOptions ?? defaultStrokeOptions}
            />
          )
			))}
		</g>
	);
}
