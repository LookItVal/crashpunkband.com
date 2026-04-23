"use client";

import dynamic from "next/dynamic";

const MediaGallery = dynamic(() => import("./MediaGallery"), {
  ssr: false,
  loading: () => <div className="min-h-80" aria-hidden />,
});

const EventCalendar = dynamic(() => import("./EventCalendar"), {
  ssr: false,
  loading: () => <div className="min-h-96" aria-hidden />,
});

export default function DeferredHomeSections() {
  return (
    <>
      <MediaGallery />
      <EventCalendar />
    </>
  );
}