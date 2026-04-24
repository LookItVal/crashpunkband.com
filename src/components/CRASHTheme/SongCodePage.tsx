import AnimatedAlbumBands from "@/components/CRASHTheme/AnimatedAlbumBands";
import AudioPlayer from "@/components/CRASHTheme/AudioPlayer/AudioPlayer";
import FeatherGlowPlate from "@/components/CRASHTheme/FeatherGlowPlate";
import HandwrittenText from "@/components/CRASHTheme/HandwrittenText/HandwrittenText";
import type { SongConfig } from "@/config/songs";
import { buildResponsiveSrcSet } from "@/lib/images/responsive";

const ALBUM_COVER_SRC = "/Album_Cover.webp";
const ALBUM_COVER_WIDTHS = [256, 384, 512, 640, 768, 1024];

type SongCodePageProps = {
  song: SongConfig;
};

export default function SongCodePage({ song }: SongCodePageProps) {
  const displayTitle = `"${song.title.toUpperCase()}"`;

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center p-4">
      <AnimatedAlbumBands topDurationSeconds={300} bottomDurationSeconds={180} />

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-12">
        <div className="w-full max-w-md px-4">
          <div className="relative w-full overflow-hidden">
            <img
              src={ALBUM_COVER_SRC}
              srcSet={buildResponsiveSrcSet(ALBUM_COVER_SRC, ALBUM_COVER_WIDTHS)}
              sizes="(max-width: 768px) calc(100vw - 2rem), 448px"
              alt="Album cover"
              width={768}
              height={768}
              className="w-full h-auto"
              fetchPriority="high"
              loading="eager"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_8px_rgba(0,0,0,1)]"
            />
            <div className="absolute z-10 inset-0 top-10">
              <FeatherGlowPlate className="px-10 py-3" inset="-1.1rem -1.4rem" radius="2.5rem" blur="12px">
                <HandwrittenText
                  as="h1"
                  animation="stagger"
                  textAlign="center"
                  className="max-w-lg"
                  fontSize={30}
                  mobileFontSize={25}
                  strokeWidth={2.5}
                  mobileStrokeWidth={2}
                >
                  {displayTitle}
                </HandwrittenText>
              </FeatherGlowPlate>
            </div>
          </div>
        </div>

        <FeatherGlowPlate className="px-20 py-4" inset="-1.35rem -1.8rem" radius="3rem" blur="12px">
          <AudioPlayer audioSrc={song.audioFile} />
        </FeatherGlowPlate>
      </div>
    </main>
  );
}
