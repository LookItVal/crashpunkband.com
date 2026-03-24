"use client";

import { useRef, useEffect } from "react";
import LineGroup from "@/components/CRASHTheme/Utilities/LineGroup";
import C from "@/components/CRASHTheme/Logo/C";
import Brushstroke from "@/components/CRASHTheme/Utilities/Brushstroke";
import CircleGroup from "@/components/CRASHTheme/Utilities/CircleGroup";
import AudioPlayer from "@/components/CRASHTheme/AudioPlayer/AudioPlayer";

export default function TestPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <AudioPlayer audioSrc="/audio/Cut Loose.mp3" />
    </main>
  );
}