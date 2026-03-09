"use client";

import { useEffect, useImperativeHandle, useState, useRef, useMemo, memo } from "react";
import gsap from "gsap";
import Shape from "@/components/CRASHTheme/Utilities/Shape";
import { ShapeBuilder, StrokeOptions, ShapeDefinition } from "@/lib/geometry/Shape";
import { useGSAP } from "@gsap/react";

const DEFAULT_STROKE_OPTIONS: StrokeOptions = {
  stroke: "white",
  strokeWidth: 0.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const MemoizedShape = memo(Shape);

export type PlayIconHandle = {
  toggleVisibility: () => void;
};

type PlayIconProps = {
  ref: React.Ref<PlayIconHandle>;
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
  strokeOptions = DEFAULT_STROKE_OPTIONS,
  visible = true
}: PlayIconProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(visible);
  const localRef = useRef<SVGGElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setIsVisible(visible), [visible]);

  const shape = useMemo(() => {
    if (!mounted) return null;
    return new ShapeBuilder()
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
      }).build();
  }, [mounted, size, position.x, position.y]);
  
  useImperativeHandle(ref, () => ({
    toggleVisibility: () => setIsVisible((p) => !p),
  }), []);

  useGSAP(() => {
    if (!shape || !localRef.current) return;

    const paths = localRef.current.querySelectorAll("path");
    if (!paths.length) return;

    const tl = gsap.timeline();

    if (isVisible) {
      // Animate in: draw stroke from hidden to visible
      gsap.set(paths, {
        strokeDasharray: 50,
        strokeDashoffset: 50,
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        filter: "blur(0px)" });
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
        scaleX: "random(1.5, 2.5)",
        scaleY: "random(1.2, 1.5)",
        duration: 0.6,
        ease: "power2.in",
      });
    }

    return () => {
      tl.kill();
    };
  }, { scope: localRef, dependencies: [isVisible, shape] });

  if (!shape) {
    return <g ref={localRef} />;
  }
  return (
    <g ref={localRef}>
      <MemoizedShape shape={shape} defaultStrokeOptions={strokeOptions} />
    </g>
  );
}