"use client";

import { useEffect, useImperativeHandle, useState, useRef, useMemo, memo } from "react";
import gsap from "gsap";
import Shape from "@/components/CRASHTheme/Utilities/Shape";
import { ShapeBuilder, StrokeOptions, ShapeDefinition } from "@/lib/geometry/Shape";
import { useGSAP } from "@gsap/react";

const DEFAULT_STROKE_OPTIONS: StrokeOptions = {
  stroke: "white",
  strokeWidth: 5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeDasharray: 100,
  strokeDashoffset: 100,
};

const MemoizedShape = memo(Shape);

export type PauseIconHandle = {
  toggleVisibility: () => void;
};

type PauseIconProps = {
  ref: React.Ref<PauseIconHandle>;
  size?: number;
  position?: { x: number; y: number };
  fill?: string;
  strokeOptions?: StrokeOptions;
  visible?: boolean;
};

export default function PauseIcon({
  ref,
  size = 100,
  position = { x: 0, y: 0 },
  strokeOptions = DEFAULT_STROKE_OPTIONS,
  visible = true
}: PauseIconProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(visible);
  const [isAnimating, setIsAnimating] = useState(false);
  const localRef = useRef<SVGGElement>(null);
  const hasAnimatedRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setIsVisible(visible), [visible]);

  const shape = useMemo(() => {
    if (!mounted) return null;
    return new ShapeBuilder()
      .addLine({ x: -0.15, y: -0.25 }, { x: -0.15, y: 0.25 })
      .addLine({ x: 0.15, y: -0.25 }, { x: 0.15, y: 0.25 })
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

    // Kill any existing animations immediately
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    gsap.killTweensOf(paths);

    // Skip animation on initial render if not visible
    if (!hasAnimatedRef.current && !isVisible) {
      hasAnimatedRef.current = true;
      // Set hidden state without animation
      gsap.set(paths, {
        strokeDasharray: 100,
        strokeDashoffset: 100,
        opacity: 0,
        filter: "blur(10px)",
      });
      return;
    }

    hasAnimatedRef.current = true;

    const tl = gsap.timeline({
      onStart: () => setIsAnimating(true),
      onComplete: () => {
        setIsAnimating(false);
        timelineRef.current = null;
      }
    });

    timelineRef.current = tl;

    if (isVisible) {
      // Animate in: draw stroke from hidden to visible
      const delay = isAnimating ? 0 : 0.3;
      tl.set(paths, {
        strokeDasharray: 100,
        strokeDashoffset: 100,
        opacity: 1,
        filter: "blur(0px)",
        delay,        
      });
      tl.to(paths, {
        strokeDashoffset: 0,
        duration: "random(0.1, 0.5)",
        ease: "power2.in",
        delay: "random(0, 0.5)",
      });
    } else {
      // Animate out: blur and fade
      tl.set(paths, {
        strokeDashoffset: 0,
        opacity: 1,
        filter: "blur(0px)",
      });
      tl.to(paths, {
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.3,
        ease: "power2.in",
      });
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      gsap.killTweensOf(paths);
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