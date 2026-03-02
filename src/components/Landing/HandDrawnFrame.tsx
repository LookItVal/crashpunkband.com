"use client";

import gsap from "gsap";
import { ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

type HandDrawnFrameProps = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  strokeClassName?: string;
  randomnessSeed?: string | number;
  overhang?: number;
  overhangRandomness?: number;
  overhangRandomnessGain?: number;
  roughness?: number;
  roughnessScale?: number;
  thickness?: number;
  showTop?: boolean;
  showRight?: boolean;
  showBottom?: boolean;
  showLeft?: boolean;
  animateOnLoad?: boolean;
  animateOnInView?: boolean;
  viewTriggerMargin?: string;
  viewTriggerThreshold?: number;
  drawDuration?: number;
  drawStagger?: number;
  drawDelay?: number;
  drawEase?: string;
  drawRandomDelay?: number;
  drawRandomDuration?: number;
};

type Point = {
  x: number;
  y: number;
};

function fract(value: number) {
  return value - Math.floor(value);
}

function hashNoise(value: number, seed: number) {
  const n = Math.sin(value * 12.9898 + seed * 78.233) * 43758.5453;
  return fract(n) * 2 - 1;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function stringToSeed(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash) + 1;
}

function createRoughLinePath(
  start: Point,
  end: Point,
  roughness: number,
  roughnessScale: number,
  seed: number,
) {
  if (roughness <= 0) {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);

  if (length === 0) {
    return `M ${start.x} ${start.y}`;
  }

  const unitX = dx / length;
  const unitY = dy / length;
  const perpX = -unitY;
  const perpY = unitX;
  const segments = Math.max(12, Math.round(14 + roughnessScale * 12));
  const amplitude = 2.8 * roughness;
  const frequency = Math.max(0.05, roughnessScale) * 9;

  const points: Point[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const baseX = start.x + dx * t;
    const baseY = start.y + dy * t;

    if (index === 0 || index === segments) {
      points.push({ x: baseX, y: baseY });
      continue;
    }

    const localNoise = hashNoise(t * frequency, seed);
    const envelope = Math.sin(Math.PI * t);
    const offset = localNoise * amplitude * envelope;

    points.push({
      x: baseX + perpX * offset,
      y: baseY + perpY * offset,
    });
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(3)} ${point.y.toFixed(3)}`)
    .join(" ");
}

export default function HandDrawnFrame({
  children,
  className = "",
  contentClassName = "",
  strokeClassName = "text-white/70",
  randomnessSeed,
  overhang = 3,
  overhangRandomness = 0.5,
  overhangRandomnessGain = 2.4,
  roughness = 0.15,
  roughnessScale = 1,
  thickness = 2,
  showTop = true,
  showRight = true,
  showBottom = true,
  showLeft = true,
  animateOnLoad = true,
  animateOnInView = true,
  viewTriggerMargin = "0px 0px -10% 0px",
  viewTriggerThreshold = 0.05,
  drawDuration = 0.15,
  drawStagger = 0.2,
  drawDelay = 0,
  drawEase = "power3.in",
  drawRandomDelay = 1,
  drawRandomDuration = 0.4,
}: HandDrawnFrameProps) {
  const instanceId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const topPathRef = useRef<SVGPathElement | null>(null);
  const rightPathRef = useRef<SVGPathElement | null>(null);
  const bottomPathRef = useRef<SVGPathElement | null>(null);
  const leftPathRef = useRef<SVGPathElement | null>(null);
  const hasStartedAnimationRef = useRef(false);
  const hasFinishedAnimationRef = useRef(false);
  const animateTimeoutRef = useRef<number | null>(null);
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(!animateOnInView);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const randomSeedValue = useMemo(
    () => stringToSeed(String(randomnessSeed ?? instanceId)),
    [instanceId, randomnessSeed],
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const element = containerRef.current;

    const updateSize = () => {
      const nextWidth = Math.max(1, element.clientWidth);
      const nextHeight = Math.max(1, element.clientHeight);

      setSize((previous) => {
        if (previous && previous.width === nextWidth && previous.height === nextHeight) {
          return previous;
        }

        return { width: nextWidth, height: nextHeight };
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const resolvedRoughness = clamp(roughness, 0, 1);
  const resolvedScale = Math.max(0.05, roughnessScale);
  const resolvedThickness = Math.max(0.5, thickness);
  const resolvedOverhang = Math.max(0, overhang);
  const resolvedOverhangRandomness = clamp(overhangRandomness, 0, 1);

  const seededUnitRandom = useCallback(
    (offset: number) => {
      return (hashNoise(offset * 13.17, randomSeedValue * 0.031) + 1) * 0.5;
    },
    [randomSeedValue],
  );

  const varyOverhang = (seed: number, endpoint: number) => {
    if (resolvedOverhang === 0 || resolvedOverhangRandomness === 0) {
      return resolvedOverhang;
    }

    const baseNoise = hashNoise(
      seed * 3.17 + endpoint * 11.73 + randomSeedValue * 0.013,
      99.41 + randomSeedValue * 0.007,
    );
    const detailNoise =
      hashNoise(seed * 9.31 + endpoint * 2.47 + randomSeedValue * 0.019, 12.77 + randomSeedValue * 0.011) * 0.5;
    const combinedNoise = clamp((baseNoise + detailNoise) / 1.5, -1, 1);

    const varied = resolvedOverhang * (1 + combinedNoise * resolvedOverhangRandomness * overhangRandomnessGain);
    return Math.max(0, varied);
  };

  const topStartOverhang = varyOverhang(1, 1);
  const topEndOverhang = varyOverhang(1, 2);
  const rightStartOverhang = varyOverhang(2, 1);
  const rightEndOverhang = varyOverhang(2, 2);
  const bottomStartOverhang = varyOverhang(3, 1);
  const bottomEndOverhang = varyOverhang(3, 2);
  const leftStartOverhang = varyOverhang(4, 1);
  const leftEndOverhang = varyOverhang(4, 2);

  const {
    topPath,
    rightPath,
    bottomPath,
    leftPath,
    viewBox,
  } = useMemo(() => {
    const frameWidth = size?.width ?? 100;
    const frameHeight = size?.height ?? 100;

    const inset = 3 + resolvedThickness;
    const minX = inset;
    const maxX = Math.max(inset, frameWidth - inset);
    const minY = inset;
    const maxY = Math.max(inset, frameHeight - inset);

    const topStart = { x: minX - topStartOverhang, y: minY };
    const topEnd = { x: maxX + topEndOverhang, y: minY };
    const rightStart = { x: maxX, y: minY - rightStartOverhang };
    const rightEnd = { x: maxX, y: maxY + rightEndOverhang };
    const bottomStart = { x: minX - bottomStartOverhang, y: maxY };
    const bottomEnd = { x: maxX + bottomEndOverhang, y: maxY };
    const leftStart = { x: minX, y: minY - leftStartOverhang };
    const leftEnd = { x: minX, y: maxY + leftEndOverhang };

    return {
      topPath: createRoughLinePath(
        topStart,
        topEnd,
        resolvedRoughness,
        resolvedScale,
        1 + randomSeedValue * 0.1,
      ),
      rightPath: createRoughLinePath(
        rightStart,
        rightEnd,
        resolvedRoughness,
        resolvedScale,
        2 + randomSeedValue * 0.1,
      ),
      bottomPath: createRoughLinePath(
        bottomStart,
        bottomEnd,
        resolvedRoughness,
        resolvedScale,
        3 + randomSeedValue * 0.1,
      ),
      leftPath: createRoughLinePath(
        leftStart,
        leftEnd,
        resolvedRoughness,
        resolvedScale,
        4 + randomSeedValue * 0.1,
      ),
      viewBox: `0 0 ${frameWidth} ${frameHeight}`,
    };
  }, [
    bottomEndOverhang,
    bottomStartOverhang,
    leftEndOverhang,
    leftStartOverhang,
    randomSeedValue,
    resolvedRoughness,
    resolvedScale,
    resolvedThickness,
    rightEndOverhang,
    rightStartOverhang,
    size,
    topEndOverhang,
    topStartOverhang,
  ]);

  useEffect(() => {
    if (!animateOnInView) {
      setHasEnteredView(true);
      return;
    }

    if (!containerRef.current) {
      return;
    }

    const observed = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setHasEnteredView(true);
          observer.unobserve(observed);
        }
      },
      {
        root: null,
        rootMargin: viewTriggerMargin,
        threshold: viewTriggerThreshold,
      },
    );

    observer.observe(observed);

    return () => {
      observer.disconnect();
    };
  }, [animateOnInView, viewTriggerMargin, viewTriggerThreshold]);

  useEffect(() => {
    if (!animateOnLoad || !hasEnteredView || hasStartedAnimationRef.current || !size) {
      return;
    }

    hasStartedAnimationRef.current = true;

    if (animateTimeoutRef.current) {
      window.clearTimeout(animateTimeoutRef.current);
    }

    animateTimeoutRef.current = window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        if (!animateOnLoad) {
          return;
        }

        const pathElements: SVGPathElement[] = [];

        if (showTop && topPathRef.current) {
          pathElements.push(topPathRef.current);
        }
        if (showRight && rightPathRef.current) {
          pathElements.push(rightPathRef.current);
        }
        if (showBottom && bottomPathRef.current) {
          pathElements.push(bottomPathRef.current);
        }
        if (showLeft && leftPathRef.current) {
          pathElements.push(leftPathRef.current);
        }

        if (pathElements.length === 0) {
          return;
        }

        const lengths = pathElements.map((path) => path.getTotalLength());
        const longestLength = Math.max(...lengths, 1);
        const startDelayRandom = drawRandomDelay > 0 ? drawRandomDelay * seededUnitRandom(0.5) : 0;
        const durationRandomFactor = drawRandomDuration > 0 ? seededUnitRandom(1.5) * 2 - 1 : 0;

        pathElements.forEach((path, index) => {
          const length = lengths[index];
          gsap.set(path, {
            strokeDasharray: `${length}`,
            strokeDashoffset: length,
          });
        });

        if (animationTimelineRef.current) {
          animationTimelineRef.current.kill();
          animationTimelineRef.current = null;
        }

        const timeline = gsap.timeline({
          onComplete: () => {
            pathElements.forEach((path) => {
              gsap.set(path, {
                strokeDasharray: "none",
                strokeDashoffset: 0,
              });
            });
            hasFinishedAnimationRef.current = true;
            animationTimelineRef.current = null;
          },
        });

        animationTimelineRef.current = timeline;

        pathElements.forEach((path, index) => {
          const length = lengths[index];
          const normalizedDuration = Math.max(
            0.06,
            drawDuration * (length / longestLength) + drawRandomDuration * durationRandomFactor,
          );

          timeline.to(
            path,
            {
              strokeDashoffset: 0,
              duration: normalizedDuration,
              ease: drawEase,
            },
            drawDelay + startDelayRandom + index * drawStagger,
          );
        });
      });
    }, 120);

    return () => {
      if (animateTimeoutRef.current) {
        window.clearTimeout(animateTimeoutRef.current);
        animateTimeoutRef.current = null;
      }

      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill();
        animationTimelineRef.current = null;
      }

      const pathElements = [
        topPathRef.current,
        rightPathRef.current,
        bottomPathRef.current,
        leftPathRef.current,
      ].filter((path): path is SVGPathElement => path !== null);

      pathElements.forEach((path) => {
        gsap.set(path,
          hasFinishedAnimationRef.current
            ? {
                strokeDasharray: "none",
                strokeDashoffset: 0,
              }
            : {
                strokeDasharray: "100000",
                strokeDashoffset: 100000,
              },
        );
      });

      gsap.killTweensOf([
        topPathRef.current,
        rightPathRef.current,
        bottomPathRef.current,
        leftPathRef.current,
      ]);
    };
  }, [
    animateOnLoad,
    hasEnteredView,
    drawDelay,
    drawDuration,
    drawEase,
    drawRandomDelay,
    drawRandomDuration,
    drawStagger,
    seededUnitRandom,
    showBottom,
    showLeft,
    showRight,
    showTop,
    size,
  ]);

  return (
    <div ref={containerRef} className={["relative", className].join(" ")}>
      <svg
        aria-hidden="true"
        viewBox={viewBox}
        preserveAspectRatio="none"
        className={["pointer-events-none absolute inset-0 h-full w-full", strokeClassName].join(" ")}
      >
        {(() => {
          const hiddenBeforeDraw = animateOnLoad && !hasFinishedAnimationRef.current;
          const preDrawStyle = hiddenBeforeDraw
            ? ({ strokeDasharray: "100000", strokeDashoffset: 100000 } as const)
            : undefined;

          return (
            <>
        {showTop ? (
          <>
            <path
              ref={topPathRef}
              d={topPath}
              fill="none"
              stroke="currentColor"
              strokeWidth={resolvedThickness}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={preDrawStyle}
            />
          </>
        ) : null}
        {showRight ? (
          <>
            <path
              ref={rightPathRef}
              d={rightPath}
              fill="none"
              stroke="currentColor"
              strokeWidth={resolvedThickness}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={preDrawStyle}
            />
          </>
        ) : null}
        {showBottom ? (
          <>
            <path
              ref={bottomPathRef}
              d={bottomPath}
              fill="none"
              stroke="currentColor"
              strokeWidth={resolvedThickness}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={preDrawStyle}
            />
          </>
        ) : null}
        {showLeft ? (
          <>
            <path
              ref={leftPathRef}
              d={leftPath}
              fill="none"
              stroke="currentColor"
              strokeWidth={resolvedThickness}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={preDrawStyle}
            />
          </>
        ) : null}
            </>
          );
        })()}
      </svg>
      <div className={["relative z-10", contentClassName].join(" ")}>{children}</div>
    </div>
  );
}