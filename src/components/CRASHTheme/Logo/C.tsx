import { ShapeBuilder } from "@/lib/geometry/Shape";
import Shape from "@/components/CRASHTheme/Utilities/Shape";

export default function C({
  lineHeight = 100
}) {
  const charWidth = 0.5 * lineHeight;

  const shape = new ShapeBuilder()
    .addLine({ x: 0.8 * charWidth, y: 0.5 * lineHeight }, { x: 0.6 * charWidth, y: 0.1 * lineHeight })
    .addLine({ x: 0.6 * charWidth, y: 0.1 * lineHeight }, { x: 0.1 * charWidth, y: 0.75 * lineHeight })
    .addLine({ x: 0.1 * charWidth, y: 0.75 * lineHeight }, { x: 0.9 * charWidth, y: 0.9 * lineHeight })
    .build();

  const defaultLineOptions = {
    smoothness: 0.8,
    segments: null,
    segmentLength: 15,
    preSegmentNoiseMagnitudes: 50,
    postSegmentNoiseMagnitudes: 0.6
  };

  return <Shape shape={shape} />;
}