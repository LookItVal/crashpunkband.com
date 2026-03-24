"use client";
import gsap from "gsap";
import { StrokeOptions, ShapeBuilder } from "@/lib/geometry/Shape";
import Shape from "@/components/CRASHTheme/Utilities/Shape";
import { useEffect, useState, useRef, useMemo, memo, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";

const DEFAULT_STROKE_OPTIONS: StrokeOptions = {
  stroke: "white",
  strokeWidth: 5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeDasharray: 0,
  strokeDashoffset: 0,
};

export type VolumeIconHandle = {
  setLevel: (level: number) => void;
  changeLevel: (delta: number) => void;
};

type VolumeIconProps = {
  ref: React.Ref<VolumeIconHandle>;
  size?: number;
  position?: { x: number; y: number };
  strokeOptions?: StrokeOptions;
  level?: number;
};

const clampLevel = (value: number) => Math.max(0, Math.min(3, Math.trunc(value)));

const MemoizedShape = memo(Shape);

export default function VolumeIcon({
  ref,
  size = 100,
  position = { x: 0, y: 0 },
  strokeOptions = DEFAULT_STROKE_OPTIONS,
  level = 3,
}: VolumeIconProps) {
  const [mounted, setMounted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(() => clampLevel(level));
  const localRef = useRef<SVGGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);
  const queuedLevelRef = useRef<number | null>(null);
  const previousVisibilityRef = useRef<{
    wave1: boolean;
    wave2: boolean;
    wave3: boolean;
    mute: boolean;
  } | null>(null);

  const clampedLevel = clampLevel(currentLevel);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const nextLevel = clampLevel(level);
    if (isAnimatingRef.current) {
      queuedLevelRef.current = nextLevel;
      return;
    }
    setCurrentLevel(nextLevel);
  }, [level]);

  useImperativeHandle(ref, () => ({
    setLevel: (nextLevel: number) => {
      const clampedNextLevel = clampLevel(nextLevel);
      if (isAnimatingRef.current) {
        queuedLevelRef.current = clampedNextLevel;
        return;
      }
      setCurrentLevel(clampedNextLevel);
    },
    changeLevel: (delta: number) => {
      const nextLevel = clampLevel(currentLevel + Math.trunc(delta));
      if (isAnimatingRef.current) {
        queuedLevelRef.current = nextLevel;
        return;
      }
      setCurrentLevel(nextLevel);
    }
  }), [currentLevel]);

  const shapes = useMemo(() => {
    if (!mounted) return null;
    const baseShape = new ShapeBuilder()
      .addLine({ x: -0.45, y: -0.2 }, { x: -0.45, y: 0.2 })
      .addLine({ x: -0.45, y: 0.2 }, { x: -0.25, y: 0.2 })
      .addLine({ x: -0.25, y: 0.2 }, { x: 0, y: 0.4 })
      .addLine({ x: 0, y: 0.4 }, { x: 0, y: -0.4 })
      .addLine({ x: 0, y: -0.4 }, { x: -0.25, y: -0.2 })
      .addLine({ x: -0.25, y: -0.2 }, { x: -0.45, y: -0.2 })
      .makeAllLines()
      .scale(size)
      .translate(position)
      .applyOptions({
        type: "line",
        count: 1,
        lineOptions: {
          segmentLength: 20,
          preSegmentNoiseMagnitudes: 2,
          postSegmentNoiseMagnitudes: 2,
        }
      }, { segmentType: "line" })
      .build();

    const wave1Shape = new ShapeBuilder()
      .addCurve({ x: 0.1, y: -0.1 }, { magnitude: 0.1, angle: 20 }, { x: 0.1, y: 0.1 }, { magnitude: 0.1, angle: -20 })
      .scale(size)
      .translate(position)
      .applyOptions({
        type: "curve",
        count: 1,
        curveOptions: {
          segments: 2,
          preSegmentNoiseMagnitudes: 5,
          postSegmentNoiseMagnitudes: 1,
        }
      }, { segmentType: "curve" })
      .build();

    const wave2Shape = new ShapeBuilder()
      .addCurve({ x: 0.175, y: -0.25 }, { magnitude: 0.2125, angle: 20 }, { x: 0.175, y: 0.25 }, { magnitude: 0.2125, angle: -20 })
      .scale(size)
      .translate(position)
      .applyOptions({
        type: "curve",
        count: 1,
        curveOptions: {
          segments: 2,
          preSegmentNoiseMagnitudes: 5,
          postSegmentNoiseMagnitudes: 1,
        }
      }, { segmentType: "curve" })
      .build();

    const wave3Shape = new ShapeBuilder()
      .addCurve({ x: 0.25, y: -0.4 }, { magnitude: 0.325, angle: 20 }, { x: 0.25, y: 0.4 }, { magnitude: 0.325, angle: -20 })
      .scale(size)
      .translate(position)
      .applyOptions({
        type: "curve",
        count: 1,
        curveOptions: {
          segments: 2,
          preSegmentNoiseMagnitudes: 5,
          postSegmentNoiseMagnitudes: 1,
        }
      }, { segmentType: "curve" })
      .build();

    const muteXShape = new ShapeBuilder()
      .addLine({ x: 0.2, y: -0.1 }, { x: 0.4, y: 0.1 })
      .addLine({ x: 0.4, y: -0.1 }, { x: 0.2, y: 0.1 })
      .makeAllLines()
      .scale(size)
      .translate(position)
      .applyOptions({
        type: "line",
        count: 1,
        lineOptions: {
          segmentLength: 20,
          preSegmentNoiseMagnitudes: 2,
          postSegmentNoiseMagnitudes: 2,
        }
      }, { segmentType: "line" })
      .build();

    return {
      baseShape,
      wave1Shape,
      wave2Shape,
      wave3Shape,
      muteXShape,
    };
  }, [mounted, size, position.x, position.y]);

  useGSAP(() => {
    if (!shapes || !localRef.current) return;

    const basePaths = localRef.current.querySelectorAll<SVGPathElement>('[data-part="base"] path');
    const wave1Paths = localRef.current.querySelectorAll<SVGPathElement>('[data-part="wave1"] path');
    const wave2Paths = localRef.current.querySelectorAll<SVGPathElement>('[data-part="wave2"] path');
    const wave3Paths = localRef.current.querySelectorAll<SVGPathElement>('[data-part="wave3"] path');
    const mutePaths = localRef.current.querySelectorAll<SVGPathElement>('[data-part="mute"] path');
    const visibility = {
      wave1: clampedLevel >= 1,
      wave2: clampedLevel >= 2,
      wave3: clampedLevel >= 3,
      mute: clampedLevel === 0,
    };

    const allPaths = [basePaths, wave1Paths, wave2Paths, wave3Paths, mutePaths].flatMap((group) => Array.from(group));

    // First paint: draw in icon using the same line animation system.
    if (!previousVisibilityRef.current) {
      const setHiddenState = (paths: NodeListOf<SVGPathElement>) => {
        if (!paths.length) return;
        gsap.set(paths, {
          strokeDasharray: 100,
          strokeDashoffset: 0,
          opacity: 0,
          filter: "blur(10px)",
        });
      };

      setHiddenState(wave1Paths);
      setHiddenState(wave2Paths);
      setHiddenState(wave3Paths);
      setHiddenState(mutePaths);

      const openingGroups: NodeListOf<SVGPathElement>[] = [basePaths];
      if (visibility.wave1) openingGroups.push(wave1Paths);
      if (visibility.wave2) openingGroups.push(wave2Paths);
      if (visibility.wave3) openingGroups.push(wave3Paths);
      if (visibility.mute) openingGroups.push(mutePaths);

      const tl = gsap.timeline({
        onStart: () => {
          isAnimatingRef.current = true;
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          timelineRef.current = null;
          const queuedLevel = queuedLevelRef.current;
          if (queuedLevel !== null && queuedLevel !== clampedLevel) {
            queuedLevelRef.current = null;
            setCurrentLevel(queuedLevel);
          }
        }
      });
      timelineRef.current = tl;

      openingGroups.forEach((paths, i) => {
        if (!paths.length) return;
        const startAt = i * 0.05;
        Array.from(paths).forEach((path) => {
          const length = path.getTotalLength();
          tl.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 1,
            filter: "blur(0px)",
          }, startAt);
          tl.to(path, {
            strokeDashoffset: 0,
            duration: "random(0.1, 0.5)",
            ease: "power2.in",
            delay: "random(0, 0.5)",
          }, startAt);
        });
      });

      previousVisibilityRef.current = visibility;
      return;
    }

    const previousVisibility = previousVisibilityRef.current;
    const changedParts: Array<"wave1" | "wave2" | "wave3" | "mute"> = [];
    if (previousVisibility.wave1 !== visibility.wave1) changedParts.push("wave1");
    if (previousVisibility.wave2 !== visibility.wave2) changedParts.push("wave2");
    if (previousVisibility.wave3 !== visibility.wave3) changedParts.push("wave3");
    if (previousVisibility.mute !== visibility.mute) changedParts.push("mute");

    if (!changedParts.length) {
      return;
    }

    const partPaths = {
      wave1: wave1Paths,
      wave2: wave2Paths,
      wave3: wave3Paths,
      mute: mutePaths,
    };

    const changedPathElements = changedParts.flatMap((part) => Array.from(partPaths[part]));
    gsap.killTweensOf(changedPathElements);

    const tl = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        timelineRef.current = null;
        const queuedLevel = queuedLevelRef.current;
        if (queuedLevel !== null && queuedLevel !== clampedLevel) {
          queuedLevelRef.current = null;
          setCurrentLevel(queuedLevel);
        }
      }
    });
    timelineRef.current = tl;

    changedParts.forEach((part, i) => {
      const paths = partPaths[part];
      const shouldShow = visibility[part];
      const startAt = i * 0.05;
      if (!paths.length) return;

      if (shouldShow) {
        tl.set(paths, {
          strokeDasharray: 100,
          strokeDashoffset: 100,
          opacity: 1,
          filter: "blur(0px)",
        }, startAt);
        tl.to(paths, {
          strokeDashoffset: 0,
          duration: "random(0.1, 0.5)",
          ease: "power2.in",
          delay: "random(0, 0.5)",
        }, startAt);
      } else {
        tl.set(paths, {
          strokeDashoffset: 0,
          opacity: 1,
          filter: "blur(0px)",
        }, startAt);
        tl.to(paths, {
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.3,
          ease: "power2.in",
          delay: "random(0, 0.5)",
        }, startAt);
      }
    });

    previousVisibilityRef.current = visibility;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      gsap.killTweensOf(allPaths);
    };
  }, { scope: localRef, dependencies: [clampedLevel, shapes] });

  if (!shapes) {
    return <g ref={localRef} />;
  }

  return (
    <g ref={localRef}>
      <g data-part="base">
        <MemoizedShape shape={shapes.baseShape} defaultStrokeOptions={strokeOptions} />
      </g>
      <g data-part="wave1">
        <MemoizedShape shape={shapes.wave1Shape} defaultStrokeOptions={strokeOptions} />
      </g>
      <g data-part="wave2">
        <MemoizedShape shape={shapes.wave2Shape} defaultStrokeOptions={strokeOptions} />
      </g>
      <g data-part="wave3">
        <MemoizedShape shape={shapes.wave3Shape} defaultStrokeOptions={strokeOptions} />
      </g>
      <g data-part="mute">
        <MemoizedShape shape={shapes.muteXShape} defaultStrokeOptions={strokeOptions} />
      </g>
    </g>
  );
}