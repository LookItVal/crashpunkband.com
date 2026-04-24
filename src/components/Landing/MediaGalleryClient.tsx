"use client";

import Image from "next/image";
import { useState } from "react";
import HandDrawnFrame from "./HandDrawnFrame";
import HighlightButton from "./HighlightButton";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";

const galleryItems = [
  {
    src: "/photos/AnnieMaesBand1.webp",
    alt: "CRASH punk band's live performance at Auntie Mae's in Manhattan, Kansas",
    label: "Auntie Mae's - Manhattan, Kansas",
  },
  {
    src: "/photos/BoobieTrap1.webp",
    alt: "CRASH punk band's live performance at The Boobie Trap in Topeka, Kansas",
    label: "The Boobie Trap - Topeka, Kansas",
  },
  {
    src: "/photos/BoobieTrapBand3.webp",
    alt: "CRASH punk band's live performance at The Boobie Trap in Topeka, Kansas",
    label: "The Boobie Trap - Topeka, Kansas",
  },
  {
    src: "/photos/BoobieTrapCash5.webp",
    alt: "Cash of CRASH punk band performing live at The Boobie Trap in Topeka, Kansas",
    label: "The Boobie Trap - Topeka, Kansas",
  },
  {
    src: "/photos/BoobieTrapFish1.webp",
    alt: "Fish of CRASH punk band performing live at The Boobie Trap in Topeka, Kansas",
    label: "The Boobie Trap - Topeka, Kansas",
  },
  {
    src: "/photos/BoobieTrapHero1.webp",
    alt: "CRASH punk band's live performance at The Boobie Trap in Topeka, Kansas",
    label: "The Boobie Trap - Topeka, Kansas",
  },
  {
    src: "/photos/BoobieTrapKnoxx1.webp",
    alt: "Knoxx of CRASH punk band performing live at The Boobie Trap in Topeka, Kansas",
    label: "The Boobie Trap - Topeka, Kansas",
  },
  {
    src: "/photos/BoobieTrapKnoxx2.webp",
    alt: "Knoxx of CRASH punk band performing live at The Boobie Trap in Topeka, Kansas",
    label: "The Boobie Trap - Topeka, Kansas",
  },
  {
    src: "/photos/BoobieTrapMoshPit1.webp",
    alt: "Mosh pit at CRASH punk band's live performance at The Boobie Trap in Topeka, Kansas",
    label: "The Boobie Trap - Topeka, Kansas",
  },
  {
    src: "/photos/CRASHoutside2.webp",
    alt: "CRASH punk band backstage at Farewell in Kansas City, Missouri",
    label: "Farewell - Kansas City, Missouri",
  },
  {
    src: "/photos/CRASHoutside3.webp",
    alt: "CRASH punk band backstage at Farewell in Kansas City, Missouri",
    label: "Farewell - Kansas City, Missouri",
  },
  {
    src: "/photos/ReplayBand1.webp",
    alt: "CRASH punk band's live performance at Replay in Lawrence, Kansas",
    label: "Replay - Lawrence, Kansas",
  },
  {
    src: "/photos/ReplayBand2.webp",
    alt: "CRASH punk band's live performance at Replay in Lawrence, Kansas",
    label: "Replay - Lawrence, Kansas",
  },
  {
    src: "/photos/ReplayCash1.webp",
    alt: "Cash of CRASH punk band performing live at Replay in Lawrence, Kansas",
    label: "Replay - Lawrence, Kansas",
  },
  {
    src: "/photos/ReplayKnoxx1.webp",
    alt: "Knoxx of CRASH punk band performing live at Replay in Lawrence, Kansas",
    label: "Replay - Lawrence, Kansas",
  },
  {
    src: "/photos/ReplayStrings1.webp",
    alt: "Strings of CRASH punk band performing live at Replay in Lawrence, Kansas",
    label: "Replay - Lawrence, Kansas",
  }
];

export default function MediaGalleryClient() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const activeItem = activeIndex !== null ? galleryItems[activeIndex] : null;
  const visibleItems = galleryItems.slice(0, visibleCount);
  const hasMoreItems = visibleCount < galleryItems.length;

  return (
    <>
      <HandDrawnFrame contentClassName="p-6 md:p-8">
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="w-1/3">
              <HandwrittenText as="h2" fontSize={26} mobileFontSize={20} strokeWidth={1.9} mobileStrokeWidth={1.5}>
                Gallery
              </HandwrittenText>
            </div>
            <HandDrawnFrame className="inline-block" contentClassName="px-4 py-2">
              <HandwrittenText as="h3" className="min-w-30" fontSize={11} mobileFontSize={9} strokeWidth={1.5} textAlign="center">
                From Our Shows
              </HandwrittenText>
            </HandDrawnFrame>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {visibleItems.map((item, index) => (
              <HandDrawnFrame key={`${item.label}-${index}`} className="group" contentClassName="p-3">
                <article>
                  <button type="button" onClick={() => setActiveIndex(index)} className="block w-full text-left">
                    <HandDrawnFrame contentClassName="p-1">
                      <div className="relative aspect-3/2 w-full overflow-hidden">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_10px_10px_rgba(0,0,0,1)]"
                        />
                      </div>
                    </HandDrawnFrame>
                  </button>
                  <div className="p-2">
                    <HandwrittenText as="h4" fontSize={11} mobileFontSize={9} strokeColor="#d4d4d8" strokeWidth={1.5}>
                      {item.label}
                    </HandwrittenText>
                  </div>
                </article>
              </HandDrawnFrame>
            ))}
          </div>

          {hasMoreItems ? (
            <div className="mt-6 flex justify-center">
              <HighlightButton onClick={() => setVisibleCount((count) => Math.min(count + 4, galleryItems.length))}>
                <HandwrittenText fontSize={13} mobileFontSize={11} strokeWidth={1.6} mobileStrokeWidth={1.4}>
                  Load More
                </HandwrittenText>
              </HighlightButton>
            </div>
          ) : null}
        </section>
      </HandDrawnFrame>

      {activeItem ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded gallery image"
        >
          <button
            type="button"
            className="absolute right-4 top-4"
            onClick={() => setActiveIndex(null)}
          >
            <HandwrittenText fontSize={14} mobileFontSize={12} strokeWidth={1.6}>
              Close
            </HandwrittenText>
          </button>
          <div className="relative h-[82vh] w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <Image
              src={activeItem.src}
              alt={activeItem.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}