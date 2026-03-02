"use client";

import gsap from "gsap";
import { ReactNode, useEffect, useRef } from "react";

type GsapIntroProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function GsapIntro({ children, className = "", delay = 0 }: GsapIntroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    gsap.fromTo(
      containerRef.current,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        delay,
        ease: "power2.out",
      },
    );
  }, [delay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
