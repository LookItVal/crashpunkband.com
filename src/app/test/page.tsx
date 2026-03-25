"use client";

import AudioPlayer from "@/components/CRASHTheme/AudioPlayer/AudioPlayer";
import HandwrittenParagraph from "@/components/CRASHTheme/HandwrittenText/HandwrittenParagraph";

export default function TestPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center justify-center gap-10">
        <HandwrittenParagraph
          fontSize={50}
          strokeWidth={6}
          mobileBreakpoint={700}
          mobileFontSize={18}
          mobileStrokeWidth={3}
          textAlign="center"
        >
          {`CRASH PUNK BAND`}
        </HandwrittenParagraph>
        <HandwrittenParagraph
          fontSize={35}
          strokeWidth={4}
          mobileBreakpoint={700}
          mobileFontSize={14}
          mobileStrokeWidth={2}
          textAlign="center"
        >
          {`AAAA BBBB CCCCC DDDD FFFFF GGGGG IIIII JJJJ\nTHE QUICK BROWN FOX JUMPS OVER THE LAZY DOG\nthe quick brown fox jumps over the lazy dog`}
        </HandwrittenParagraph>
      </div>
      <AudioPlayer audioSrc="/audio/Cut Loose.mp3" />
    </main>
  );
}