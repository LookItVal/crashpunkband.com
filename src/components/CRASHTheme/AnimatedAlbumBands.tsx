"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedAlbumBandsProps = {
  topImageSrc?: string;
  bottomImageSrc?: string;
  topHeightClassName?: string;
  bottomHeightClassName?: string;
  topDurationSeconds?: number;
  bottomDurationSeconds?: number;
};

export default function AnimatedAlbumBands({
  topImageSrc = "/AlbumBGTop.webp",
  bottomImageSrc = "/AlbumBGBottom.webp",
  topHeightClassName = "h-[50%]",
  bottomHeightClassName = "h-[80%]",
  topDurationSeconds = 300,
  bottomDurationSeconds = 180,
}: AnimatedAlbumBandsProps) {
  const bottomBandRef = useRef<HTMLDivElement>(null);
  const topBandRef = useRef<HTMLDivElement>(null);
  const topAspectRef = useRef(1);
  const bottomAspectRef = useRef(1);
  const [topTileWidth, setTopTileWidth] = useState(1);
  const [bottomTileWidth, setBottomTileWidth] = useState(1);
  const [topTileCount, setTopTileCount] = useState(6);
  const [bottomTileCount, setBottomTileCount] = useState(6);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const calcCount = (bandWidth: number, tileWidth: number) => {
      return Math.max(4, Math.ceil(bandWidth / tileWidth) + 3);
    };

    const recalc = () => {
      if (topBandRef.current) {
        const bandHeight = topBandRef.current.clientHeight;
        const bandWidth = topBandRef.current.clientWidth;
        const nextWidth = Math.max(1, bandHeight * topAspectRef.current);
        setTopTileWidth(nextWidth);
        setTopTileCount(calcCount(bandWidth, nextWidth));
      }

      if (bottomBandRef.current) {
        const bandHeight = bottomBandRef.current.clientHeight;
        const bandWidth = bottomBandRef.current.clientWidth;
        const nextWidth = Math.max(1, bandHeight * bottomAspectRef.current);
        setBottomTileWidth(nextWidth);
        setBottomTileCount(calcCount(bandWidth, nextWidth));
      }
    };

    const topImg = new window.Image();
    topImg.onload = () => {
      if (topImg.naturalHeight > 0) {
        topAspectRef.current = topImg.naturalWidth / topImg.naturalHeight;
      }
      recalc();
    };
    topImg.src = topImageSrc;

    const bottomImg = new window.Image();
    bottomImg.onload = () => {
      if (bottomImg.naturalHeight > 0) {
        bottomAspectRef.current = bottomImg.naturalWidth / bottomImg.naturalHeight;
      }
      recalc();
    };
    bottomImg.src = bottomImageSrc;

    let observer: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      observer = new ResizeObserver(recalc);
      if (topBandRef.current) observer.observe(topBandRef.current);
      if (bottomBandRef.current) observer.observe(bottomBandRef.current);
    }

    window.addEventListener("resize", recalc);
    recalc();

    return () => {
      window.removeEventListener("resize", recalc);
      observer?.disconnect();
    };
  }, [bottomImageSrc, topImageSrc]);

  return (
    <>
      <div
        ref={bottomBandRef}
        aria-hidden="true"
        className={`albumBand albumBandBottom pointer-events-none absolute inset-x-0 bottom-0 ${bottomHeightClassName}`}
      >
        <div
          className="albumBandTrack"
          style={{
            ["--tile-width" as string]: `${bottomTileWidth}px`,
            ["--tile-count" as string]: `${bottomTileCount}`,
            animationDuration: `${bottomDurationSeconds}s`,
          }}
        >
          {Array.from({ length: bottomTileCount }, (_, idx) => (
            <div
              key={`bottom-${idx}`}
              className="albumBandTile"
              style={{ backgroundImage: `url("${bottomImageSrc}")` }}
            />
          ))}
        </div>
      </div>

      <div
        ref={topBandRef}
        aria-hidden="true"
        className={`albumBand albumBandTop pointer-events-none absolute inset-x-0 top-0 ${topHeightClassName}`}
      >
        <div
          className="albumBandTrack"
          style={{
            ["--tile-width" as string]: `${topTileWidth}px`,
            ["--tile-count" as string]: `${topTileCount}`,
            animationDuration: `${topDurationSeconds}s`,
          }}
        >
          {Array.from({ length: topTileCount }, (_, idx) => (
            <div
              key={`top-${idx}`}
              className="albumBandTile"
              style={{ backgroundImage: `url("${topImageSrc}")` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .albumBand {
          z-index: -1;
          overflow: hidden;
        }

        .albumBandBottom {
          z-index: -2;
        }

        .albumBandTop {
          z-index: -1;
        }

        .albumBandTrack {
          --tile-width: 1px;
          --tile-count: 4;
          display: flex;
          width: calc(var(--tile-width) * var(--tile-count));
          height: 100%;
          will-change: transform;
          animation-name: albumBandSlide;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .albumBandTile {
          width: var(--tile-width);
          min-width: var(--tile-width);
          height: 100%;
          flex: 0 0 var(--tile-width);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          background-position: 0 0;
        }

        @keyframes albumBandSlide {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(calc(-1 * var(--tile-width)), 0, 0);
          }
        }
      `}</style>
    </>
  );
}