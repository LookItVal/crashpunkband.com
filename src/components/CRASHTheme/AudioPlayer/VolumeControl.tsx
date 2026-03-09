"use client";
import { useRef, useState, useMemo, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import VolumeIcon, { VolumeIconHandle } from "@/components/CRASHTheme/Glyphs/Icons/VolumeIcon";
import LineGroup from "@/components/CRASHTheme/Utilities/LineGroup";
import CircleGroup from "@/components/CRASHTheme/Utilities/CircleGroup";

type VolumeControlProps = {
  size?: number;
  position?: { x: number; y: number };
  onVolumeChange?: (volume: number) => void;
};

export default function VolumeControl({
  size = 100,
  position = { x: 0, y: 0 },
  onVolumeChange,
}: VolumeControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(0.75); // 0-1 range
  const [isDragging, setIsDragging] = useState(false);
  
  const localRef = useRef<SVGGElement>(null);
  const volumeIconRef = useRef<VolumeIconHandle>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const volumeTweenRef = useRef<gsap.core.Tween | null>(null);
  const isDraggingRef = useRef(false);

  const faderHeight = size * 1.5; // Height of the fader track
  const faderTop = position.y - size * 0.5; // Top of icon
  const faderBottom = faderTop - faderHeight;

  // Map volume (0-1) to icon level (0-3)
  const iconLevel = useMemo(() => {
    if (volume === 0) return 0;
    if (volume <= 0.33) return 1;
    if (volume <= 0.66) return 2;
    return 3;
  }, [volume]);

  // Calculate knob Y position from volume
  const knobY = useMemo(() => {
    return faderTop - (volume * faderHeight);
  }, [volume, faderTop, faderHeight]);

  const lineStart = useMemo(() => ({ x: position.x, y: faderTop }), [position.x, faderTop]);
  const lineEnd = useMemo(() => ({ x: position.x, y: faderBottom }), [position.x, faderBottom]);
  const knobCenter = useMemo(() => ({ x: position.x, y: knobY }), [position.x, knobY]);

  const setVolumeValue = useCallback((nextVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, nextVolume));
    setVolume(clampedVolume);
    if (onVolumeChange) {
      onVolumeChange(clampedVolume);
    }
  }, [onVolumeChange]);

  const getVolumeFromClientPoint = useCallback((clientX: number, clientY: number) => {
    if (!localRef.current) return null;
    const svg = localRef.current.ownerSVGElement;
    if (!svg) return null;

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;

    const svgPoint = pt.matrixTransform(matrix.inverse());
    const newY = Math.max(faderBottom, Math.min(faderTop, svgPoint.y));
    return 1 - ((newY - faderBottom) / faderHeight);
  }, [faderBottom, faderTop, faderHeight]);

  const animateVolumeTo = useCallback((targetVolume: number) => {
    if (volumeTweenRef.current) {
      volumeTweenRef.current.kill();
      volumeTweenRef.current = null;
    }

    const proxy = { value: volume };
    volumeTweenRef.current = gsap.to(proxy, {
      value: Math.max(0, Math.min(1, targetVolume)),
      duration: 0.22,
      ease: "power2.out",
      onUpdate: () => {
        setVolumeValue(proxy.value);
      },
      onComplete: () => {
        volumeTweenRef.current = null;
      }
    });
  }, [volume, setVolumeValue]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGGElement>) => {
    e.stopPropagation();
    if (volumeTweenRef.current) {
      volumeTweenRef.current.kill();
      volumeTweenRef.current = null;
    }
    setIsDragging(true);
  }, []);

  const handleTrackMouseDown = useCallback((e: React.MouseEvent<SVGRectElement>) => {
    e.stopPropagation();
    const targetVolume = getVolumeFromClientPoint(e.clientX, e.clientY);
    if (targetVolume === null) return;
    animateVolumeTo(targetVolume);
    setIsDragging(true);
  }, [animateVolumeTo, getVolumeFromClientPoint]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isOpen || !isDraggingRef.current) return;
    const nextVolume = getVolumeFromClientPoint(e.clientX, e.clientY);
    if (nextVolume === null) return;
    if (volumeTweenRef.current) {
      volumeTweenRef.current.kill();
      volumeTweenRef.current = null;
    }
    setVolumeValue(nextVolume);
  }, [isOpen, getVolumeFromClientPoint, setVolumeValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useGSAP(() => {
    isDraggingRef.current = isDragging;
  }, { dependencies: [isDragging] });

  // Set up global drag listeners once so mouseup works anywhere.
  useGSAP(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, { dependencies: [handleMouseMove, handleMouseUp] });

  // Update icon level when volume changes
  useGSAP(() => {
    volumeIconRef.current?.setLevel(iconLevel);
  }, { dependencies: [iconLevel] });

  // Animate fader in/out
  useGSAP(() => {
    if (!localRef.current) return;

    const linePaths = localRef.current.querySelectorAll<SVGPathElement>('[data-part="fader-line"] path');
    const knobPaths = localRef.current.querySelectorAll<SVGPathElement>('[data-part="fader-knob"] path');
    const allPaths = [...Array.from(linePaths), ...Array.from(knobPaths)];

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    gsap.killTweensOf(allPaths);

    const tl = gsap.timeline({
      onComplete: () => {
        timelineRef.current = null;
      }
    });
    timelineRef.current = tl;

    if (isOpen) {
      // Draw in: line first, then knob
      tl.set(linePaths, {
        strokeDasharray: 200,
        strokeDashoffset: 200,
        opacity: 1,
        filter: "blur(0px)",
      });
      tl.to(linePaths, {
        strokeDashoffset: 0,
        duration: 0.4,
        ease: "power2.out",
      });
      tl.set(knobPaths, {
        strokeDasharray: 100,
        strokeDashoffset: 100,
        opacity: 1,
        filter: "blur(0px)",
      }, "-=0.1");
      tl.to(knobPaths, {
        strokeDashoffset: 0,
        duration: "random(0.1, 0.3)",
        ease: "power2.in",
        delay: "random(0, 0.1)",
      });
    } else {
      // Fade out: blur and fade both
      tl.set(allPaths, {
        strokeDashoffset: 0,
        opacity: 1,
        filter: "blur(0px)",
      });
      tl.to(allPaths, {
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.3,
        ease: "power2.in",
      });
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      gsap.killTweensOf(allPaths);
    };
  }, { scope: localRef, dependencies: [isOpen] });

  const lineStrokeOptions = useMemo(() => ({
    stroke: "white",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
  }), []);

  const knobStrokeOptions = useMemo(() => ({
    stroke: "white",
    strokeWidth: 4,
    strokeLinecap: "round" as const,
  }), []);

  return (
    <g ref={localRef}>
      <g onClick={handleToggle} style={{ cursor: 'pointer' }}>
        <VolumeIcon ref={volumeIconRef} size={size} position={position} />
      </g>
      
      {isOpen && (
        <>
          <g data-part="fader-line">
            <rect
              x={position.x - 14}
              y={faderBottom - 10}
              width={28}
              height={faderHeight + 20}
              fill="transparent"
              onMouseDown={handleTrackMouseDown}
              style={{ cursor: "ns-resize" }}
            />
            <LineGroup
              start={lineStart}
              end={lineEnd}
              count={1}
              options={{
                smoothness: 0,
                segments: 0,
                preSegmentNoiseMagnitudes: 0,
                postSegmentNoiseMagnitudes: 0,
              }}
              strokeOptions={lineStrokeOptions}
            />
          </g>
          <g
            data-part="fader-knob"
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <circle
              cx={knobCenter.x}
              cy={knobCenter.y}
              r={12}
              fill="transparent"
            />
            <CircleGroup
              center={knobCenter}
              radius={8}
              count={1}
              postNoiseMagnitude={0}
              options={{
                rotation: 0,
                overhangAngle: 0,
                overhangAngleNoise: 0,
                segments: 4,
                segmentNoiseMagnitudes: 0,
              }}
              strokeOptions={knobStrokeOptions}
            />
          </g>
        </>
      )}
    </g>
  );
}
