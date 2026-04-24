"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import AudioPlayer from "@/components/CRASHTheme/AudioPlayer/AudioPlayer";
import FeatherGlowPlate from "@/components/CRASHTheme/FeatherGlowPlate";
import HandDrawnFrame from "@/components/Landing/HandDrawnFrame";
import HandwrittenText from "@/components/CRASHTheme/HandwrittenText/HandwrittenText";
import HighlightButton from "@/components/Landing/HighlightButton";
import { FaPlay } from "react-icons/fa";
import { buildResponsiveSrcSet } from "@/lib/images/responsive";

const ALBUM_COVER_SRC = "/Album_Cover.webp";
const ALBUM_COVER_WIDTHS = [256, 384, 512, 640, 768, 1024];

type AlbumTrack = {
  number: number;
  title: string;
  audioFile: string;
};

const ALBUM_TRACKS: AlbumTrack[] = [
  { number: 1, title: "CUT LOOSE", audioFile: "/audio/CUT LOOSE.mp3" },
  { number: 2, title: "ANSWERS", audioFile: "/audio/ANSWERS.mp3" },
  { number: 3, title: "FRIED", audioFile: "/audio/FRIED.mp3" },
  { number: 4, title: "MAJOR HEADCASE", audioFile: "/audio/MAJOR HEADCASE.mp3" },
  { number: 5, title: "OUTRAGE", audioFile: "/audio/OUTRAGE.mp3" },
  { number: 6, title: "THROW ME AWAY", audioFile: "/audio/THROW ME AWAY.mp3" },
  { number: 7, title: "KILL THE SHILL", audioFile: "/audio/KILL THE SHILL.mp3" },
  { number: 8, title: "GIVE ME FIRE", audioFile: "/audio/GIVE ME FIRE.mp3" },
  { number: 9, title: "DECAY", audioFile: "/audio/DECAY.mp3" },
  { number: 10, title: "FIGHT BACK", audioFile: "/audio/FIGHT BACK.mp3" },
  { number: 11, title: "TAKE BACK", audioFile: "/audio/TAKE BACK.mp3" },
];

export default function AlbumPlayerClient() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [togglePlaySignal, setTogglePlaySignal] = useState(0);
  const nowPlayingRef = useRef<HTMLDivElement>(null);
  const animateInRef = useRef(false);
  const trackAudioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioKey, setAudioKey] = useState(0);

  const currentTrack = ALBUM_TRACKS[currentTrackIndex];
  const displayTitle = `"${currentTrack.title}"`;

  activeAudioRef.current = trackAudioRefs.current[currentTrackIndex] ?? null;

  const pauseNonCurrentTracks = useCallback((activeIndex: number) => {
    trackAudioRefs.current.forEach((audioElement, index) => {
      if (!audioElement || index === activeIndex) {
        return;
      }

      audioElement.pause();
      audioElement.currentTime = 0;
    });
  }, []);

  const preloadFromTrack = useCallback((startIndex: number) => {
    trackAudioRefs.current.forEach((audioElement, index) => {
      if (!audioElement) {
        return;
      }

      const targetTrack = ALBUM_TRACKS[index];

      if (index < startIndex) {
        if (index !== currentTrackIndex) {
          audioElement.pause();
          audioElement.removeAttribute("src");
          audioElement.load();
        }
        return;
      }

      if (audioElement.getAttribute("src") !== targetTrack.audioFile) {
        audioElement.src = targetTrack.audioFile;
      }

      audioElement.preload = "auto";
      audioElement.load();
    });
  }, [currentTrackIndex]);

  useEffect(() => {
    preloadFromTrack(currentTrackIndex);
  }, [currentTrackIndex, preloadFromTrack]);

  const beginTrackPlayback = useCallback((nextIndex: number) => {
    const nextAudioElement = trackAudioRefs.current[nextIndex];
    const currentAudioElement = trackAudioRefs.current[currentTrackIndex];

    pauseNonCurrentTracks(nextIndex);

    if (nextAudioElement) {
      nextAudioElement.currentTime = 0;
      if (currentAudioElement) {
        nextAudioElement.volume = currentAudioElement.volume;
      }
      void nextAudioElement.play().catch(() => {});
    }

    setAudioKey((prev) => prev + 1);
    setShouldAutoPlay(true);
    animateInRef.current = true;
    setCurrentTrackIndex(nextIndex);
  }, [currentTrackIndex, pauseNonCurrentTracks]);

  const switchTrack = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= ALBUM_TRACKS.length) return;

      if (nextIndex === currentTrackIndex) {
        setTogglePlaySignal((prev) => prev + 1);
        return;
      }

      const el = nowPlayingRef.current;

      if (el) {
        gsap.killTweensOf(el);
      }

      if (!el) {
        beginTrackPlayback(nextIndex);
        return;
      }

      gsap.to(el, {
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          beginTrackPlayback(nextIndex);
        },
      });
    },
    [beginTrackPlayback, currentTrackIndex],
  );

  const handleTrackEnded = useCallback(() => {
    const nextIndex = currentTrackIndex + 1;
    if (nextIndex >= ALBUM_TRACKS.length) return;

    const el = nowPlayingRef.current;
    animateInRef.current = true;
    if (el) {
      gsap.killTweensOf(el);
      gsap.to(el, {
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          beginTrackPlayback(nextIndex);
        },
      });
    } else {
      beginTrackPlayback(nextIndex);
    }
  }, [beginTrackPlayback, currentTrackIndex]);

  useEffect(() => {
    if (!animateInRef.current) return;
    animateInRef.current = false;
    const el = nowPlayingRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, filter: "blur(6px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.25, ease: "power2.out" },
    );
  }, [currentTrackIndex]);

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto">
      {ALBUM_TRACKS.map((track, index) => (
        <audio
          key={track.audioFile}
          ref={(element) => {
            trackAudioRefs.current[index] = element;
          }}
          preload={index >= currentTrackIndex ? "auto" : "none"}
          style={{ display: "none" }}
        />
      ))}

      <div className="flex flex-col lg:flex-row lg:items-center gap-8">
        <div className="order-2 lg:order-1 lg:w-1/2">
          <FeatherGlowPlate className="w-full px-10 py-10 md:px-20 md:py-20" inset="-1.4rem -1.7rem" radius="3rem" blur="14px">
            <HandDrawnFrame contentClassName="p-8 md:p-10">
              <div className="mb-4">
                <HandwrittenText
                  as="h2"
                  fontSize={20}
                  mobileFontSize={16}
                  strokeWidth={1.8}
                  mobileStrokeWidth={1.5}
                >
                  TRACKLIST
                </HandwrittenText>
              </div>
              <div className="space-y-0.5 flex flex-col">
                {ALBUM_TRACKS.map((track, index) => (
                  <div key={track.number}>
                    <HighlightButton
                      onClick={() => switchTrack(index)}
                    >
                      <div className="flex items-center gap-3 py-1.5 pr-5">
                        {index === currentTrackIndex ? (
                          <FaPlay className="h-2.5 w-2.5 shrink-0" />
                        ) : (
                          <span className="h-2.5 w-2.5 shrink-0" />
                        )}
                        <HandwrittenText
                          key={`track-${track.number}`}
                          fontSize={13}
                          mobileFontSize={10}
                          strokeWidth={1.5}
                          strokeColor="#ffffff"
                        >
                          {`${track.number}.\u00a0${track.title}`}
                        </HandwrittenText>
                      </div>
                    </HighlightButton>
                  </div>
                ))}
              </div>
            </HandDrawnFrame>
          </FeatherGlowPlate>
        </div>

        <div className="order-1 lg:order-2 lg:w-1/4 w-1/2 m-auto flex items-start">
          <div className="relative overflow-hidden bg-black">
            <img
              src={ALBUM_COVER_SRC}
              srcSet={buildResponsiveSrcSet(ALBUM_COVER_SRC, ALBUM_COVER_WIDTHS)}
              sizes="(max-width: 1024px) 50vw, 25vw"
              alt="Album cover"
              width={768}
              height={768}
              className="w-full h-auto"
              fetchPriority="high"
              loading="eager"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_8px_rgba(0,0,0,1)]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <FeatherGlowPlate className="px-15 py-3" inset="-1.1rem -1.4rem" radius="2.5rem" blur="12px">
          <div ref={nowPlayingRef} className="w-full flex flex-col items-center gap-2">
            <HandwrittenText
              fontSize={10}
              mobileFontSize={8}
              strokeWidth={1.3}
              strokeColor="#71717a"
              textAlign="center"
            >
              NOW PLAYING
            </HandwrittenText>
            <HandwrittenText
              key={currentTrackIndex}
              as="h1"
              animation="stagger"
              textAlign="center"
              className="max-w-lg"
              fontSize={28}
              mobileFontSize={20}
              strokeWidth={1.9}
              mobileStrokeWidth={1.5}
            >
              {displayTitle}
            </HandwrittenText>
          </div>
        </FeatherGlowPlate>

        <FeatherGlowPlate className="px-25 py-4" inset="-1.35rem -1.8rem" radius="3rem" blur="12px">
          <AudioPlayer
            audioSrc={currentTrack.audioFile}
            externalAudioRef={activeAudioRef}
            audioElementKey={audioKey}
            onEnded={handleTrackEnded}
            autoPlay={shouldAutoPlay}
            togglePlaySignal={togglePlaySignal}
          />
        </FeatherGlowPlate>
      </div>
    </div>
  );
}