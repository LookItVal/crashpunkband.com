import { notFound } from "next/navigation";
import Image from "next/image";
import { getSongByCode, getAllSongCodes } from "@/config/songs";
import AudioPlayer from "@/components/CRASHTheme/AudioPlayer/AudioPlayer";

type PageProps = {
  params: Promise<{
    code: string;
  }>;
};

export async function generateStaticParams() {
  const codes = getAllSongCodes();
  return codes.map((code) => ({
    code,
  }));
}

export default async function SongPage({ params }: PageProps) {
  const { code } = await params;
  const song = getSongByCode(code);

  if (!song) {
    notFound();
  }

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
