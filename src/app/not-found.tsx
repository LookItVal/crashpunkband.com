import HighlightButton from "@/components/Landing/HighlightButton";
import HandwrittenText from "@/components/CRASHTheme/HandwrittenText/HandwrittenText";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-8 md:px-10 md:py-10">
        <section className="flex flex-col items-center text-center">
          <div className="mb-6">
            <div className="inline-block">
              <HandwrittenText
                as="h1"
                fontSize={72}
                mobileFontSize={48}
                strokeWidth={2}
                mobileStrokeWidth={1.6}
              >
                404
              </HandwrittenText>
            </div>
          </div>

          <div className="mb-8 max-w-md">
            <HandwrittenText as="h2" fontSize={28} mobileFontSize={20} strokeWidth={1.9} mobileStrokeWidth={1.5}>
              Page Not Found
            </HandwrittenText>
          </div>

          <div className="mb-8 max-w-lg">
            <HandwrittenText
              fontSize={14}
              mobileFontSize={12}
              strokeColor="#d4d4d8"
              strokeWidth={1.5}
              textAlign="center"
            >
              Looks like this page crashed. The signal got lost in the noise.
            </HandwrittenText>
          </div>

          <HighlightButton href="/">
            <HandwrittenText
              fontSize={16}
              mobileFontSize={13}
              strokeWidth={1.7}
              mobileStrokeWidth={1.4}
              textAlign="center"
            >
              Back to CRASH
            </HandwrittenText>
          </HighlightButton>
        </section>
      </div>
    </main>
  );
}
