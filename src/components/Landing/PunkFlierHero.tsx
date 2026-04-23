import HandDrawnFrame from "./HandDrawnFrame";
import HanddrawnText from "../CRASHTheme/HandwrittenText/HandwrittenText";
import SocialMediaLinks from "./SocialMediaLinks";
import { buildResponsiveSrcSet } from "@/lib/images/responsive";

const HERO_IMAGE_SRC = "/crash_banner.webp";
const HERO_IMAGE_WIDTHS = [320, 480, 640, 768, 960, 1200];

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
                as="h2"
                textAlign="center"
                strokeWidth={1.5}
                className="pb-3"
                animation="jitter"
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
                as="h2"
                textAlign="center"
                strokeWidth={1.5}
                className="pb-3"
                animation="jitter"
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
            <img
              src={HERO_IMAGE_SRC}
              srcSet={buildResponsiveSrcSet(HERO_IMAGE_SRC, HERO_IMAGE_WIDTHS)}
              sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) 80vw, 768px"
              alt="CRASH Punk Band logo"
              width={960}
              height={336}
              className="h-auto w-full object-contain"
              fetchPriority="high"
              loading="eager"
            />
          </div>
          <div className="mx-auto max-w-2xl">
            <HanddrawnText
              fontSize={18}
              mobileFontSize={15}
              strokeColor="#e4e4e7"
              strokeWidth={1.5}
              mobileStrokeWidth={1.3}
              textAlign="center"
            >
              Book us now: crash.booking.official@gmail.com
            </HanddrawnText>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <HandDrawnFrame contentClassName="px-4 py-3 text-center">
            <HanddrawnText as="h3" fontSize={11} mobileFontSize={10} strokeColor="#d4d4d8" strokeWidth={1.5} textAlign="center" animation="jitter">
              Loud Energy
            </HanddrawnText>
          </HandDrawnFrame>
          <HandDrawnFrame contentClassName="px-4 py-3 text-center">
            <HanddrawnText as="h3" fontSize={11} mobileFontSize={10} strokeColor="#d4d4d8" strokeWidth={1.5} textAlign="center" animation="jitter">
              Raw Hardcore Sound
            </HanddrawnText>
          </HandDrawnFrame>
          <HandDrawnFrame contentClassName="px-4 py-3 text-center">
            <HanddrawnText as="h3" fontSize={11} mobileFontSize={10} strokeColor="#d4d4d8" strokeWidth={1.5} textAlign="center" animation="jitter">
              Rowdy Crowds
            </HanddrawnText>
          </HandDrawnFrame>
        </div>

        <div>
          <HanddrawnText fontSize={16} mobileFontSize={14} strokeWidth={1.5} textAlign="center">
            CRASH is a hardcore punk rock band hailing from Kansas City, Missouri. Formed by Knoxx, and supported by members Cash and Fish, this group has quickly become a staple of the KC DIY scene, known for their explosive sets in local intimate venues like The Farewell and Sk8bar.
          </HanddrawnText>
          <div className="h-8" />
          <HanddrawnText fontSize={16} mobileFontSize={14} strokeWidth={1.5} textAlign="center">
            Blending the speed of 80s hardcore with a modern, rowdy energy, CRASH delivers a sound that is as loud and unapologetic. If you&apos;re looking for the next great Midwest punk record or a chaotic live experience in the Crossroads, CRASH is exactly what you&apos;ve been waiting for.
          </HanddrawnText>
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
            <HanddrawnText as="h3" fontSize={12} mobileFontSize={10} strokeColor="#d4d4d8" strokeWidth={1.5} textAlign="center">
              Stay connected
            </HanddrawnText>
          </div>
          <SocialMediaLinks compact />
        </div>
      </section>
    </HandDrawnFrame>
  );
}