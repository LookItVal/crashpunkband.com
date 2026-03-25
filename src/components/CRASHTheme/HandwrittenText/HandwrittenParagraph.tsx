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
  /** Stroke colour passed to every Shape (default "white"). */
  strokeColor?: string;
  /** Stroke width passed to every Shape (default 2). */
  strokeWidth?: number;
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
  strokeColor = "white",
  strokeWidth = 2,
  className = "",
}: HandwrittenParagraphProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // ── Measure the real monospace character cell ───────────────────────
  // We render a hidden single character, measure it, and use that to
  // size every SVG glyph so the two layers stay perfectly aligned
  // regardless of browser / OS font rendering differences.
  const measureRef = useRef<HTMLSpanElement>(null);
  const [cell, setCell] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!measureRef.current) return;
    const rect = measureRef.current.getBoundingClientRect();
    setCell({ w: rect.width, h: rect.height });
  }, [fontSize]);

  // ── Split text into lines ─────────────────────────────────────────
  const lines = useMemo(() => children.split("\n"), [children]);

  // ── Derive shape data per character ───────────────────────────────
  // Each entry is either a ShapeDefinition (renderable) or null (space / unknown).
  const shapesPerLine = useMemo(() => {
    return lines.map((line) =>
      Array.from(line).map((ch) => {
        if (ch === " " || ch === "\t") return null;
        return getCharShape(ch) ?? null;
      })
    );
  }, [lines]);

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
  }, { dependencies: [cell, children] });

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      {/* Hidden measurement span — one character to derive cell size */}
      <span
        ref={measureRef}
        aria-hidden
        style={{
          position: "absolute",
          visibility: "hidden",
          fontFamily: "monospace",
          fontSize: `${fontSize}px`,
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
          fontSize: `${fontSize}px`,
          lineHeight: 1.2,
          whiteSpace: "pre-wrap",
          color: "transparent",
          /* Allow text selection even though it's invisible */
          WebkitUserSelect: "text",
          userSelect: "text",
        }}
      >
        {children}
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
          {shapesPerLine.map((lineShapes, lineIdx) => (
            <div
              key={lineIdx}
              style={{
                height: `${cell.h}px`,
                position: "relative",
                whiteSpace: "nowrap",
              }}
            >
              {lineShapes.map((shape, charIdx) => {
                if (!shape) return null;

                // Scale the unit-cell shape to match the measured cell
                const scaleX = cell.w / CELL_WIDTH;
                const scaleY = cell.h / CELL_HEIGHT;

                return (
                  <svg
                    key={charIdx}
                    width={cell.w}
                    height={cell.h}
                    viewBox={`0 0 ${CELL_WIDTH} ${CELL_HEIGHT}`}
                    preserveAspectRatio="none"
                    style={{
                      position: "absolute",
                      left: `${charIdx * cell.w}px`,
                      top: 0,
                      overflow: "visible",
                    }}
                  >
                    <Shape
                      shape={shape}
                      defaultLineOptions={{
                        preSegmentNoiseMagnitudes: 0.05,
                        postSegmentNoiseMagnitudes: 0.015,
                        segmentLength: 0.3,
                        smoothness: 0.1,
                      }}
                      defaultCount={1}
                      defaultStrokeOptions={{
                        stroke: strokeColor,
                        strokeWidth: strokeWidth / Math.max(scaleX, scaleY),
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }}
                    />
                  </svg>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
