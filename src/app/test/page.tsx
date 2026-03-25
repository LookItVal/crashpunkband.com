"use client";

import AudioPlayer from "@/components/CRASHTheme/AudioPlayer/AudioPlayer";
import HandwrittenParagraph from "@/components/CRASHTheme/HandwrittenText/HandwrittenParagraph";

export default function TestPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <HandwrittenParagraph fontSize={50} strokeWidth={4}>
        {`AAAA BBBB CCCCC DDDD FFFFF GGGGG IIIII JJJJ\nTHE QUICK BROWN FOX JUMPS OVER THE LAZY DOG\nthe quick brown fox jumps over the lazy dog`}
      </HandwrittenParagraph>
      <AudioPlayer audioSrc="/audio/Cut Loose.mp3" />
    </main>
  );
}