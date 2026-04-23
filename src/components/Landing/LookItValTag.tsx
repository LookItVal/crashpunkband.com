import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";
import HighlightButton from "./HighlightButton";

export default function LookItValTag() {
  return (
    <div className="pb-5 w-full flex flex-col sm:flex-row items-center justify-center">
      <div className="max-w-105">
        <HandwrittenText fontSize={12} strokeWidth={1.5} textAlign="center">
          Page designed and drawn up by bassist and web developer: 
        </HandwrittenText>
      </div>
      <div className="w-25">
        <HighlightButton
          href="https://lookitval.com"
          target="_blank"
          rel="noreferrer"
          className="px-3"
        >
          <HandwrittenText fontSize={12} strokeWidth={1.5}>
            Valencia
          </HandwrittenText>
        </HighlightButton>
      </div>
    </div>
  );
}