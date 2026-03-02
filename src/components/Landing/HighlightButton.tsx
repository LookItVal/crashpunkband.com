"use client";

import gsap from "gsap";
import { ReactNode, useRef } from "react";

type HighlightButtonProps = {
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  textClassName?: string;
  angleRandomness?: number;
};

export default function HighlightButton({
  children,
  href,
  target,
  rel,
  className = "",
  textClassName = "",
  angleRandomness = 2,
}: HighlightButtonProps) {
  const highlightRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  const animateIn = () => {
    if (!highlightRef.current || !textRef.current) {
      return;
    }

    const tilt = (Math.random() * 2 - 1) * Math.max(0, angleRandomness);

    gsap.killTweensOf([highlightRef.current, textRef.current]);
    gsap.to(highlightRef.current, {
      scaleX: 1,
      rotate: tilt,
      duration: 0.24,
      ease: "power2.out",
      transformOrigin: "left center",
    });
    gsap.to(textRef.current, {
      color: "#050505",
      duration: 0.2,
      ease: "power1.out",
    });
  };

  const animateOut = () => {
    if (!highlightRef.current || !textRef.current) {
      return;
    }

    gsap.killTweensOf([highlightRef.current, textRef.current]);
    gsap.to(highlightRef.current, {
      scaleX: 0,
      rotate: 0,
      duration: 0.22,
      ease: "power2.inOut",
      transformOrigin: "right center",
    });
    gsap.to(textRef.current, {
      color: "#f5f5f5",
      duration: 0.2,
      ease: "power1.out",
    });
  };

  const content = (
    <>
      <span ref={highlightRef} className="pointer-events-none absolute inset-0 z-0 origin-left scale-x-0 bg-white/90" />
      <span
        ref={textRef}
        className={[
          "relative z-10 inline-flex items-center gap-2 whitespace-nowrap text-zinc-100 transition-colors",
          textClassName,
        ].join(" ")}
      >
        {children}
      </span>
    </>
  );

  const sharedProps = {
    onMouseEnter: animateIn,
    onMouseLeave: animateOut,
    onFocus: animateIn,
    onBlur: animateOut,
    className: ["relative inline-flex", className].join(" "),
  };

  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...sharedProps}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" {...sharedProps}>
      {content}
    </button>
  );
}
