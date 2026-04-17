import type { Metadata } from "next";
import AlbumPlayer from "@/components/CRASHTheme/AlbumPlayer";

export const metadata: Metadata = {
  title: "CRASH - Listen Now",
  description: "Listen to the full CRASH album now.",
};

export default function ListenNowPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <AlbumPlayer />
    </main>
  );
}
