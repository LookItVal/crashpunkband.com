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
  angleRandomness?: number;
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
  const normalizedScale = Math.max(0.05, roughnessScale);
  const density = 0.5 + normalizedScale * 1.35;
  const wavelengthPx = Math.max(10, 28 / density);
  const segments = Math.max(6, Math.round(length / Math.max(4, wavelengthPx * 0.7)));
  const lengthFactor = clamp(length / 100, 0.2, 1.8);
  const amplitude = 2.8 * roughness * (0.5 + lengthFactor * 0.5);
  const frequency = Math.max(0.4, length / wavelengthPx);

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
  strokeClassName = "text-white",
  randomnessSeed,
  overhang = 3,
  overhangRandomness = 0.5,
  overhangRandomnessGain = 2.4,
  angleRandomness = 0.3,
  roughness = 0.5,
  roughnessScale = 0.1,
  thickness = 3,
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
  drawEase = "power2.in",
  drawRandomDelay = 1,
  drawRandomDuration = 0.4,
}: HandDrawnFrameProps) {
  const instanceId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const topPathRef = useRef<SVGPathElement | null>(null);
  const topPathRefSecondary = useRef<SVGPathElement | null>(null);
  const rightPathRef = useRef<SVGPathElement | null>(null);
  const rightPathRefSecondary = useRef<SVGPathElement | null>(null);
  const bottomPathRef = useRef<SVGPathElement | null>(null);
  const bottomPathRefSecondary = useRef<SVGPathElement | null>(null);
  const leftPathRef = useRef<SVGPathElement | null>(null);
  const leftPathRefSecondary = useRef<SVGPathElement | null>(null);
  const hasStartedAnimationRef = useRef(false);
  const hasFinishedAnimationRef = useRef(false);
  const animateTimeoutRef = useRef<number | null>(null);
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(!animateOnInView);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [runtimeSeedSalt, setRuntimeSeedSalt] = useState(0);

  useEffect(() => {
    const unixTimestamp = Math.floor(Date.now() / 1000);
    const sessionEntropy = Math.floor(Math.random() * 1_000_000);
    setRuntimeSeedSalt(unixTimestamp + sessionEntropy);
  }, []);

  const randomSeedValue = useMemo(
    () => stringToSeed(`${String(randomnessSeed ?? instanceId)}-${runtimeSeedSalt}`),
    [instanceId, randomnessSeed, runtimeSeedSalt],
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
  const resolvedAngleRandomness = Math.max(0, angleRandomness);
  const frameMinDimension = Math.max(1, Math.min(size?.width ?? 100, size?.height ?? 100));
  const resolvedAngleRandomnessPx = resolvedAngleRandomness * (frameMinDimension * 0.1);
  const secondaryOverhangJitterPx = Math.max(0, resolvedOverhang * resolvedOverhangRandomness);
  const secondaryAngleJitterPx = Math.max(0.1, (resolvedAngleRandomnessPx * 0.4) );

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

  const varyAngleShift = (seed: number, endpoint: number) => {
    if (resolvedAngleRandomnessPx === 0) {
      return 0;
    }

    const noise = hashNoise(
      seed * 6.41 + endpoint * 8.73 + randomSeedValue * 0.021,
      57.31 + randomSeedValue * 0.017,
    );

    return noise * resolvedAngleRandomnessPx;
  };

  const topStartOverhang = varyOverhang(1, 1);
  const topEndOverhang = varyOverhang(1, 2);
  const rightStartOverhang = varyOverhang(2, 1);
  const rightEndOverhang = varyOverhang(2, 2);
  const bottomStartOverhang = varyOverhang(3, 1);
  const bottomEndOverhang = varyOverhang(3, 2);
  const leftStartOverhang = varyOverhang(4, 1);
  const leftEndOverhang = varyOverhang(4, 2);
  const rightStartAngleShift = varyAngleShift(2, 1);
  const rightEndAngleShift = varyAngleShift(2, 2);
  const leftStartAngleShift = varyAngleShift(4, 1);
  const leftEndAngleShift = varyAngleShift(4, 2);
  const topStartAngleShift = varyAngleShift(1, 1);
  const topEndAngleShift = varyAngleShift(1, 2);
  const bottomStartAngleShift = varyAngleShift(3, 1);
  const bottomEndAngleShift = varyAngleShift(3, 2);

  const {
    topPath,
    topPathSecondary,
    rightPath,
    rightPathSecondary,
    bottomPath,
    bottomPathSecondary,
    leftPath,
    leftPathSecondary,
    viewBox,
  } = useMemo(() => {
    const frameWidth = size?.width ?? 100;
    const frameHeight = size?.height ?? 100;

    const inset = 3 + resolvedThickness;
    const minX = inset;
    const maxX = Math.max(inset, frameWidth - inset);
    const minY = inset;
    const maxY = Math.max(inset, frameHeight - inset);

    const topStart = { x: minX - topStartOverhang, y: minY + topStartAngleShift };
    const topEnd = { x: maxX + topEndOverhang, y: minY + topEndAngleShift };
    const rightStart = { x: maxX + rightStartAngleShift, y: minY - rightStartOverhang };
    const rightEnd = { x: maxX + rightEndAngleShift, y: maxY + rightEndOverhang };
    const bottomStart = { x: minX - bottomStartOverhang, y: maxY + bottomStartAngleShift };
    const bottomEnd = { x: maxX + bottomEndOverhang, y: maxY + bottomEndAngleShift };
    const leftStart = { x: minX + leftStartAngleShift, y: minY - leftStartOverhang };
    const leftEnd = { x: minX + leftEndAngleShift, y: maxY + leftEndOverhang };

    const secondaryJitter = (seed: number, endpoint: number, amplitude: number) => {
      return hashNoise(
        seed * 5.61 + endpoint * 9.17 + randomSeedValue * 0.023,
        74.13 + randomSeedValue * 0.015,
      ) * amplitude;
    };

    const topStartSecondary = {
      x: topStart.x - secondaryJitter(101, 1, secondaryOverhangJitterPx),
      y: topStart.y + secondaryJitter(111, 1, secondaryAngleJitterPx),
    };
    const topEndSecondary = {
      x: topEnd.x + secondaryJitter(101, 2, secondaryOverhangJitterPx),
      y: topEnd.y + secondaryJitter(111, 2, secondaryAngleJitterPx),
    };
    const rightStartSecondary = {
      x: rightStart.x + secondaryJitter(121, 1, secondaryAngleJitterPx),
      y: rightStart.y - secondaryJitter(131, 1, secondaryOverhangJitterPx),
    };
    const rightEndSecondary = {
      x: rightEnd.x + secondaryJitter(121, 2, secondaryAngleJitterPx),
      y: rightEnd.y + secondaryJitter(131, 2, secondaryOverhangJitterPx),
    };
    const bottomStartSecondary = {
      x: bottomStart.x - secondaryJitter(141, 1, secondaryOverhangJitterPx),
      y: bottomStart.y + secondaryJitter(151, 1, secondaryAngleJitterPx),
    };
    const bottomEndSecondary = {
      x: bottomEnd.x + secondaryJitter(141, 2, secondaryOverhangJitterPx),
      y: bottomEnd.y + secondaryJitter(151, 2, secondaryAngleJitterPx),
    };
    const leftStartSecondary = {
      x: leftStart.x + secondaryJitter(161, 1, secondaryAngleJitterPx),
      y: leftStart.y - secondaryJitter(171, 1, secondaryOverhangJitterPx),
    };
    const leftEndSecondary = {
      x: leftEnd.x + secondaryJitter(161, 2, secondaryAngleJitterPx),
      y: leftEnd.y + secondaryJitter(171, 2, secondaryOverhangJitterPx),
    };

    return {
      topPath: createRoughLinePath(
        topStart,
        topEnd,
        resolvedRoughness,
        resolvedScale,
        1 + randomSeedValue * 0.1,
      ),
      topPathSecondary: createRoughLinePath(
        topStartSecondary,
        topEndSecondary,
        resolvedRoughness,
        resolvedScale,
        11 + randomSeedValue * 0.17,
      ),
      rightPath: createRoughLinePath(
        rightStart,
        rightEnd,
        resolvedRoughness,
        resolvedScale,
        2 + randomSeedValue * 0.1,
      ),
      rightPathSecondary: createRoughLinePath(
        rightStartSecondary,
        rightEndSecondary,
        resolvedRoughness,
        resolvedScale,
        12 + randomSeedValue * 0.17,
      ),
      bottomPath: createRoughLinePath(
        bottomStart,
        bottomEnd,
        resolvedRoughness,
        resolvedScale,
        3 + randomSeedValue * 0.1,
      ),
      bottomPathSecondary: createRoughLinePath(
        bottomStartSecondary,
        bottomEndSecondary,
        resolvedRoughness,
        resolvedScale,
        13 + randomSeedValue * 0.17,
      ),
      leftPath: createRoughLinePath(
        leftStart,
        leftEnd,
        resolvedRoughness,
        resolvedScale,
        4 + randomSeedValue * 0.1,
      ),
      leftPathSecondary: createRoughLinePath(
        leftStartSecondary,
        leftEndSecondary,
        resolvedRoughness,
        resolvedScale,
        14 + randomSeedValue * 0.17,
      ),
      viewBox: `0 0 ${frameWidth} ${frameHeight}`,
    };
  }, [
    bottomEndOverhang,
    bottomEndAngleShift,
    bottomStartOverhang,
    bottomStartAngleShift,
    leftEndAngleShift,
    leftEndOverhang,
    leftStartAngleShift,
    leftStartOverhang,
    randomSeedValue,
    resolvedRoughness,
    resolvedScale,
    resolvedThickness,
    secondaryAngleJitterPx,
    secondaryOverhangJitterPx,
    rightEndAngleShift,
    rightEndOverhang,
    rightStartAngleShift,
    rightStartOverhang,
    size,
    topEndOverhang,
    topEndAngleShift,
    topStartOverhang,
    topStartAngleShift,
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
        if (showTop && topPathRefSecondary.current) {
          pathElements.push(topPathRefSecondary.current);
        }
        if (showRight && rightPathRef.current) {
          pathElements.push(rightPathRef.current);
        }
        if (showRight && rightPathRefSecondary.current) {
          pathElements.push(rightPathRefSecondary.current);
        }
        if (showBottom && bottomPathRef.current) {
          pathElements.push(bottomPathRef.current);
        }
        if (showBottom && bottomPathRefSecondary.current) {
          pathElements.push(bottomPathRefSecondary.current);
        }
        if (showLeft && leftPathRef.current) {
          pathElements.push(leftPathRef.current);
        }
        if (showLeft && leftPathRefSecondary.current) {
          pathElements.push(leftPathRefSecondary.current);
        }

        if (pathElements.length === 0) {
          return;
        }

        const orderedPathElements = [...pathElements];
        for (let index = orderedPathElements.length - 1; index > 0; index -= 1) {
          const swapIndex = Math.floor(Math.random() * (index + 1));
          [orderedPathElements[index], orderedPathElements[swapIndex]] = [
            orderedPathElements[swapIndex],
            orderedPathElements[index],
          ];
        }

        const lengths = orderedPathElements.map((path) => path.getTotalLength());
        const longestLength = Math.max(...lengths, 1);
        const startDelayRandom = drawRandomDelay > 0 ? drawRandomDelay * seededUnitRandom(0.5) : 0;
        const durationRandomFactor = drawRandomDuration > 0 ? seededUnitRandom(1.5) * 2 - 1 : 0;

        orderedPathElements.forEach((path, index) => {
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
            orderedPathElements.forEach((path) => {
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

        orderedPathElements.forEach((path, index) => {
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
        topPathRefSecondary.current,
        rightPathRef.current,
        rightPathRefSecondary.current,
        bottomPathRef.current,
        bottomPathRefSecondary.current,
        leftPathRef.current,
        leftPathRefSecondary.current,
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
        topPathRefSecondary.current,
        rightPathRef.current,
        rightPathRefSecondary.current,
        bottomPathRef.current,
        bottomPathRefSecondary.current,
        leftPathRef.current,
        leftPathRefSecondary.current,
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
        className={["pointer-events-none absolute inset-0 h-full w-full overflow-visible", strokeClassName].join(" ")}
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
            <path
              ref={topPathRefSecondary}
              d={topPathSecondary}
              fill="none"
              stroke="currentColor"
              strokeWidth={resolvedThickness * 0.9}
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
            <path
              ref={rightPathRefSecondary}
              d={rightPathSecondary}
              fill="none"
              stroke="currentColor"
              strokeWidth={resolvedThickness * 0.9}
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
            <path
              ref={bottomPathRefSecondary}
              d={bottomPathSecondary}
              fill="none"
              stroke="currentColor"
              strokeWidth={resolvedThickness * 0.9}
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
            <path
              ref={leftPathRefSecondary}
              d={leftPathSecondary}
              fill="none"
              stroke="currentColor"
              strokeWidth={resolvedThickness * 0.9}
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