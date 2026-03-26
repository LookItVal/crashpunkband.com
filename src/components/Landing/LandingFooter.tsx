import HandDrawnFrame from "./HandDrawnFrame";
import SocialMediaLinks from "./SocialMediaLinks";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";

export default function LandingFooter() {
  return (
    <footer className="px-4 py-8">
      <HandDrawnFrame className="mx-auto max-w-5xl" contentClassName="px-6 py-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <img src="/Sigil_alt.png" alt="CRASH Sigil" className="h-16 w-auto" />
          <SocialMediaLinks compact />
          <div className="max-w-120">
            <HandwrittenText
              fontSize={11}
              mobileFontSize={9}
              strokeColor="#a1a1aa"
              strokeWidth={2}
              textAlign="center"
            >
              {"© 2024 CRASH. All rights reserved."}
            </HandwrittenText>
          </div>
        </div>
      </HandDrawnFrame>
    </footer>
  );
}