"use client";

import { useEffect, useImperativeHandle, useState, useRef } from "react";
import gsap from "gsap";
import Shape from "@/components/CRASHTheme/Utilities/Shape";
import { ShapeBuilder, StrokeOptions, ShapeDefinition } from "@/lib/geometry/Shape";
import { useGSAP } from "@gsap/react";

type PlayIconProps = {
  ref: React.Ref<SVGElement>;
  size?: number;
  position?: { x: number; y: number };
  fill?: string;
  strokeOptions?: StrokeOptions;
  visible?: boolean;
};

export default function PlayIcon({
  ref,
  size = 100,
  position = { x: 0, y: 0 },
  strokeOptions: strokeOptions = {
    stroke: "white",
    strokeWidth: 0.5,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  },
  visible = true
}: PlayIconProps) {
  const [shape, setShape] = useState<ShapeDefinition | null>(null);
  const localRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    if (!shape || !localRef.current) return;

    const paths = localRef.current.querySelectorAll("path");
    if (!paths.length) return;

    const tl = gsap.timeline();

    if (visible) {
      // Animate in: draw stroke from hidden to visible
      gsap.set(paths, { strokeDasharray: 50, strokeDashoffset: 50, opacity: 1, filter: "blur(0px)" });
      tl.to(paths, {
        strokeDashoffset: 0,
        duration: "random(0.1, 0.5)",
        ease: "power2.in",
        delay: "random(0, 0.5)",
      });
    } else {
      // Animate out: blur and fade
      tl.to(paths, {
        opacity: 0,
        filter: "blur(4px)",
        duration: 0.6,
        ease: "power2.in",
        stagger: 0.03
      });
    }

    return () => {
      tl.kill();
    };
  }, { scope: localRef, dependencies: [visible, shape] });

  useEffect(() => {
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
          segmentLength: 2,
          preSegmentNoiseMagnitudes: 1,
          postSegmentNoiseMagnitudes: 0.2,
        }
      });

    setShape(shape.build());
  }, [size, position]);

  if (!shape) {
    return <g/>;
  }
  return (
  <g ref={localRef}>
      <Shape shape={shape} defaultStrokeOptions={{ ...strokeOptions }} />
    </g>
  );
}