import LineGroup from "./LineGroup";
import { LineOptions } from "@/lib/geometry/Line";
import { ShapeDefinition, StrokeOptions } from "@/lib/geometry/Shape";
import Brushstroke from "./Brushstroke";

type ShapeProps = {
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
	shape,
	defaultCount,
  defaultBrushstrokeOptions,
	defaultLineOptions,
	defaultStrokeOptions = {
    stroke: "white",
    strokeWidth: 3,
    strokeLinecap: "round",
  }
}: ShapeProps) {
	return (
		<g data-shape-name={shape.name}>
			{shape.lines.map((line, i) => (
        (line.brush) ? (
          <Brushstroke
            key={`${"shape"}-${i}`}
            start={line.start}
            end={line.end}
            count={line.count ?? defaultCount}
            brushstrokeOptions={line.brushstrokeOptions ?? defaultBrushstrokeOptions}
            lineOptions={line.lineOptions ?? defaultLineOptions}
            strokeOptions={ line.strokeOptions ?? defaultStrokeOptions }
          />
        ) : (
          <LineGroup
            key={`${"shape"}-${i}`}
            start={line.start}
            end={line.end}
            count={line.count ?? defaultCount}
            options={line.lineOptions ?? defaultLineOptions}
            strokeOptions={line.strokeOptions ?? defaultStrokeOptions}
          />
        )
			))}
		</g>
	);
}
