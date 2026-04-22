import Image from "next/image";
import HandDrawnFrame from "./HandDrawnFrame";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";

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
            as="h2"
            textAlign="center"
            className="leading-tight"
            fontSize={24}
            mobileFontSize={18}
            strokeWidth={1.8}
            mobileStrokeWidth={1.5}
          >
            CASH, KNOXX, and FISH are CRASH
          </HandwrittenText>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {members.map((member) => (
            <HandDrawnFrame key={member.name} className="h-full" contentClassName="p-5">
              <article className="flex h-full flex-col">
                <HandDrawnFrame contentClassName="p-1">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={member.photo}
                      alt={`${member.name} of CRASH`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
