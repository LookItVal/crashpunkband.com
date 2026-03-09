"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import PlayIcon, { PlayIconHandle } from "@/components/CRASHTheme/Glyphs/Icons/PlayIcon";
import PauseIcon, { PauseIconHandle } from "@/components/CRASHTheme/Glyphs/Icons/PauseIcon";
import VolumeIcon, { VolumeIconHandle } from "@/components/CRASHTheme/Glyphs/Icons/VolumeIcon";
import CircleGroup from "@/components/CRASHTheme/Utilities/CircleGroup";

type AudioPlayerProps = {
  audioSrc: string;
};

export default function AudioPlayer({ audioSrc }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playIconRef = useRef<PlayIconHandle>(null);
  const pauseIconRef = useRef<PauseIconHandle>(null);
  const volumeIconRef = useRef<VolumeIconHandle>(null);

  const circleCenter = useMemo(() => ({ x: 50, y: 50 }), []);
  const circleStrokeOptions = useMemo(() => ({ stroke: "white", strokeWidth: 5 }), []);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    if (isPlaying) {
      playIconRef.current?.toggleVisibility();
      pauseIconRef.current?.toggleVisibility();
    } else {
      playIconRef.current?.toggleVisibility();
      pauseIconRef.current?.toggleVisibility();
    }
  };

  const cycleVolume = () => {
    volumeIconRef.current?.changeLevel(-1);
  };

  return (
    <div className="flex ">
      <svg viewBox="0 0 100 100" className="w-14 h-14 overflow-visible" onClick={togglePlay}>
        <CircleGroup
          center={circleCenter}
          radius={50}
          count={1}
          strokeOptions={circleStrokeOptions}
        />
        <PlayIcon ref={playIconRef} size={100} position={{ x: 50, y: 50 }} fill="#FFFFFF" visible={true}/>
        <PauseIcon ref={pauseIconRef} size={100} position={{ x: 50, y: 50 }} fill="#FFFFFF" visible={false}/>
      </svg>
      <p>long play track</p>
      <svg viewBox="0 0 100 100" className="w-14 h-14 overflow-visible" onClick={cycleVolume}>
        <VolumeIcon ref={volumeIconRef} size={100} position={{ x: 50, y: 50 }} />
      </svg>
    </div>
  );
}