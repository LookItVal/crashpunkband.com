import Image from "next/image";
import AudioPlayer from "@/components/CRASHTheme/AudioPlayer/AudioPlayer";
import HandDrawnFrame from "@/components/Landing/HandDrawnFrame";
import HandwrittenText from "@/components/CRASHTheme/HandwrittenText/HandwrittenText";
import type { SongConfig } from "@/config/songs";

type SongCodePageProps = {
  song: SongConfig;
};

export default function SongCodePage({ song }: SongCodePageProps) {
  const displayTitle = `"${song.title.toUpperCase()}"`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full flex flex-col items-center gap-12">
        <div className="w-full max-w-md px-4">
          <div className="relative w-full overflow-hidden bg-black">
            <Image
              src="/Album_Cover.png"
              alt="Album cover"
              width={1200}
              height={1200}
              className="w-full h-auto"
              priority
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_8px_rgba(0,0,0,1)]"
            />
          </div>
        </div>
        <HandwrittenText
          as="h1"
          animation="stagger"
          textAlign="center"
          className="max-w-lg"
          fontSize={30}
          mobileFontSize={22}
          strokeWidth={1.9}
          mobileStrokeWidth={1.5}
        >
          {displayTitle}
        </HandwrittenText>
        <AudioPlayer audioSrc={song.audioFile} />
      </div>
    </main>
  );
}
