"use client";

import { useEffect, useMemo, useState } from "react";
import HandDrawnFrame from "./HandDrawnFrame";
import HighlightButton from "./HighlightButton";
import StreamingLinks from "./StreamingLinks";

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
    <HandDrawnFrame className="min-w-16 md:min-w-20" contentClassName="px-2 py-2 text-center md:px-3">
      <div className="text-2xl font-black tracking-widest md:text-3xl">{padded}</div>
      <div className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/80 md:text-xs md:tracking-[0.25em]">{label}</div>
    </HandDrawnFrame>
  );
}

export default function CountdownBanner({ targetDate }: CountdownBannerProps) {
  const [time, setTime] = useState<TimeRemaining>(() => getTimeRemaining(targetDate));

  useEffect(() => {
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
            <h2 className="text-center text-3xl font-black uppercase tracking-[0.35em] md:text-4xl">NEW MUSIC COMING SOON</h2>
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