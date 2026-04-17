"use client";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PlayIcon, { PlayIconHandle } from "@/components/CRASHTheme/Glyphs/Icons/PlayIcon";
import PauseIcon, { PauseIconHandle } from "@/components/CRASHTheme/Glyphs/Icons/PauseIcon";
import VolumeControl from "@/components/CRASHTheme/AudioPlayer/VolumeControl";
import CircleGroup from "@/components/CRASHTheme/Utilities/CircleGroup";
import LineGroup from "@/components/CRASHTheme/Utilities/LineGroup";

type AudioPlayerProps = {
  audioSrc: string;
  onEnded?: () => void;
  onPlaying?: () => void;
  autoPlay?: boolean;
  togglePlaySignal?: number;
  /** When provided, AudioPlayer controls this external element instead of rendering its own. */
  externalAudioRef?: React.RefObject<HTMLAudioElement | null>;
  /** Bump to force re-bind event listeners after swapping the external element. */
  audioElementKey?: number;
};

export default function AudioPlayer({ audioSrc, onEnded, onPlaying, autoPlay, togglePlaySignal, externalAudioRef, audioElementKey = 0 }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const internalAudioRef = useRef<HTMLAudioElement>(null);
  const getAudio = useCallback((): HTMLAudioElement | null => {
    return externalAudioRef?.current ?? internalAudioRef.current;
  }, [externalAudioRef]);
  const trackSvgRef = useRef<SVGSVGElement>(null);
  const trackProgressGroupRef = useRef<SVGGElement>(null);
  const playIconRef = useRef<PlayIconHandle>(null);
  const pauseIconRef = useRef<PauseIconHandle>(null);
  const playControlRef = useRef<SVGSVGElement>(null);
  const hasAnimatedRingRef = useRef(false);
  const hasAnimatedTrackRef = useRef(false);
  const previousIsPlayingRef = useRef(false);
  const isSeekingRef = useRef(false);
  const rafProgressRef = useRef<number | null>(null);
  const prevAudioSrcRef = useRef(audioSrc);

  const circleCenter = useMemo(() => ({ x: 50, y: 50 }), []);
  const circleStrokeOptions = useMemo(() => ({ stroke: "white", strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }), []);
  const trackStart = useMemo(() => ({ x: 16, y: 50 }), []);
  const trackEnd = useMemo(() => ({ x: 484, y: 50 }), []);
  const trackLineOptions = useMemo(() => ({
    smoothness: 0.8,
    segmentLength: 16,
    preSegmentNoiseMagnitudes: 0,
    postSegmentNoiseMagnitudes: 1,
  }), []);
  const trackStrokeOptions = useMemo(() => ({
    stroke: "white",
    strokeWidth: 5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }), []);
  const trackProgressLineOptions = useMemo(() => ({
    smoothness: 0.8,
    segmentLength: 16,
    preSegmentNoiseMagnitudes: 0,
    postSegmentNoiseMagnitudes: 1,
  }), []);
  const knobStrokeOptions = useMemo(() => ({
    stroke: "white",
    strokeWidth: 4,
    strokeLinecap: "round" as const,
  }), []);
  const trackKnobCircleOptions = useMemo(() => ({
    rotation: -90,
    overhangAngle: -10,
    overhangAngleNoise: 10,
    segments: 4,
    segmentNoiseMagnitudes: 1,
  }), []);
  const trackKnobLocalCenter = useMemo(() => ({ x: 0, y: 0 }), []);

  const resolveDuration = useCallback(() => {
    const audio = getAudio();
    if (!audio) return 0;

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      return audio.duration;
    }

    if (audio.seekable && audio.seekable.length > 0) {
      const seekableEnd = audio.seekable.end(audio.seekable.length - 1);
      if (Number.isFinite(seekableEnd) && seekableEnd > 0) {
        return seekableEnd;
      }
    }

    return 0;
  }, [getAudio]);

  const syncDuration = useCallback(() => {
    const nextDuration = resolveDuration();
    if (nextDuration > 0) {
      setDuration((prev) => (Math.abs(prev - nextDuration) > 0.05 ? nextDuration : prev));
      return nextDuration;
    }

    const audio = getAudio();
    if (audio && audio.currentTime > 0) {
      const provisionalDuration = audio.currentTime + 1;
      setDuration((prev) => Math.max(prev, provisionalDuration));
      return provisionalDuration;
    }

    return 0;
  }, [resolveDuration, getAudio]);

  const progress = useMemo(() => {
    if (duration <= 0) return 0;
    return Math.max(0, Math.min(1, currentTime / duration));
  }, [currentTime, duration]);

  const trackKnobPosition = useMemo(() => {
    const x = trackStart.x + ((trackEnd.x - trackStart.x) * progress);
    return { x, y: trackStart.y };
  }, [progress, trackStart.x, trackStart.y, trackEnd.x]);

  const applySeekFromClientPoint = useCallback((clientX: number, clientY: number) => {
    const audio = getAudio();
    if (!audio || !trackSvgRef.current) return;

    const resolvedDuration = syncDuration() || duration;
    if (resolvedDuration <= 0) return;

    const pt = trackSvgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const matrix = trackSvgRef.current.getScreenCTM();
    if (!matrix) return;

    const svgPoint = pt.matrixTransform(matrix.inverse());
    const clampedX = Math.max(trackStart.x, Math.min(trackEnd.x, svgPoint.x));
    const ratio = (clampedX - trackStart.x) / (trackEnd.x - trackStart.x);
    const nextTime = ratio * resolvedDuration;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, [duration, syncDuration, trackStart.x, trackEnd.x, getAudio]);

  const handleTrackPointerDown = useCallback((e: React.PointerEvent<SVGRectElement>) => {
    e.stopPropagation();
    e.preventDefault();
    applySeekFromClientPoint(e.clientX, e.clientY);
    setIsSeeking(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [applySeekFromClientPoint]);

  const handleTrackPointerMove = useCallback((e: PointerEvent) => {
    if (!isSeekingRef.current) return;
    applySeekFromClientPoint(e.clientX, e.clientY);
  }, [applySeekFromClientPoint]);

  const handleTrackPointerUp = useCallback(() => {
    setIsSeeking(false);
  }, []);

  useGSAP(() => {
    if (!playControlRef.current || hasAnimatedRingRef.current) return;

    let rafId = 0;
    let attempts = 0;
    const maxAttempts = 24;

    const animateRingWhenReady = () => {
      if (!playControlRef.current || hasAnimatedRingRef.current) return;

      const circlePaths = playControlRef.current.querySelectorAll<SVGPathElement>('[data-part="play-ring"] path');
      if (!circlePaths.length) {
        attempts += 1;
        if (attempts < maxAttempts) {
          rafId = window.requestAnimationFrame(animateRingWhenReady);
        }
        return;
      }

      hasAnimatedRingRef.current = true;

      circlePaths.forEach((path) => {
        const pathLength = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: -pathLength,
          opacity: 1,
        });
      });

      gsap.to(circlePaths, {
        strokeDashoffset: 0,
        duration: "random(0.24, 0.4)",
        ease: "power2.out",
        stagger: 0.04,
        delay: 0.1,
      });
    };

    animateRingWhenReady();

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, { scope: playControlRef });

  useGSAP(() => {
    if (!trackSvgRef.current || hasAnimatedTrackRef.current) return;

    let rafId = 0;
    let attempts = 0;
    const maxAttempts = 24;

    const animateTrackWhenReady = () => {
      if (!trackSvgRef.current || hasAnimatedTrackRef.current) return;

      const basePaths = trackSvgRef.current.querySelectorAll<SVGPathElement>('[data-part="track-base"] path');
      const knobPaths = trackSvgRef.current.querySelectorAll<SVGPathElement>('[data-part="track-knob"] path');
      if (!basePaths.length || !knobPaths.length) {
        attempts += 1;
        if (attempts < maxAttempts) {
          rafId = window.requestAnimationFrame(animateTrackWhenReady);
        }
        return;
      }

      const trackPaths = [...basePaths, ...knobPaths];

      hasAnimatedTrackRef.current = true;

      trackPaths.forEach((path) => {
        const pathLength = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          opacity: 1,
        });
      });

      gsap.to(trackPaths, {
        strokeDashoffset: 0,
        duration: () => gsap.utils.random(0.1, 0.5),
        delay: () => gsap.utils.random(0, 0.5),
        ease: "power2.out",
        stagger: 0.03,
      });
    };

    animateTrackWhenReady();

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, { scope: trackSvgRef });

  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  useEffect(() => {
    window.addEventListener("pointermove", handleTrackPointerMove);
    window.addEventListener("pointerup", handleTrackPointerUp);
    window.addEventListener("pointercancel", handleTrackPointerUp);
    return () => {
      window.removeEventListener("pointermove", handleTrackPointerMove);
      window.removeEventListener("pointerup", handleTrackPointerUp);
      window.removeEventListener("pointercancel", handleTrackPointerUp);
    };
  }, [handleTrackPointerMove, handleTrackPointerUp]);

  useEffect(() => {
    const audio = getAudio();
    if (!audio || !isPlaying) {
      if (rafProgressRef.current !== null) {
        window.cancelAnimationFrame(rafProgressRef.current);
        rafProgressRef.current = null;
      }
      return;
    }

    const tick = () => {
      if (!audio) return;
      syncDuration();
      setCurrentTime(audio.currentTime || 0);
      rafProgressRef.current = window.requestAnimationFrame(tick);
    };

    rafProgressRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafProgressRef.current !== null) {
        window.cancelAnimationFrame(rafProgressRef.current);
        rafProgressRef.current = null;
      }
    };
  }, [isPlaying, syncDuration, getAudio, audioElementKey]);

  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;

    const handleLoadedMetadata = () => {
      syncDuration();
      setCurrentTime(audio.currentTime || 0);
    };

    const handleTimeUpdate = () => {
      syncDuration();
      setCurrentTime(audio.currentTime || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePlaying = () => {
      onPlaying?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
      onEnded?.();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("loadeddata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Sync initial state — the element may already be playing after a swap
    if (!audio.paused) setIsPlaying(true);
    syncDuration();
    setCurrentTime(audio.currentTime || 0);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("loadeddata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioSrc, syncDuration, onEnded, onPlaying, getAudio, audioElementKey]);

  useEffect(() => {
    // When using an external audio element, the parent manages loading.
    if (externalAudioRef) return;

    const audio = getAudio();
    if (!audio || audioSrc === prevAudioSrcRef.current) return;

    prevAudioSrcRef.current = audioSrc;
    audio.load();

    if (autoPlay) {
      setIsPlaying(true);
      void audio.play().catch(() => setIsPlaying(false));
    }
  }, [audioSrc, autoPlay, externalAudioRef, getAudio]);

  useEffect(() => {
    if (!trackProgressGroupRef.current) return;

    const clampedProgress = Math.max(0, Math.min(1, progress));
    const progressPaths = trackProgressGroupRef.current.querySelectorAll<SVGPathElement>("path");

    progressPaths.forEach((path) => {
      const totalLength = path.getTotalLength();
      const visibleLength = totalLength * clampedProgress;

      path.style.strokeDasharray = `${visibleLength} ${totalLength}`;
      path.style.strokeDashoffset = "0";
      path.style.opacity = clampedProgress > 0 ? "1" : "0";
    });
  }, [progress]);

  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;
    audio.volume = volume;
  }, [volume, getAudio, audioElementKey]);

  useEffect(() => {
    if (previousIsPlayingRef.current === isPlaying) return;
    playIconRef.current?.toggleVisibility();
    pauseIconRef.current?.toggleVisibility();
    previousIsPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = getAudio();
    if (!audio) return;

    if (audio.paused) {
      setIsPlaying(true);
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      setIsPlaying(false);
      audio.pause();
    }
  }, [getAudio]);

  const togglePlaySignalRef = useRef(togglePlaySignal ?? 0);
  useEffect(() => {
    if (togglePlaySignal !== undefined && togglePlaySignal !== togglePlaySignalRef.current) {
      togglePlaySignalRef.current = togglePlaySignal;
      togglePlay();
    }
  }, [togglePlaySignal, togglePlay]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  return (
    <div className="flex items-center gap-6 scale-70 md:scale-100">
      {!externalAudioRef && <audio ref={internalAudioRef} src={audioSrc} preload="metadata" />}
      <svg ref={playControlRef} viewBox="0 0 100 100" className="w-14 h-14 overflow-visible" onClick={togglePlay}>
        <g data-part="play-ring">
          <CircleGroup
            center={circleCenter}
            radius={50}
            count={1}
            strokeOptions={circleStrokeOptions}
          />
        </g>
        <PlayIcon ref={playIconRef} size={100} position={{ x: 50, y: 50 }} fill="#FFFFFF" visible={true}/>
        <PauseIcon ref={pauseIconRef} size={100} position={{ x: 50, y: 50 }} fill="#FFFFFF" visible={false}/>
      </svg>

      <svg ref={trackSvgRef} viewBox="0 0 500 100" className="h-14 flex-1 min-w-0 overflow-visible">
        <g>
          {/* Track background line (organic, dimmed) */}
          <g data-part="track-base" style={{ pointerEvents: "none" }}>
            <LineGroup
              start={trackStart}
              end={trackEnd}
              count={1}
              options={trackLineOptions}
              strokeOptions={{ ...trackStrokeOptions, stroke: "rgba(255,255,255,0.3)" }}
            />
          </g>
          {/* Progress fill — full line is fixed, visible segment grows via dasharray */}
          <g ref={trackProgressGroupRef} style={{ pointerEvents: "none" }}>
            <LineGroup
              start={trackStart}
              end={trackEnd}
              count={1}
              options={trackProgressLineOptions}
              strokeOptions={trackStrokeOptions}
            />
          </g>
          {/* Knob circle */}
          <g
            data-part="track-knob"
            transform={`translate(${trackKnobPosition.x} ${trackKnobPosition.y})`}
            style={{ pointerEvents: "none" }}
          >
            <CircleGroup
              center={trackKnobLocalCenter}
              radius={9}
              count={1}
              postNoiseMagnitude={0}
              options={trackKnobCircleOptions}
              strokeOptions={knobStrokeOptions}
            />
          </g>
          {/* Hit rect — rendered last = topmost Z, catches all pointer events */}
          <rect
            x={trackStart.x - 8}
            y={trackStart.y - 24}
            width={(trackEnd.x - trackStart.x) + 16}
            height={48}
            fill="transparent"
            onPointerDown={handleTrackPointerDown}
            style={{ cursor: "ew-resize" }}
          />
        </g>
      </svg>

      <svg viewBox="0 0 100 100" className="w-14 h-14 overflow-visible">
        <VolumeControl size={100} position={{ x: 50, y: 50 }} onVolumeChange={handleVolumeChange} />
      </svg>
    </div>
  );
}