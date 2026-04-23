import HandDrawnFrame from "./HandDrawnFrame";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";
import { buildResponsiveSrcSet } from "@/lib/images/responsive";

const members = [
  {
    name: "CASH",
    role: "Guitars",
    photo: "/photos/CASHblack.webp",
  },
  {
    name: "KNOXX",
    role: "Vocals",
    photo: "/photos/KNOXXblack.webp",
  },
  {
    name: "FISH",
    role: "Drums",
    photo: "/photos/FISHblack.webp",
  },
];

export default function BandMembersSection() {
  return (
    <HandDrawnFrame contentClassName="p-6 md:p-8">
      <section>
        <div className="mb-6 w-full">
          <HandwrittenText
            as="h1"
            textAlign="center"
            className="leading-tight"
            fontSize={24}
            mobileFontSize={18}
            strokeWidth={1.8}
            mobileStrokeWidth={1.5}
          >
            CRASH: Kansas City&apos;s Punk Rock Powerhouse
          </HandwrittenText>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {members.map((member, index) => (
            <HandDrawnFrame key={member.name} className="h-full" contentClassName="p-5">
              <article className="flex h-full flex-col">
                <HandDrawnFrame contentClassName="p-1">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <img
                      src={member.photo}
                      srcSet={buildResponsiveSrcSet(member.photo, [192, 256, 320, 384, 512, 640])}
                      sizes="(max-width: 1024px) calc(100vw - 5rem), 33vw"
                      alt={`${member.name} of CRASH`}
                      className="h-full w-full object-cover"
                      fetchPriority={index === 0 ? "high" : "auto"}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 shadow-[inset_0_0_10px_10px_rgba(0,0,0,1)]"
                    />
                  </div>
                </HandDrawnFrame>

                <div className="space-y-1 px-2 pt-3 pb-2">
                  <HandwrittenText as="h3" fontSize={14} mobileFontSize={11} strokeWidth={1.7} animation="jitter">
                    {member.name}
                  </HandwrittenText>
                  <HandwrittenText fontSize={12} mobileFontSize={10} strokeColor="#d4d4d8" strokeWidth={1.5}>
                    {member.role}
                  </HandwrittenText>
                </div>
              </article>
            </HandDrawnFrame>
          ))}
        </div>
      </section>
    </HandDrawnFrame>
  );
}
