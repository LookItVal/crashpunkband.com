import Image from "next/image";
import AudioPlayer from "@/components/CRASHTheme/AudioPlayer/AudioPlayer";
import type { SongConfig } from "@/config/songs";

type SongCodePageProps = {
  song: SongConfig;
};

export default function SongCodePage({ song }: SongCodePageProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full flex flex-col items-center gap-12">
        <div className="w-full max-w-md px-4">
          <Image
            src="/crash_banner.png"
            alt="CRASH"
            width={1200}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold uppercase">{song.title}</h1>
        <AudioPlayer audioSrc={song.audioFile} />
      </div>
    </main>
  );
}
