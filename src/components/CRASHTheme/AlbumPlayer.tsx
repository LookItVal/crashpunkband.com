"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import AudioPlayer from "@/components/CRASHTheme/AudioPlayer/AudioPlayer";
import HandDrawnFrame from "@/components/Landing/HandDrawnFrame";
import HandwrittenText from "@/components/CRASHTheme/HandwrittenText/HandwrittenText";
import HighlightButton from "@/components/Landing/HighlightButton";
import { FaPlay } from "react-icons/fa";

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

export default function AlbumPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [togglePlaySignal, setTogglePlaySignal] = useState(0);
  const nowPlayingRef = useRef<HTMLDivElement>(null);
  const animateInRef = useRef(false);

  // Double-buffer audio elements for gapless auto-advance.
  // One plays the current track while the other preloads the next.
  const audioRefA = useRef<HTMLAudioElement>(null);
  const audioRefB = useRef<HTMLAudioElement>(null);
  const activeBufferRef = useRef<0 | 1>(0);
  const [activeBuffer, setActiveBuffer] = useState<0 | 1>(0);
  const [audioKey, setAudioKey] = useState(0);

  const activeAudioRef = activeBuffer === 0 ? audioRefA : audioRefB;

  const currentTrack = ALBUM_TRACKS[currentTrackIndex];
  const nextTrack = currentTrackIndex + 1 < ALBUM_TRACKS.length ? ALBUM_TRACKS[currentTrackIndex + 1] : null;
  const displayTitle = `"${currentTrack.title}"`;

  // Load the first track into buffer A on mount
  useEffect(() => {
    const el = audioRefA.current;
    if (!el) return;
    el.src = ALBUM_TRACKS[0].audioFile;
    el.load();
  }, []);

  // Preload the next track into the standby buffer
  useEffect(() => {
    const standbyIdx = activeBuffer === 0 ? 1 : 0;
    const standbyEl = standbyIdx === 0 ? audioRefA.current : audioRefB.current;
    if (!standbyEl || !nextTrack) return;
    standbyEl.src = nextTrack.audioFile;
    standbyEl.load();
  }, [nextTrack, activeBuffer]);

  const switchTrack = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= ALBUM_TRACKS.length) return;

      // Already on this track — toggle play/pause instead
      if (nextIndex === currentTrackIndex) {
        setTogglePlaySignal((prev) => prev + 1);
        return;
      }

      const doSwitch = () => {
        // Manual switch: load directly on the active element (small delay OK)
        const curActive = activeBufferRef.current;
        const activeEl = curActive === 0 ? audioRefA.current : audioRefB.current;
        if (activeEl) {
          activeEl.src = ALBUM_TRACKS[nextIndex].audioFile;
          activeEl.load();
          void activeEl.play().catch(() => {});
        }
        // Bump key so AudioPlayer re-syncs duration / currentTime
        setAudioKey((prev) => prev + 1);
        setShouldAutoPlay(true);
        // Flag animate-in, then update track (container stays hidden until useEffect)
        animateInRef.current = true;
        setCurrentTrackIndex(nextIndex);
      };

      const el = nowPlayingRef.current;

      if (el) {
        gsap.killTweensOf(el);
      }

      if (!el) {
        doSwitch();
        return;
      }

      gsap.to(el, {
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          // Don't reset opacity here — leave hidden until React renders new title
          doSwitch();
        },
      });
    },
    [currentTrackIndex],
  );

  const handleTrackEnded = useCallback(() => {
    const nextIndex = currentTrackIndex + 1;
    if (nextIndex >= ALBUM_TRACKS.length) return;

    // Swap to the standby buffer which already has the next track loaded.
    // Playing it immediately avoids the gap caused by audio.load().
    const curActive = activeBufferRef.current;
    const standbyIdx: 0 | 1 = curActive === 0 ? 1 : 0;
    const standbyEl = standbyIdx === 0 ? audioRefA.current : audioRefB.current;
    const activeEl = curActive === 0 ? audioRefA.current : audioRefB.current;

    if (standbyEl) {
      standbyEl.currentTime = 0;
      if (activeEl) standbyEl.volume = activeEl.volume;
      void standbyEl.play().catch(() => {});
    }

    // Swap the buffer immediately so AudioPlayer binds to the playing element
    activeBufferRef.current = standbyIdx;
    setActiveBuffer(standbyIdx);
    setAudioKey((prev) => prev + 1);
    setShouldAutoPlay(true);

    // Animate the now-playing text independently — audio is already gapless
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
          setCurrentTrackIndex(nextIndex);
        },
      });
    } else {
      setCurrentTrackIndex(nextIndex);
    }
  }, [currentTrackIndex]);

  // Animate the now-playing text back in after React renders the new title
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
      {/* Double-buffer audio elements (hidden) */}
      <audio ref={audioRefA} preload="auto" style={{ display: "none" }} />
      <audio ref={audioRefB} preload="auto" style={{ display: "none" }} />

      {/* Two-column section: tracklist + album art */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-8">
        {/* Tracklist — left on desktop, below on mobile */}
        <div className="order-2 lg:order-1 lg:w-1/2">
          <HandDrawnFrame contentClassName="p-4 md:p-6">
            <div className="mb-4">
              <HandwrittenText
                as="h2"
                fontSize={20}
                mobileFontSize={16}
                strokeWidth={2.8}
                mobileStrokeWidth={2.2}
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
                        strokeWidth={2}
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
        </div>

        {/* Album art — right on desktop, top on mobile */}
        <div className="order-1 lg:order-2 lg:w-1/2 flex items-start">
          <div className="relative w-full overflow-hidden bg-black">
            <Image
              src="/Album_Cover.png"
              alt="Album cover"
              width={1200}
              height={1200}
              className="w-full h-auto"
              priority
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_8px_rgba(0,0,0,1)]"
            />
          </div>
        </div>
      </div>

      {/* Now Playing — full width below the two columns */}
      <div className="flex flex-col items-center gap-6">
        <div ref={nowPlayingRef} className="w-full flex flex-col items-center gap-2">
          <HandwrittenText
            fontSize={10}
            mobileFontSize={8}
            strokeWidth={1.6}
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
            strokeWidth={3}
            mobileStrokeWidth={2.4}
          >
            {displayTitle}
          </HandwrittenText>
        </div>

        <AudioPlayer
          audioSrc={currentTrack.audioFile}
          externalAudioRef={activeAudioRef}
          audioElementKey={audioKey}
          onEnded={handleTrackEnded}
          autoPlay={shouldAutoPlay}
          togglePlaySignal={togglePlaySignal}
        />
      </div>
    </div>
  );
}
