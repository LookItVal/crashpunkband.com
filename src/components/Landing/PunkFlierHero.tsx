import Image from "next/image";
import HandDrawnFrame from "./HandDrawnFrame";
import HanddrawnText from "../CRASHTheme/HandwrittenText/HandwrittenText";
import SocialMediaLinks from "./SocialMediaLinks";

export default function PunkFlierHero() {
  return (
    <HandDrawnFrame
      className="relative"
      contentClassName="p-8 md:p-12"
    >
      <section className="relative z-10 flex flex-col gap-8">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4 pb-4 sm:flex-row sm:justify-between">
            <HandDrawnFrame
              className="inline-block sm:-rotate-3"
              contentClassName="px-3 pb-3"
              showTop={false}
              showRight={false}
              showBottom={true}
              showLeft={false}
            >
              <HanddrawnText
                fontSize={13}
                textAlign="center"
                strokeWidth={2}
                className="pb-3"
              >
                Kansas City Based
              </HanddrawnText>
            </HandDrawnFrame>
            <HandDrawnFrame
              className="sm:rotate-3 inline-block"
              contentClassName="px-3 pb-3"
              showTop={false}
              showRight={false}
              showBottom={true}
              showLeft={false}
            >
              <HanddrawnText
                fontSize={13}
                textAlign="center"
                strokeWidth={2}
                className="pb-3"
              >
                Punk Rock
              </HanddrawnText>
            </HandDrawnFrame>
          </div>
          <HandDrawnFrame
            className="w-full"
            contentClassName="h-2"
            showTop={false}
            showRight={false}
            showBottom={true}
            showLeft={false}
          />
        </div>

        <div className="space-y-4 text-center">
          <div className="mx-auto w-full max-w-xl p-3">
            <Image
              src="/crash_banner.png"
              alt="CRASH logo"
              width={1200}
              height={420}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          <div className="mx-auto max-w-2xl">
            <HanddrawnText
              fontSize={12}
              mobileFontSize={10}
              strokeColor="#e4e4e7"
              strokeWidth={2.2}
              mobileStrokeWidth={1.6}
              textAlign="center"
            >
              Book us now: crash.booking.official@gmail.com
            </HanddrawnText>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <HandDrawnFrame contentClassName="px-4 py-3 text-center">
            <HanddrawnText fontSize={11} mobileFontSize={10} strokeColor="#d4d4d8" strokeWidth={2} textAlign="center">
              Big Sound
            </HanddrawnText>
          </HandDrawnFrame>
          <HandDrawnFrame contentClassName="px-4 py-3 text-center">
            <HanddrawnText fontSize={11} mobileFontSize={10} strokeColor="#d4d4d8" strokeWidth={2} textAlign="center">
              Loud Instruments
            </HanddrawnText>
          </HandDrawnFrame>
          <HandDrawnFrame contentClassName="px-4 py-3 text-center">
            <HanddrawnText fontSize={11} mobileFontSize={10} strokeColor="#d4d4d8" strokeWidth={2} textAlign="center">
              Routy Crowds
            </HanddrawnText>
          </HandDrawnFrame>
        </div>

        <div className="space-y-5 pt-1">
          <HandDrawnFrame
            className="w-full"
            contentClassName="h-2"
            showTop={false}
            showRight={false}
            showBottom={true}
            showLeft={false}
          />
          <div className="mb-3">
            <HanddrawnText fontSize={12} mobileFontSize={10} strokeColor="#d4d4d8" strokeWidth={2.2} textAlign="center">
              Stay connected
            </HanddrawnText>
          </div>
          <SocialMediaLinks compact />
        </div>
      </section>
    </HandDrawnFrame>
  );
}