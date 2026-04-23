import Image from "next/image";
import HandDrawnFrame from "./HandDrawnFrame";
import SocialMediaLinks from "./SocialMediaLinks";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";

export default function LandingFooter() {
  return (
    <footer className="px-4 py-8">
      <HandDrawnFrame className="mx-auto max-w-5xl" contentClassName="px-6 py-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src="/Sigil_alt.webp" alt="CRASH Sigil" width={64} height={64} className="h-16 w-auto" />
          <SocialMediaLinks compact />
          <div className="max-w-120">
            <HandwrittenText
              fontSize={11}
              mobileFontSize={9}
              strokeColor="#a1a1aa"
              strokeWidth={1.5}
              textAlign="center"
            >
              {`©\u00a0${new Date().getFullYear()}\u00a0CRASH.\u00a0All\u00a0rights\u00a0reserved.`}
            </HandwrittenText>
          </div>
        </div>
      </HandDrawnFrame>
    </footer>
  );
}