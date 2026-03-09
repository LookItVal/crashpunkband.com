"use client";

import { useRef } from "react";
import LineGroup from "@/components/CRASHTheme/Utilities/LineGroup";
import C from "@/components/CRASHTheme/Logo/C";
import Brushstroke from "@/components/CRASHTheme/Utilities/Brushstroke";
import CircleGroup from "@/components/CRASHTheme/Utilities/CircleGroup";
import PlayIcon from "@/components/CRASHTheme/Glyphs/Icons/PlayIcon";

export default function TestPage() {
  const playIconRef = useRef<SVGElement>(null);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-100 h-100 overflow-visible">
        <PlayIcon
          ref={playIconRef}
          size={10}
          position={{ x: 50, y: 50 }}
          fill="#FFFFFF"
        />
      </svg>
    </main>
  );
}