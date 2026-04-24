import type { Metadata } from "next";
import AnimatedAlbumBands from "@/components/CRASHTheme/AnimatedAlbumBands";
import AlbumPlayer from "@/components/CRASHTheme/AlbumPlayer";

export const metadata: Metadata = {
  title: "CRASH - Listen Now",
  description: "Listen to the full CRASH album now.",
};

export default function ListenNowPage() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
      <AnimatedAlbumBands />
      <div className="relative z-10 w-full">
        <AlbumPlayer />
      </div>
    </main>
  );
}
