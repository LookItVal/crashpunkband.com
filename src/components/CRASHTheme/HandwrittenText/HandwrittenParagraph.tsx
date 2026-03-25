"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { getCharShape, CELL_WIDTH, CELL_HEIGHT } from "@/config/handwrittenFont";
import Shape from "@/components/CRASHTheme/Utilities/Shape";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// ── Props ───────────────────────────────────────────────────────────────
type HandwrittenParagraphProps = {
  /** The text to render. May contain newlines for multi-line paragraphs. */
  children: string;
  /** Base font-size in px applied to the monospace layer (default 20). */
  fontSize?: number;
  /** Mobile override for font size in px. Falls back to fontSize when unset. */
  mobileFontSize?: number;
  /** Stroke colour passed to every Shape (default "white"). */
  strokeColor?: string;
  /** Stroke width passed to every Shape (default 2). */
  strokeWidth?: number;
  /** Mobile override for stroke width. Falls back to strokeWidth when unset. */
  mobileStrokeWidth?: number;
  /** Max viewport width considered mobile (default 768). */
  mobileBreakpoint?: number;
  /** Text alignment for both text and SVG glyph layout. */
  textAlign?: "left" | "center" | "right";
  /** Extra className on the outer wrapper. */
  className?: string;
};

/**
 * Renders text as hand-drawn SVG shapes layered on top of invisible,
 * selectable, screen-reader-friendly monospace text.
 *
 * The monospace text defines the layout. The SVG characters are drawn at
 * exactly the same size & position using absolute positioning so the two
 * layers overlap perfectly.
 */
export default function HandwrittenParagraph({
  children,
  fontSize = 20,
  mobileFontSize,
  strokeColor = "white",
  strokeWidth = 2,
  mobileStrokeWidth,
  mobileBreakpoint = 768,
  textAlign = "left",
  className = "",
}: HandwrittenParagraphProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // ── Measure the real monospace character cell ───────────────────────
  // We render a hidden single character, measure it, and use that to
  // size every SVG glyph so the two layers stay perfectly aligned
  // regardless of browser / OS font rendering differences.
  const measureRef = useRef<HTMLSpanElement>(null);
  const [cell, setCell] = useState<{ w: number; h: number } | null>(null);
  const [charLayout, setCharLayout] = useState<Array<{ left: number; top: number }>>([]);

  const effectiveFontSize = isMobile && mobileFontSize !== undefined ? mobileFontSize : fontSize;
  const effectiveStrokeWidth = isMobile && mobileStrokeWidth !== undefined ? mobileStrokeWidth : strokeWidth;

  const chars = useMemo(() => Array.from(children), [children]);

  const shapes = useMemo(() => {
    return chars.map((ch) => {
      if (ch === " " || ch === "\t" || ch === "\n") return null;
      return getCharShape(ch) ?? null;
    });
  }, [chars]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setIsMobile(window.innerWidth <= mobileBreakpoint);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [mobileBreakpoint]);

  useEffect(() => {
    if (!measureRef.current) return;
    const rect = measureRef.current.getBoundingClientRect();
    setCell({ w: rect.width, h: rect.height });
  }, [effectiveFontSize]);

  useEffect(() => {
    if (!layoutRef.current) return;

    const updateLayout = () => {
      if (!layoutRef.current) return;
      const containerRect = layoutRef.current.getBoundingClientRect();
      const spans = layoutRef.current.querySelectorAll<HTMLSpanElement>("span[data-char-idx]");
      const next = Array.from(spans).map((span) => {
        const rect = span.getBoundingClientRect();
        return {
          left: rect.left - containerRect.left,
          top: rect.top - containerRect.top,
        };
      });
      setCharLayout(next);
    };

    updateLayout();

    const observer = new ResizeObserver(() => updateLayout());
    observer.observe(layoutRef.current);
    if (rootRef.current) observer.observe(rootRef.current);

    window.addEventListener("resize", updateLayout);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [children, effectiveFontSize, textAlign]);

  useGSAP(() => {
    if (!rootRef.current || !cell || hasAnimatedRef.current) return;

    const paths = Array.from(rootRef.current.querySelectorAll("path"));
    if (!paths.length) return;

    // Normalize every path to a 0..1 drawing domain so timing feels
    // consistent even for very short glyph strokes.
    paths.forEach((p) => p.setAttribute("pathLength", "1"));

    gsap.set(paths, {
      strokeDasharray: "0 1",
      strokeDashoffset: 0,
      opacity: 0,
    });

    const tl = gsap.timeline({ paused: true });
    let cursor = 0;

    // Build a child timeline for each stroke so opacity + draw happen
    // as one seamless animation instead of separate phases.
    paths.forEach((path) => {
      const strokeDuration = gsap.utils.random(0.1, 0.5);

      const pathTl = gsap.timeline();
      pathTl.to(path, {
        opacity: 1,
        duration: strokeDuration * 0.25,
        ease: "none",
      });
      pathTl.to(path, {
        strokeDasharray: "1 0",
        duration: strokeDuration,
        ease: "none",
      }, 0);

      tl.add(pathTl, gsap.utils.random(0, 1));

      // Keep strokes flowing in order while allowing randomized overlap.
      // Too apply this, add it to the above tl.add() call
      cursor += gsap.utils.random(0, 0.01);
    });

    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top bottom",
      onUpdate: (self) => {
        if (hasAnimatedRef.current || !rootRef.current) return;
        const rect = rootRef.current.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const fullyVisible = rect.top >= 0 && rect.bottom <= vh;
        if (!fullyVisible) return;

        hasAnimatedRef.current = true;
        tl.play(0);
        self.kill();
      },
      onEnter: (self) => {
        if (hasAnimatedRef.current || !rootRef.current) return;
        const rect = rootRef.current.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const fullyVisible = rect.top >= 0 && rect.bottom <= vh;
        if (!fullyVisible) return;

        hasAnimatedRef.current = true;
        tl.play(0);
        self.kill();
      },
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
  }, { dependencies: [cell, children, charLayout.length, effectiveFontSize] });

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      {/* Hidden measurement span — one character to derive cell size */}
      <span
        ref={measureRef}
        aria-hidden
        style={{
          position: "absolute",
          visibility: "hidden",
          fontFamily: "monospace",
          fontSize: `${effectiveFontSize}px`,
          lineHeight: 1.2,
          whiteSpace: "pre",
          pointerEvents: "none",
        }}
      >
        M
      </span>

      {/* Invisible but selectable + accessible monospace text layer */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "monospace",
          fontSize: `${effectiveFontSize}px`,
          lineHeight: 1.2,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          textAlign,
          color: "transparent",
          /* Allow text selection even though it's invisible */
          WebkitUserSelect: "text",
          userSelect: "text",
        }}
      >
        {children}
      </div>

      {/* Hidden wrap layout layer used to measure per-character positions */}
      <div
        ref={layoutRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          visibility: "hidden",
          pointerEvents: "none",
          fontFamily: "monospace",
          fontSize: `${effectiveFontSize}px`,
          lineHeight: 1.2,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          textAlign,
        }}
      >
        {chars.map((ch, idx) => (
          <span data-char-idx={idx} key={`char-${idx}`}>
            {ch}
          </span>
        ))}
      </div>

      {/* SVG shapes layer — absolutely positioned on top of the text */}
      {cell && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {shapes.map((shape, idx) => {
            if (!shape || !charLayout[idx]) return null;

            // Scale the unit-cell shape to match the measured cell
            const scaleX = cell.w / CELL_WIDTH;
            const scaleY = cell.h / CELL_HEIGHT;

            return (
              <svg
                key={`svg-char-${idx}`}
                width={cell.w}
                height={cell.h}
                viewBox={`0 0 ${CELL_WIDTH} ${CELL_HEIGHT}`}
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  left: `${charLayout[idx].left}px`,
                  top: `${charLayout[idx].top}px`,
                  overflow: "visible",
                }}
              >
                <Shape
                  shape={shape}
                  defaultLineOptions={{
                    preSegmentNoiseMagnitudes: 0.05,
                    postSegmentNoiseMagnitudes: 0.015,
                    //preSegmentNoiseMagnitudes: 0,
                    //postSegmentNoiseMagnitudes: 0,
                    segmentLength: 0.3,
                    smoothness: 0.1,
                  }}
                  defaultCount={1}
                  defaultStrokeOptions={{
                    stroke: strokeColor,
                    strokeWidth: effectiveStrokeWidth / Math.max(scaleX, scaleY),
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  }}
                />
              </svg>
            );
          })}
        </div>
      )}
    </div>
  );
}
