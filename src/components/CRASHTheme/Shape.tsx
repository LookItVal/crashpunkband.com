import LineGroup from "./LineGroup";
import { LineOptions } from "@/lib/geometry/Line";
import { ShapeDefinition, StrokeOptions } from "@/lib/geometry/Shape";

type ShapeProps = {
	shape: ShapeDefinition;
	defaultCount?: number;
	defaultOptions?: LineOptions;
	defaultStrokeOptions?: StrokeOptions;
};

export default function Shape({
	shape,
	defaultCount,
	defaultOptions,
	defaultStrokeOptions = {
    stroke: "white",
    strokeWidth: 3,
    strokeLinecap: "round",
  }
}: ShapeProps) {
	return (
		<g data-shape-name={shape.name}>
			{shape.lines.map((line, i) => (
				<LineGroup
					key={`${"shape"}-${i}`}
					start={line.start}
					end={line.end}
					count={line.count ?? defaultCount}
					options={line.options ?? defaultOptions}
					strokeOptions={{ ...defaultStrokeOptions, ...line.strokeOptions }}
				/>
			))}
		</g>
	);
}
