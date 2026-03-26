"use client";

import Image from "next/image";
import { useState } from "react";
import HandDrawnFrame from "./HandDrawnFrame";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";

const galleryItems = [
  {
    src: "/crash_replay.jpg",
    alt: "CRASH promo still",
    label: "Lorem Ipsum",
  },
  {
    src: "/crash_banner.png",
    alt: "CRASH logo banner",
    label: "Dolor Sit",
  },
  {
    src: "/crash_replay.jpg",
    alt: "CRASH rehearsal scene",
    label: "Amet Elit",
  },
  {
    src: "/crash_banner.png",
    alt: "CRASH artwork",
    label: "Sed Eiusmod",
  },
];

export default function MediaGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex !== null ? galleryItems[activeIndex] : null;

  return (
    <>
      <HandDrawnFrame contentClassName="p-6 md:p-8">
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="max-w-56">
              <HandwrittenText as="h2" fontSize={26} mobileFontSize={20} strokeWidth={3.2} mobileStrokeWidth={2.5}>
                Gallery
              </HandwrittenText>
            </div>
            <HandDrawnFrame className="inline-block" contentClassName="px-4 py-2">
              <HandwrittenText className="min-w-30" fontSize={11} mobileFontSize={9} strokeWidth={2} textAlign="center">
                Lorem Ipsum
              </HandwrittenText>
            </HandDrawnFrame>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {galleryItems.map((item, index) => (
              <HandDrawnFrame key={`${item.label}-${index}`} className="group" contentClassName="p-2">
                <article>
                  <button type="button" onClick={() => setActiveIndex(index)} className="block w-full text-left">
                    <HandDrawnFrame contentClassName="p-1">
                      <div className="relative h-48 w-full overflow-hidden md:h-56">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </HandDrawnFrame>
                  </button>
                  <div className="p-2">
                    <HandwrittenText fontSize={11} mobileFontSize={9} strokeColor="#d4d4d8" strokeWidth={2}>
                      {item.label}
                    </HandwrittenText>
                  </div>
                </article>
              </HandDrawnFrame>
            ))}
          </div>
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
            <HandwrittenText fontSize={14} mobileFontSize={12} strokeWidth={2.2}>
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
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}