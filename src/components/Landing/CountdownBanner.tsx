"use client";

import { useEffect, useMemo, useState } from "react";
import HandDrawnFrame from "./HandDrawnFrame";
import HighlightButton from "./HighlightButton";
import StreamingLinks from "./StreamingLinks";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";

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
    <HandDrawnFrame className="min-w-14 md:min-w-20" contentClassName="px-0 py-2 text-center md:px-3">
      <div className="pt-1 text-2xl font-black tracking-widest md:text-3xl">
        <HandwrittenText
          fontSize={24}
          textAlign="center"
          animation="jitter"
          strokeWidth={2.5}
          mobileBreakpoint={500}
          mobileFontSize={14}
          mobileStrokeWidth={2}
        >
          {padded}
        </HandwrittenText>
      </div>

      <div className="py-1 text-[8px] font-bold tracking-[0.14em] md:tracking-[0.25em]">
        <HandwrittenText
          fontSize={13}
          textAlign="center"
          strokeColor="grey"
          strokeWidth={2.5}
          mobileBreakpoint={500}
          mobileFontSize={7}
          mobileStrokeWidth={1}
        >
          {label.toUpperCase()}
        </HandwrittenText>
      </div>
    </HandDrawnFrame>
  );
}

export default function CountdownBanner({ targetDate }: CountdownBannerProps) {
  const [time, setTime] = useState<TimeRemaining>({
    totalMs: 1,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTime(getTimeRemaining(targetDate));

    const timer = window.setInterval(() => {
      setTime(getTimeRemaining(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const isReleased = useMemo(() => time.totalMs <= 0, [time.totalMs]);

  return (
    <HandDrawnFrame className="relative" contentClassName="p-6 md:p-8">
      <section className="relative">
        {!isReleased ? (
          <div className="flex flex-col gap-5">
            <HandwrittenText
              fontSize={30}
              strokeWidth={4}
              textAlign="center"
              animation="jitter"

            >
              {`NEW MUSIC COMING SOON`}
            </HandwrittenText>
            <div className="w-full overflow-x-auto pb-1">
              <div className="mx-auto flex w-max flex-nowrap items-center justify-center gap-2 md:gap-3">
                <NumberUnit label="Days" value={time.days} />
                <NumberUnit label="Hours" value={time.hours} />
                <NumberUnit label="Minutes" value={time.minutes} />
                <NumberUnit label="Seconds" value={time.seconds} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <HandDrawnFrame contentClassName="px-6 py-3">
              <HighlightButton href="#listen" textClassName="text-2xl font-black uppercase tracking-[0.25em]">
                Listen now
              </HighlightButton>
            </HandDrawnFrame>
            <StreamingLinks />
          </div>
        )}
      </section>
    </HandDrawnFrame>
  );
}