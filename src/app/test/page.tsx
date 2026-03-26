"use client";

import AudioPlayer from "@/components/CRASHTheme/AudioPlayer/AudioPlayer";
import HandwrittenText from "@/components/CRASHTheme/HandwrittenText/HandwrittenText";

export default function TestPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center justify-center gap-10">
        <HandwrittenText
          fontSize={50}
          strokeWidth={6}
          mobileBreakpoint={700}
          mobileFontSize={18}
          mobileStrokeWidth={3}
          textAlign="center"
          animation="jitter"
          as='h1'
          lineOptions={{
            preSegmentNoiseMagnitudes: 0.025,
            postSegmentNoiseMagnitudes: 0.015
          }}
        >
          {`CRASH PUNK BAND`}
        </HandwrittenText>
        <HandwrittenText
          fontSize={35}
          strokeWidth={4}
          mobileBreakpoint={700}
          mobileFontSize={14}
          mobileStrokeWidth={2}
          textAlign="center"
          animation="none"
        >
          {`1234567890 ! @ # $ % & * () [] <> , . ? / \\ ' "`}
        </HandwrittenText>
                <HandwrittenText
          fontSize={35}
          strokeWidth={4}
          mobileBreakpoint={700}
          mobileFontSize={14}
          mobileStrokeWidth={2}
          textAlign="center"
          animation="enter"
        >
          {`THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG`}
        </HandwrittenText>
                <HandwrittenText
          fontSize={35}
          strokeWidth={4}
          mobileBreakpoint={700}
          mobileFontSize={14}
          mobileStrokeWidth={2}
          textAlign="center"
          animation="stagger"
        >
          {`the quick brown fox jumps over the lazy dog`}
        </HandwrittenText>
                <HandwrittenText
          fontSize={35}
          strokeWidth={4}
          mobileBreakpoint={700}
          mobileFontSize={14}
          mobileStrokeWidth={2}
          textAlign="center"
          animation="jitter"
        >
          {`The Quick Brown Fox Jumps Over The Lazy Dog`}
        </HandwrittenText>
      </div>
      <div className="pt-10">
        <AudioPlayer audioSrc="/audio/Cut Loose.mp3" />
      </div>
    </main>
  );
}