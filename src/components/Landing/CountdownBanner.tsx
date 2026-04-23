"use client";

import { useEffect, useMemo, useState } from "react";
import HandDrawnFrame from "./HandDrawnFrame";
import HighlightButton from "./HighlightButton";
import StreamingLinks from "./StreamingLinks";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";
import gsap from "gsap";
import { useRef } from "react";

type CountdownBannerProps = {
  targetDate: string | Date;
};

type TimeRemaining = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeRemaining(targetDate: string | Date): TimeRemaining {
  const now = Date.now();
  const target = new Date(targetDate).getTime();
  const totalMs = Math.max(target - now, 0);

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);

  return { totalMs, days, hours, minutes, seconds };
}

function NumberUnit({ label, value }: { label: string; value: number }) {
  const padded = value.toString().padStart(2, "0");

  return (
    <HandDrawnFrame className="min-w-14 md:min-w-20" contentClassName="px-3 py-2 text-center md:px-3">
      <div className="pt-1 text-2xl font-black tracking-widest md:text-3xl">
        <HandwrittenText
          fontSize={24}
          textAlign="center"
          animation="jitter"
          strokeWidth={1.6}
          mobileBreakpoint={500}
          mobileFontSize={12}
          mobileStrokeWidth={1.3}
        >
          {padded}
        </HandwrittenText>
      </div>

      <div className="py-1 text-[8px] font-bold tracking-[0.14em] md:tracking-[0.25em]">
        <HandwrittenText
          fontSize={13}
          textAlign="center"
          strokeColor="grey"
          strokeWidth={1.5}
          mobileBreakpoint={500}
          mobileFontSize={5}
          mobileStrokeWidth={1}
        >
          {label.toUpperCase()}
        </HandwrittenText>
      </div>
    </HandDrawnFrame>
  );
}

export default function CountdownBanner({ targetDate }: CountdownBannerProps) {
  const [time, setTime] = useState<TimeRemaining>(() => getTimeRemaining(targetDate));
  const [showReleased, setShowReleased] = useState(() => getTimeRemaining(targetDate).totalMs <= 0);
  const countdownRef = useRef<HTMLDivElement>(null);
  const transitionStartedRef = useRef(false);

  useEffect(() => {
    let timer: number | null = null;

    const tick = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      setTime((previous) => {
        const next = getTimeRemaining(targetDate);

        if (
          previous.totalMs === next.totalMs &&
          previous.days === next.days &&
          previous.hours === next.hours &&
          previous.minutes === next.minutes &&
          previous.seconds === next.seconds
        ) {
          return previous;
        }

        return next;
      });
    };

    const startTicker = () => {
      if (timer !== null) {
        window.clearInterval(timer);
      }

      tick();
      timer = window.setInterval(tick, 1000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startTicker();
        return;
      }

      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    startTicker();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timer !== null) {
        window.clearInterval(timer);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [targetDate]);

  const isReleased = useMemo(() => time.totalMs <= 0, [time.totalMs]);

  useEffect(() => {
    if (!isReleased) {
      setShowReleased(false);
      transitionStartedRef.current = false;
      return;
    }

    if (showReleased || transitionStartedRef.current) return;

    if (!countdownRef.current) {
      setShowReleased(true);
      return;
    }

    transitionStartedRef.current = true;
    const tween = gsap.to(countdownRef.current, {
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setShowReleased(true);
      },
    });

    return () => {
      tween.kill();
    };
  }, [isReleased, showReleased]);

  return (
    <HandDrawnFrame className="relative" contentClassName="p-6 md:p-8">
      <section className="relative">
        {!showReleased ? (
          <div ref={countdownRef} className="flex flex-col gap-5" style={{ opacity: 1, filter: "blur(0px)" }}>
            <HandwrittenText
              as="h2"
              fontSize={30}
              strokeWidth={1.9}
              textAlign="center"
              animation="jitter"

            >
              NEW MUSIC COMING SOON
            </HandwrittenText>
            <div className="w-full overflow-x-auto pb-1">
              <div className="mx-auto flex w-max flex-nowrap items-center justify-center gap-0 sm:gap-2 md:gap-3">
                <NumberUnit label="Days" value={time.days} />
                <NumberUnit label="Hours" value={time.hours} />
                <NumberUnit label="Minutes" value={time.minutes} />
                <NumberUnit label="Seconds" value={time.seconds} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <HandwrittenText as="h2" fontSize={24} mobileFontSize={18} strokeWidth={2} mobileStrokeWidth={1.5} textAlign="center">
              NEW MUSIC OUT
            </HandwrittenText>

            <HandDrawnFrame contentClassName="px-6 py-3">
              <HighlightButton href="/listen-now" textClassName="w-full">
                <HandwrittenText fontSize={24} mobileFontSize={18} strokeWidth={1.8} mobileStrokeWidth={1.5} textAlign="center" animation="jitter">
                  Listen Now
                </HandwrittenText>
              </HighlightButton>
            </HandDrawnFrame>
          </div>
        )}
      </section>
    </HandDrawnFrame>
  );
}