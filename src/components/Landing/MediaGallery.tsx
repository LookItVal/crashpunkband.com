"use client";

import Image from "next/image";
import { useState } from "react";
import HandDrawnFrame from "./HandDrawnFrame";

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
            <h2 className="text-2xl font-black uppercase tracking-[0.2em]">Gallery</h2>
            <HandDrawnFrame className="inline-block" contentClassName="px-3 py-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Lorem Ipsum</span>
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
                  <p className="pt-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">{item.label}</p>
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
            className="absolute right-4 top-4 text-sm font-black uppercase tracking-[0.2em] text-white"
            onClick={() => setActiveIndex(null)}
          >
            Close
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